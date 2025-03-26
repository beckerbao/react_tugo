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
  tour_name: string;
  type: string;
  user: User;
}

export interface PostsResponse {
  cursor: number;
  page: number;
  page_size: number;
  posts: Post[];
}