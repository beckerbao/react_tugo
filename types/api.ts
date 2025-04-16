export interface User {
  id: number;
  name: string;
  profile_image: string;
}

export interface Post {
  id: number;
  content: string;
  created_at: string;
  images: string[];
  likes: number;
  loves: number;
  tour_name: string;
  type: string;
  user: User;
  user_reaction?: 'like' | 'love' | null;
}

export interface PostsResponse {
  cursor: number;
  page: number;
  page_size: number;
  posts: Post[];
}