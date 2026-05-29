export interface User {
  id: string;
  name: string;
  team: string;
}

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
