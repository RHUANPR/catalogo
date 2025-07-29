import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product, CartItem, Theme, AnalyticsData } from '../types';
import { INITIAL_PRODUCTS, INITIAL_THEME } from '../constants';
import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  onSnapshot,
  query,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';

interface AppContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'order'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProductsOrder: (products: Product[]) => Promise<void>;
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
  resetAnalytics: () => void;
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
    
    const initializeProducts = async () => {
        const snapshot = await getDocs(productsCollectionRef);
        if (snapshot.empty) {
            console.log("No products found, seeding database...");
            const batch = writeBatch(db);
            INITIAL_PRODUCTS.forEach(product => {
                const docRef = doc(db, 'products', product.id);
                batch.set(docRef, product);
            });
            await batch.commit();
        }
    };

    initializeProducts().catch(console.error);

    const q = query(productsCollectionRef);
    const unsubscribe = onSnapshot(q, snapshot => {
        const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
        // Sort client-side, providing a fallback for products without an 'order' property.
        // Products without an 'order' will be displayed at the end.
        productsData.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
        setProducts(productsData);
    });
    
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
  
  const addProduct = async (productData: Omit<Product, 'id' | 'order'>) => {
    try {
      const maxOrder = products.length > 0 ? Math.max(...products.map(p => p.order).filter(o => o !== null && o !== undefined)) : -1;
      const newProductData = { ...productData, order: maxOrder + 1 };
      await addDoc(collection(db, 'products'), newProductData);
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

  const updateProductsOrder = async (reorderedProducts: Product[]) => {
    try {
      const batch = writeBatch(db);
      reorderedProducts.forEach((product, index) => {
        const productDocRef = doc(db, 'products', product.id);
        batch.update(productDocRef, { order: index });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error updating products order: ", error);
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

  const resetAnalytics = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados dos gráficos? Esta ação não pode ser desfeita.')) {
      setAnalyticsData(initialAnalytics);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);

  return (
    <AppContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, updateProductsOrder, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, theme, setTheme, isAdmin, login, logout, analyticsData, trackQuoteCompletion, getSessionId, resetAnalytics }}>
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