export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  images?: string[];
  sizes?: string[];
  title?: string;
  isNew?: boolean;
  inStock?: boolean;
}