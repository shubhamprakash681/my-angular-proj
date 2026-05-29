import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import {
  Bookmark,
  EnrichedPost,
  FeedPreferences,
  Flag,
  Like,
  Post,
  PostDraft,
  User,
} from '../../models/meme.model';

@Injectable({ providedIn: 'root' })
export class MemeService {
  private storage = inject(StorageService);

  private readonly storageKeys = {
    currentUser: 'currentUser',
    posts: 'posts',
    likes: 'likes',
    bookmarks: 'bookmarks',
    flags: 'flags',
    preferences: 'preferences',
  };

  readonly defaultPreferences: FeedPreferences = {
    search: '',
    team: '',
    mood: '',
    tags: [],
    savedOnly: false,
    likedOnly: false,
    sort: 'newest',
  };

  posts = signal<Post[]>([]);
  likes = signal<Like[]>([]);
  bookmarks = signal<Bookmark[]>([]);
  flags = signal<Flag[]>([]);
  preferences = signal<FeedPreferences>(this.defaultPreferences);

  currentUser = signal<User>({ id: 'u1', name: 'Dev User', team: 'Frontend' });

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const savedUser = this.storage.getItem<User>(this.storageKeys.currentUser);
    if (savedUser) {
      this.currentUser.set(savedUser);
    } else {
      this.storage.setItem(this.storageKeys.currentUser, this.currentUser());
    }

    let savedPosts = this.storage.getItem<Post[]>(this.storageKeys.posts);
    if (!savedPosts || savedPosts.length === 0) {
      savedPosts = [
        {
          id: 'p1',
          authorId: 'u2',
          authorName: 'Backend Bob',
          team: 'Backend',
          tags: ['db', 'pain'],
          mood: 'Frustrated',
          timestamp: Date.now() - 1000 * 60 * 18,
          title: 'Migrations',
          body: 'POV: You dropped the production database.',
        },
        {
          id: 'p2',
          authorId: 'u3',
          authorName: 'QA Quinn',
          team: 'QA',
          tags: ['release', 'bugs'],
          mood: 'Chaotic',
          timestamp: Date.now() - 1000 * 60 * 60 * 3,
          title: 'Release day',
          body: 'Ship it, they said. ||The staging bug was production all along.||',
        },
        {
          id: 'p3',
          authorId: 'u1',
          authorName: 'Dev User',
          team: 'Frontend',
          tags: ['css', 'magic'],
          mood: 'Happy',
          timestamp: Date.now() - 1000 * 60 * 60 * 24,
          body: 'POV: ||flex-direction: column|| fixes everything.',
        },
        {
          id: 'p4',
          authorId: 'u4',
          authorName: 'Product Priya',
          team: 'Product',
          tags: ['meeting', 'scope'],
          mood: 'Optimistic',
          timestamp: Date.now() - 1000 * 60 * 60 * 28,
          title: 'Tiny change',
          body: 'Can we just add one small dropdown that changes the entire workflow?',
        },
      ];
      this.storage.setItem(this.storageKeys.posts, savedPosts);
    }

