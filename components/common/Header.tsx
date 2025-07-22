
import React from 'react';
import { Dog } from 'lucide-react';
import { ShoppingCart } from './ShoppingCart';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary shadow-md sticky top-0 z-40 text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Dog size={32} />
          <h1 className="text-2xl font-bold">PetShop Alegria</h1>
        </div>
        <ShoppingCart />
      </div>
    </header>
  );
};