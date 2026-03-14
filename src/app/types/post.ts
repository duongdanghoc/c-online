export interface PostCategory {
  id: number;
  slug: string;
  name: string;
  imageUrl: string;
  parentId?: number;
  children?: PostCategory[];
  parents?: PostCategory[];
}

export interface Post {
  title: string;
  abstract: string;
  slug: string;
  imageUrl: string;
  categoryName: string;
  author?: PostAuthor;
  toc: string;
  keywords?: string[];
}

export interface PostInfo extends Post {
  content: string;
  metaTitle: string;
  metaDescription: string;
  toc: string;
  categories?: PostCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PostAuthor {
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  position?: string;
}
