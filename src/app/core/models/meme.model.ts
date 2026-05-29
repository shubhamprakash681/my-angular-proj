export interface User {
  id: string;
  name: string;
  team: string;
}

export type SortOrder = 'newest' | 'oldest';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  team: string;
  tags: string[];
  mood: string;
  timestamp: number;
  title?: string;
  body: string;
}

export interface Like {
  userId: string;
  postId: string;
}

export interface Bookmark {
  userId: string;
  postId: string;
}

export interface Flag {
  id: string;
  userId: string;
  postId: string;
  reason: string;
  status: 'open' | 'reviewed' | 'dismissed';
  timestamp: number;
}

export interface FeedPreferences {
  search: string;
  team: string;
  mood: string;
  tags: string[];
  savedOnly: boolean;
  likedOnly: boolean;
  sort: SortOrder;
}

export interface PostDraft {
  title: string;
  body: string;
  tags: string;
  mood: string;
}

export interface EnrichedPost extends Post {
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isFlagged: boolean;
}
