export type Category = 'jewelry' | 'bags' | 'makeup';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  subcategory: string;
  images: string[];
  stock: number;
  featured?: boolean;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
  image: string;
}
