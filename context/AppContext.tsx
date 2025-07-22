import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product, CartItem, Theme, AnalyticsData } from '../types';
import { INITIAL_THEME } from '../constants';
import { db } from '../firebase/config';
import { 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
} from 'firebase/firestore';

interface AppContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  analyticsData: AnalyticsData;
  trackQuoteCompletion: () => void;
  getSessionId: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialAnalytics: AnalyticsData = {
  productStats: {},
  sessionsWithCartItems: new Set<string>(),
  quotesCompleted: 0,
  totalVisits: 0,
};

function generateSessionId() {
    return Math.random().toString(36).substring(2, 15);
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useLocalStorage<CartItem[]>('petshop-cart', []);
  const [theme, setTheme] = useLocalStorage<Theme>('petshop-theme', INITIAL_THEME);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useLocalStorage<AnalyticsData>('petshop-analytics', initialAnalytics);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const productsCollectionRef = collection(db, 'products');
    
    // Set up the real-time listener for products
    const unsubscribe = onSnapshot(productsCollectionRef, snapshot => {
        const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
        setProducts(productsData);
    });
    
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Object.entries(theme).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}-color`;
      document.documentElement.style.setProperty(cssVarName, value);
    });
  }, [theme]);
  
  useEffect(() => {
    let currentSessionId = sessionStorage.getItem('sessionId');
    if (!currentSessionId) {
        currentSessionId = generateSessionId();
        sessionStorage.setItem('sessionId', currentSessionId);
        setAnalyticsData(prev => ({ ...prev, totalVisits: prev.totalVisits + 1 }));
    }
    setSessionId(currentSessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSessionId = () => {
    let currentSessionId = sessionStorage.getItem('sessionId');
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      sessionStorage.setItem('sessionId', currentSessionId);
    }
    return currentSessionId;
  }
  
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), productData);
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { id, ...productData } = product;
      const productDoc = doc(db, 'products', id);
      await updateDoc(productDoc, productData);
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const productDoc = doc(db, 'products', productId);
      await deleteDoc(productDoc);
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    setAnalyticsData(prev => {
      const newProductStats = { ...prev.productStats };
      if (!newProductStats[product.id]) {
        newProductStats[product.id] = { name: product.name, addedToCart: 0 };
      }
      newProductStats[product.id].addedToCart += 1;
      
      const newSessionsWithCartItems = new Set(prev.sessionsWithCartItems);
      newSessionsWithCartItems.add(getSessionId());
      
      return {
        ...prev,
        productStats: newProductStats,
        sessionsWithCartItems: newSessionsWithCartItems,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };
  
  const trackQuoteCompletion = () => {
    setAnalyticsData(prev => ({...prev, quotesCompleted: prev.quotesCompleted + 1 }));
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);

  return (
    <AppContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, theme, setTheme, isAdmin, login, logout, analyticsData, trackQuoteCompletion, getSessionId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};