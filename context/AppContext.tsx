import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import 'firebase/compat/firestore';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product, CartItem, Theme, AnalyticsData, ColorOption, SizeOption } from '../types';
import { INITIAL_THEME, ADMIN_PASSWORD } from '../constants';
import { db } from '../firebase/config';

interface AppContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'order'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProductsOrder: (products: Product[]) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, selectedSize?: string, selectedColor?: ColorOption) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  isAdmin: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [analyticsData, setAnalyticsData] = useLocalStorage<AnalyticsData>('petshop-analytics-v2', initialAnalytics);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const unsubscribe = db.collection('products').onSnapshot(
      snapshot => {
        const productsData = snapshot.docs.map(doc => {
          const productData = doc.data();

          // Extrair preço numérico corretamente
          let numericPrice = 0;
          if (typeof productData.price === 'number') {
            numericPrice = productData.price;
          } else if (
            productData.price &&
            typeof productData.price === 'object' &&
            'amount' in productData.price &&
            typeof productData.price.amount === 'number'
          ) {
            numericPrice = productData.price.amount;
          }

          const product: Product = { ...productData, price: numericPrice, id: doc.id } as Product;

          // Sanitização robusta dos tamanhos
          if (product.sizes && Array.isArray(product.sizes)) {
            product.sizes = product.sizes
              .map(size => {
                if (typeof size === 'string') {
                  return { name: size, price: numericPrice };
                }
                if (typeof size === 'object' && size !== null && 'name' in size) {
                  const name = (size as any).name;
                  let price = (size as any).price;
                  if (typeof name !== 'string') return null;
                  if (typeof price !== 'number') price = numericPrice;
                  return { name, price };
                }
                return null;
              })
              .filter((s): s is SizeOption => s !== null);
          } else if (product.sizes) {
            product.sizes = [];
          }

          // Sanitização robusta das cores
          if (product.colors && Array.isArray(product.colors)) {
            product.colors = product.colors
              .map(color => {
                if (
                  typeof color === 'object' &&
                  color !== null &&
                  'name' in color &&
                  'imageUrl' in color
                ) {
                  const name = (color as any).name;
                  const imageUrl = (color as any).imageUrl;
                  if (typeof name === 'string' && typeof imageUrl === 'string') {
                    return { name, imageUrl };
                  }
                }
                return null;
              })
              .filter((c): c is ColorOption => c !== null);
          } else if (product.colors) {
            product.colors = [];
          }

          return product;
        });

        productsData.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
        setProducts(productsData);
      },
      error => {
        console.error('Error fetching products: ', error);
      }
    );

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
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'order'>) => {
    try {
      const maxOrder =
        products.length > 0 ? Math.max(...products.map(p => p.order).filter(o => o !== null && o !== undefined)) : -1;
      const newProductData = { ...productData, order: maxOrder + 1 };
      await db.collection('products').add(newProductData);
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { id, ...productData } = product;
      await db.collection('products').doc(id).update(productData);
    } catch (error) {
      console.error('Error updating product: ', error);
    }
  };

  const updateProductsOrder = async (reorderedProducts: Product[]) => {
    try {
      const batch = db.batch();
      reorderedProducts.forEach((product, index) => {
        const productDocRef = db.collection('products').doc(product.id);
        batch.update(productDocRef, { order: index });
      });
      await batch.commit();
    } catch (error) {
      console.error('Error updating products order: ', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await db.collection('products').doc(productId).delete();
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: ColorOption) => {
    const cartItemId = `${product.id}-${selectedSize || 'nosize'}-${selectedColor?.name || 'nocolor'}`;

    let finalPrice = product.price;
    if (selectedSize && product.sizes && product.sizes.length > 0) {
      const sizeOption = product.sizes.find(s => s.name === selectedSize);
      if (sizeOption) {
        finalPrice = sizeOption.price;
      }
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);

      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      const newCartItem: CartItem = {
        cartItemId,
        id: product.id,
        name: product.name,
        price: finalPrice,
        imageUrl: selectedColor?.imageUrl || product.imageUrl,
        quantity: 1,
        selectedSize,
        selectedColor,
      };
      return [...prevCart, newCartItem];
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

  const removeFromCart = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.cartItemId !== cartItemId);
      }
      return prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const trackQuoteCompletion = () => {
    setAnalyticsData(prev => ({ ...prev, quotesCompleted: prev.quotesCompleted + 1 }));
  };

  const resetAnalytics = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados dos gráficos? Esta ação não pode ser desfeita.')) {
      setAnalyticsData(initialAnalytics);
      // Força reinicialização no próximo carregamento
      localStorage.removeItem('petshop-analytics-v2');
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const login = async (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
    } else {
      throw new Error('Senha incorreta.');
    }
  };

  const logout = async () => {
    setIsAdmin(false);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductsOrder,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        theme,
        setTheme,
        isAdmin,
        login,
        logout,
        analyticsData,
        trackQuoteCompletion,
        getSessionId,
        resetAnalytics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must ser usado dentro de um AppProvider');
  }
  return context;
};
