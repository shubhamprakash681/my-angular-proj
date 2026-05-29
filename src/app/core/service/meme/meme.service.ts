import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Bookmark, Like, Post, User } from '../../models/meme.model';

@Injectable({ providedIn: 'root' })
export class MemeService {
  private storage = inject(StorageService);

  posts = signal<Post[]>([]);
  likes = signal<Like[]>([]);
  bookmarks = signal<Bookmark[]>([]);

  currentUser = signal<User>({ id: 'u1', name: 'Dev User', team: 'Frontend' });

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    let savedPosts = this.storage.getItem<Post[]>('posts');
    if (!savedPosts || savedPosts.length === 0) {
      savedPosts = [
        {
          id: 'p1',
          authorId: 'u2',
          authorName: 'Backend Bob',
          team: 'Backend',
          tags: ['db', 'pain'],
          mood: 'Frustrated',
          timestamp: Date.now() - 100000,
          title: 'Migrations',
          body: 'POV: You dropped the production database.',
        },
        {
          id: 'p2',
          authorId: 'u1',
          authorName: 'Dev User',
          team: 'Frontend',
          tags: ['css', 'magic'],
          mood: 'Happy',
          timestamp: Date.now() - 5000,
          body: '||flex-direction: column|| fixes everything.',
        },
      ];
      this.storage.setItem('posts', savedPosts);
    }
    this.posts.set(savedPosts);
    this.likes.set(this.storage.getItem<Like[]>('likes') || []);
    this.bookmarks.set(this.storage.getItem<Bookmark[]>('bookmarks') || []);
  }

  addPost(postData: Partial<Post>) {
    const newPost: Post = {
      ...postData,
      id: Math.random().toString(36).substring(2, 9),
      authorId: this.currentUser().id,
      authorName: this.currentUser().name,
      team: this.currentUser().team,
      timestamp: Date.now(),
    } as Post;
    const updated = [newPost, ...this.posts()];
    this.posts.set(updated);
    this.storage.setItem('posts', updated);
  }

  updatePost(postId: string, updates: Partial<Post>) {
    const updated = this.posts().map((p) => (p.id === postId ? { ...p, ...updates } : p));
    this.posts.set(updated);
    this.storage.setItem('posts', updated);
  }

  deletePost(postId: string) {
    const updated = this.posts().filter((p) => p.id !== postId);
    this.posts.set(updated);
    this.storage.setItem('posts', updated);
  }

  toggleLike(postId: string) {
    const userId = this.currentUser().id;
    const currentLikes = this.likes();
    const exists = currentLikes.find((l) => l.postId === postId && l.userId === userId);
    const updated = exists
      ? currentLikes.filter((l) => l !== exists)
      : [...currentLikes, { postId, userId }];
    this.likes.set(updated);
    this.storage.setItem('likes', updated);
  }

  toggleBookmark(postId: string) {
    const userId = this.currentUser().id;
    const currentBms = this.bookmarks();
    const exists = currentBms.find((b) => b.postId === postId && b.userId === userId);
    const updated = exists
      ? currentBms.filter((b) => b !== exists)
      : [...currentBms, { postId, userId }];
    this.bookmarks.set(updated);
    this.storage.setItem('bookmarks', updated);
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
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp); // newest first by default
  });
}
