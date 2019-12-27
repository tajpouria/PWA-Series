export interface Post {
  id: string;
  title: string;
  image: string;
  location: string;
}

export type Posts = Record<string, Post>;
