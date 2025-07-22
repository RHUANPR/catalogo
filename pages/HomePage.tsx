
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { ProductCard } from '../components/common/ProductCard';

export const HomePage: React.FC = () => {
  const { products } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = useMemo(() => {
    const allCategories = products.map(p => p.category);
    return ['Todos', ...Array.from(new Set(allCategories))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-base-100">
      <Header />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary mb-4">Nossos Produtos</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-secondary hover:bg-base-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <footer className="bg-secondary text-white mt-12 py-6">
        <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} PetShop Alegria. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};