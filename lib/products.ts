export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string;
  description?: string;
  sizes?: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Vintage Denim Jacket",
    price: 45,
    image_url: "/hero-1.png",
    category: "Jackets",
    description: "Curated vintage denim with a relaxed fit.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "Minimalist Oversized Tee",
    price: 25,
    image_url: "/hero-2.png",
    category: "Tops",
    description: "Heavyweight cotton tee with minimal branding.",
    sizes: ["S", "M", "L"],
  },
];