    this.posts.set(savedPosts);
    this.likes.set(this.storage.getItem<Like[]>(this.storageKeys.likes) || []);
    this.bookmarks.set(this.storage.getItem<Bookmark[]>(this.storageKeys.bookmarks) || []);
    this.flags.set(this.storage.getItem<Flag[]>(this.storageKeys.flags) || []);
    this.preferences.set({
      ...this.defaultPreferences,
      ...(this.storage.getItem<FeedPreferences>(this.storageKeys.preferences) || {}),
    });
  }

  addPost(postData: Pick<Post, 'body' | 'mood' | 'tags'> & Partial<Pick<Post, 'title'>>) {
    const newPost: Post = {
      ...postData,
      id: this.createId('p'),
      authorId: this.currentUser().id,
      authorName: this.currentUser().name,
      team: this.currentUser().team,
      timestamp: Date.now(),
    };
    const updated = [newPost, ...this.posts()];
    this.posts.set(updated);
    this.storage.setItem(this.storageKeys.posts, updated);
  }

  updatePost(
    postId: string,
    updates: Pick<Post, 'body' | 'mood' | 'tags'> & Partial<Pick<Post, 'title'>>,
  ) {
    const updated = this.posts().map((p) => (p.id === postId ? { ...p, ...updates } : p));
    this.posts.set(updated);
    this.storage.setItem(this.storageKeys.posts, updated);
  }

  deletePost(postId: string) {
    const updated = this.posts().filter((p) => p.id !== postId);
    this.posts.set(updated);
    this.storage.setItem(this.storageKeys.posts, updated);
    this.likes.set(this.likes().filter((l) => l.postId !== postId));
    this.bookmarks.set(this.bookmarks().filter((b) => b.postId !== postId));
    this.flags.set(this.flags().filter((f) => f.postId !== postId));
    this.storage.setItem(this.storageKeys.likes, this.likes());
    this.storage.setItem(this.storageKeys.bookmarks, this.bookmarks());
    this.storage.setItem(this.storageKeys.flags, this.flags());
  }

  toggleLike(postId: string) {
    const userId = this.currentUser().id;
    const currentLikes = this.likes();
    const exists = currentLikes.find((l) => l.postId === postId && l.userId === userId);
    const updated = exists
      ? currentLikes.filter((l) => l !== exists)
      : [...currentLikes, { postId, userId }];
    this.likes.set(updated);
    this.storage.setItem(this.storageKeys.likes, updated);
  }

  toggleBookmark(postId: string) {
    const userId = this.currentUser().id;
    const currentBms = this.bookmarks();
    const exists = currentBms.find((b) => b.postId === postId && b.userId === userId);
    const updated = exists
      ? currentBms.filter((b) => b !== exists)
      : [...currentBms, { postId, userId }];
    this.bookmarks.set(updated);
    this.storage.setItem(this.storageKeys.bookmarks, updated);
  }

  flagPost(postId: string, reason: string) {
    const trimmedReason = reason.trim();
    if (!trimmedReason) return;

    const userId = this.currentUser().id;
    const existing = this.flags().find((flag) => flag.postId === postId && flag.userId === userId);
    const updated = existing
      ? this.flags().map((flag) =>
          flag === existing
            ? { ...flag, reason: trimmedReason, status: 'open' as const, timestamp: Date.now() }
            : flag,
        )
      : [
          ...this.flags(),
          {
            id: this.createId('f'),
            userId,
            postId,
            reason: trimmedReason,
            status: 'open' as const,
            timestamp: Date.now(),
          },
        ];

    this.flags.set(updated);
    this.storage.setItem(this.storageKeys.flags, updated);
  }

  updatePreferences(updates: Partial<FeedPreferences>) {
    const next = {
      ...this.preferences(),
      ...updates,
    };
    this.preferences.set(next);
    this.storage.setItem(this.storageKeys.preferences, next);
  }

  resetPreferences() {
    this.preferences.set(this.defaultPreferences);
    this.storage.setItem(this.storageKeys.preferences, this.defaultPreferences);
  }

  draftKey(postId?: string) {
    const userId = this.currentUser().id;
    return postId ? `draft:${userId}:post:${postId}` : `draft:${userId}:new`;
  }

  getDraft(postId?: string) {
    return this.storage.getItem<PostDraft>(this.draftKey(postId));
  }

  saveDraft(draft: PostDraft, postId?: string) {
    this.storage.setItem(this.draftKey(postId), draft);
  }

  removeDraft(postId?: string) {
    this.storage.removeItem(this.draftKey(postId));
  }

  enrichedPosts = computed(() => {
    return this.posts()
      .map((post) => {
        const postLikes = this.likes().filter((l) => l.postId === post.id);
        return {
          ...post,
          likesCount: postLikes.length,
          isLiked: postLikes.some((l) => l.userId === this.currentUser().id),
          isSaved: this.bookmarks().some(
            (b) => b.postId === post.id && b.userId === this.currentUser().id,
          ),
          isFlagged: this.flags().some(
            (flag) => flag.postId === post.id && flag.userId === this.currentUser().id,
          ),
        };
      }) satisfies EnrichedPost[];
  });

  filteredPosts = computed(() => {
    const preferences = this.preferences();
    const query = preferences.search.trim().toLowerCase();
    const selectedTags = new Set(preferences.tags);

    const filtered = this.enrichedPosts().filter((post) => {
      const matchesSearch =
        !query ||
        post.title?.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query);
      const matchesTeam = !preferences.team || post.team === preferences.team;
      const matchesMood = !preferences.mood || post.mood === preferences.mood;
      const matchesTags =
        selectedTags.size === 0 || post.tags.some((tag) => selectedTags.has(tag));
      const matchesSaved = !preferences.savedOnly || post.isSaved;
      const matchesLiked = !preferences.likedOnly || post.isLiked;

      return (
        matchesSearch && matchesTeam && matchesMood && matchesTags && matchesSaved && matchesLiked
      );
    });

    return [...filtered].sort((a, b) =>
      preferences.sort === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp,
    );
  });

  teams = computed(() => [...new Set(this.posts().map((post) => post.team))].sort());

  moods = computed(() => [...new Set(this.posts().map((post) => post.mood))].sort());

  tags = computed(() => [...new Set(this.posts().flatMap((post) => post.tags))].sort());

  private createId(prefix: string) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
