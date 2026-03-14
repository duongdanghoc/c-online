export interface Category {
  id: number;
  slug: string;
  name: string;
  imageUrl: string;
  parentId?: number;
  children?: Category[];
  productCount?: number;
  parents?: Category[];
  description?: string;
}
