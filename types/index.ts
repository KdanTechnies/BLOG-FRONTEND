export interface User {
  email: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  featured_image?: string;
  created_at: string;
}

export interface Stats {
  total: number;
  published: number;
  drafts: number;
}