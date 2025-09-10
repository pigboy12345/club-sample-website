// Central shared types matching Supabase tables.
export interface Category {
  id: number;
  name: string;
  slug?: string | null;
  created_at?: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string; // ISO date string
  image: string; // URL
  category_id: number; // FK -> categories.id
  created_at?: string;
  category?: Category; // joined
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string; // ISO date
  time: string; // HH:mm or free text
  type: string;
  priority: 'low' | 'medium' | 'high';
  is_pinned: boolean;
  created_at?: string;
}

export interface GalleryItem {
  id: number;
  filename: string;
  src: string; // URL
  created_at?: string;
}
