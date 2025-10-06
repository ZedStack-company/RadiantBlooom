export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string[];
  category: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}
export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    id: "skincare",
    name: "Skincare",
    image:"/pics/img3.png",
    subcategories: ["Cleansers", "Moisturizers", "Serums", "Sunscreen", "Masks"]
  },
  {
    id: "makeup",
    name: "Makeup",
    image:"/pics/img4.png",
    subcategories: ["Foundation", "Lipstick", "Eyeshadow", "Mascara", "Blush"]
  },
  {
    id: "haircare",
    name: "Hair Care",
    image:"/pics/img2.png",
    subcategories: ["Shampoo", "Conditioner", "Hair Oil", "Styling", "Treatment"]
  },
  {
    id: "fragrance",
    name: "Fragrance",
    image:"/pics/img6.png",
    subcategories: ["Perfume", "Body Spray", "Eau de Toilette", "Body Mist"]
  },
  {
    id: "tools",
    name: "Beauty Tools",
    image:"/pics/img7.png",
    subcategories: ["Brushes", "Sponges", "Mirrors", "Tweezers", "Applicators"]
  }
];

export const products: Product[] = [
  {
    id: "1",
    name: "Vitamin C Brightening Serum",
    brand: "GlowLux",
    price: 45.99,
    originalPrice: 59.99,
    image: ["/pics/img1.png"],
    category: "skincare",
    subcategory: "Serums",
    rating: 4.8,
    reviewCount: 324,
    description: "A powerful vitamin C serum that brightens and evens skin tone while providing antioxidant protection.",
    features: ["20% Vitamin C", "Hyaluronic Acid", "Antioxidant Rich", "Anti-aging"],
    inStock: true,
    isBestseller: true
  },
  {
    id: "2",
    name: "Luxe Matte Lipstick",
    brand: "VelvetKiss",
    price: 28.50,
    image: ["/pics/img2.png"],
    category: "makeup",
    subcategory: "Lipstick",
    rating: 4.6,
    reviewCount: 156,
    description: "Long-lasting matte lipstick with rich, velvety color that stays put all day.",
    features: ["8-hour wear", "Comfortable formula", "Transfer-resistant", "Cruelty-free"],
    inStock: true,
    isNew: true
  },
  {
    id: "3",
    name: "Hydrating Daily Moisturizer",
    brand: "AquaGlow",
    price: 32.00,
    image: ["/pics/img3.png"],
    category: "skincare",
    subcategory: "Moisturizers",
    rating: 4.7,
    reviewCount: 289,
    description: "Lightweight, fast-absorbing moisturizer that provides 24-hour hydration.",
    features: ["24-hour hydration", "Non-greasy", "SPF 15", "All skin types"],
    inStock: true
  },
  {
    id: "4",
    name: "Professional Makeup Brush Set",
    brand: "BeautyPro",
    price: 89.99,
    originalPrice: 119.99,
    image: ["/pics/img4.png"],
    category: "tools",
    subcategory: "Brushes",
    rating: 4.9,
    reviewCount: 445,
    description: "Complete set of 12 professional makeup brushes with premium synthetic bristles.",
    features: ["12-piece set", "Synthetic bristles", "Travel case included", "Cruelty-free"],
    inStock: true,
    isBestseller: true
  },
  {
    id: "5",
    name: "Revitalizing Argan Hair Oil",
    brand: "SilkStrand",
    price: 24.99,
    image: ["/pics/img5.png"],
    category: "haircare",
    subcategory: "Hair Oil",
    rating: 4.5,
    reviewCount: 198,
    description: "Pure argan oil that nourishes and repairs damaged hair while adding natural shine.",
    features: ["100% Pure Argan Oil", "Repairs damage", "Adds shine", "Heat protection"],
    inStock: true
  },
  {
    id: "6",
    name: "Enchanted Rose Perfume",
    brand: "Mystique",
    price: 75.00,
    image: ["/pics/img6.png"],
    category: "fragrance",
    subcategory: "Perfume",
    rating: 4.4,
    reviewCount: 87,
    description: "Elegant floral fragrance with notes of rose, jasmine, and vanilla.",
    features: ["Long-lasting", "Floral notes", "50ml bottle", "Gift packaging"],
    inStock: false,
    isNew: true
  }
];

export const reviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userName: "Sarah M.",
    rating: 5,
    comment: "Amazing serum! I've seen visible results in just 2 weeks. My skin looks brighter and more even.",
    date: "2024-01-15",
    verified: true
  },
  {
    id: "2",
    productId: "1",
    userName: "Jessica L.",
    rating: 4,
    comment: "Great product, though it took a bit longer to see results. Worth the wait!",
    date: "2024-01-10",
    verified: true
  },
  {
    id: "3",
    productId: "2",
    userName: "Emma R.",
    rating: 5,
    comment: "Perfect matte finish and the color is gorgeous. Stays on all day without drying my lips.",
    date: "2024-01-12",
    verified: true
  },
  {
    id: "4",
    productId: "4",
    userName: "Michelle K.",
    rating: 5,
    comment: "Best brush set I've ever owned! The quality is outstanding and they blend beautifully.",
    date: "2024-01-08",
    verified: true
  }
];

export const heroSlides = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "DISCOVER PREMIUM BEAUTY",
    description: "Elevate your beauty routine with our latest collection of premium cosmetics and skincare.",
    image:"/pics/banner1.jpg",

    cta: "Shop New Arrivals",
    theme: "orange",
     link: "/category/new-arrivals"
  },
  {
    id: 2,
    title: "Best Sellers",
    subtitle: "CUSTOMER FAVORITES",
    description: "Join thousands of satisfied customers and discover why these products are flying off our shelves.",
    image:"/pics/banner2.jpg",
    cta: "Shop Best Sellers",
    theme: "navy",
    link: "/category/bestsellers"
  },
  {
    id: 3,
    title: "Skincare Sale",
    subtitle: "UP TO 40% OFF",
    description: "Transform your skin with our award-winning skincare products. Limited time offer!",
    image:"/pics/banner5.jpg",
    cta: "Shop Sale",
    theme: "coral",
    link: "/category/sale"
  }
];