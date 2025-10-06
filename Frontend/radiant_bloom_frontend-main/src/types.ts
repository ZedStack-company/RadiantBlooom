export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  image: string[];       // ✅ hamesha array hoga
  features: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;     // ✅ add kiya
  updatedAt: string;     // ✅ add kiya
}
// CartItem is defined in cartSlice.ts as extending Product
// export interface CartItem extends Product {
//   quantity: number;
// }
export type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">;
