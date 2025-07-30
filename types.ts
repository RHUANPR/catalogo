

export interface ColorOption {
  name: string;
  imageUrl: string;
}

export interface SizeOption {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  order: number;
  sizes?: SizeOption[];
  colors?: ColorOption[];
}

export interface CartItem {
  cartItemId: string; // Unique ID for this specific cart entry (e.g., product-id-size-color)
  id: string; // The original product ID
  name: string;
  price: number;
  imageUrl: string; // Will hold the variant image URL if applicable
  quantity: number;
  selectedSize?: string;
  selectedColor?: ColorOption;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  base100: string;
  base200: string;
  base300: string;
}

export interface ProductAnalytics {
  [productId: string]: {
    name: string;
    addedToCart: number;
  };
}

export interface AnalyticsData {
  productStats: ProductAnalytics;
  sessionsWithCartItems: Set<string>; // Using a set of session IDs
  quotesCompleted: number;
  totalVisits: number;
}