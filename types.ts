
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
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