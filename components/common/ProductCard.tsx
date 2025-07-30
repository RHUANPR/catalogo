import React, { useState, useEffect } from 'react';
import { Product, ColorOption, SizeOption } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();
  const [currentImage, setCurrentImage] = useState(product.imageUrl);
  const [displayPrice, setDisplayPrice] = useState(product.price);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>();

  useEffect(() => {
    setCurrentImage(product.imageUrl);
    setDisplayPrice(product.price);
    setSelectedSize(undefined);
    setSelectedColor(undefined);
  }, [product]);

  const handleSelectColor = (color: ColorOption) => {
    setSelectedColor(color);
    setCurrentImage(color.imageUrl);
  };

  const handleSelectSize = (size: SizeOption) => {
    setSelectedSize(size.name);
    if (typeof size.price === 'number') {
        setDisplayPrice(size.price);
    }
  };

  const isAddToCartDisabled =
    (product.sizes && product.sizes.length > 0 && !selectedSize) ||
    (product.colors && product.colors.length > 0 && !selectedColor);

  const handleAddToCart = () => {
    if (isAddToCartDisabled) return;
    addToCart(product, selectedSize, selectedColor);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <div className="relative w-full h-72 bg-base-100">
        <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div>
          <h3 className="text-lg font-semibold text-secondary">{product.name}</h3>
          <p className="text-sm text-slate-500 mt-2 h-10 line-clamp-2">
            {product.description}
          </p>

          <div className="space-y-3 mt-4 min-h-[5rem]">
            {/* Color Variants */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-500">Cor:</span>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {product.colors.map((color, index) => (
                    <button
                      key={`${color.name}-${index}`}
                      title={color.name}
                      onClick={() => handleSelectColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor?.name === color.name
                          ? 'border-primary scale-110 ring-2 ring-offset-1 ring-primary'
                          : 'border-base-300'
                      }`}
                    >
                      <img
                        src={color.imageUrl}
                        alt={color.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variants */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-500">Tamanho:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.sizes.map((size, index) => (
                    <button
                      key={`${size.name}-${index}`}
                      onClick={() => handleSelectSize(size)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                        selectedSize === size.name
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-secondary hover:bg-base-200 border-base-300'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-auto pt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-primary">
            {displayPrice.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={isAddToCartDisabled}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
            title={isAddToCartDisabled ? 'Selecione tamanho e cor' : 'Adicionar ao carrinho'}
          >
            <ShoppingCart size={18} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};