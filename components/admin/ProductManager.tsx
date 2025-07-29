

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';
import { ProductForm } from './ProductForm';
import { Edit, Trash2, PlusCircle, GripVertical } from 'lucide-react';

export const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateProductsOrder } = useAppContext();
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

  const handleSave = (productData: Product | Omit<Product, 'id' | 'order'>) => {
    if ('id' in productData) {
      updateProduct(productData as Product);
    } else {
      addProduct(productData as Omit<Product, 'id' | 'order'>);
    }
    setIsFormOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItemIndex.current = index;
    // For smooth dragging visual
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.add('opacity-50');
      }
    }, 0);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragItemIndex.current === null || dragItemIndex.current === index) return;
    
    dragOverItemIndex.current = index;
    const newProducts = [...localProducts];
    const draggedItem = newProducts.splice(dragItemIndex.current, 1)[0];
    newProducts.splice(index, 0, draggedItem);
    
    dragItemIndex.current = index;
    setLocalProducts(newProducts);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.classList.remove('opacity-50');
    }
    updateProductsOrder(localProducts);
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-secondary">Gerenciar Produtos</h2>
        <button onClick={handleAdd} className="bg-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2 transition-colors">
          <PlusCircle size={20} />
          <span className="hidden sm:inline font-semibold">Adicionar Produto</span>
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {localProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow p-4"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <div className="flex items-start gap-4">
              <div className="cursor-grab touch-none text-slate-400 pt-1">
                <GripVertical size={20} />
              </div>
              <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold text-secondary leading-tight">{product.name}</p>
                <p className="text-sm text-slate-500 mt-1">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p className="text-xs text-slate-600 bg-slate-100 inline-block px-2 py-0.5 rounded-full mt-2">{product.category}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t mt-4 pt-3">
              <button 
                onClick={() => handleEdit(product)} 
                className="flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-md"
              >
                <Edit size={14} /> Editar
              </button>
              <button 
                onClick={() => handleDelete(product.id)} 
                className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 font-semibold px-3 py-1.5 rounded-md"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </div>
        ))}
         {products.length === 0 && (
            <div className="text-center py-10 px-4 bg-white rounded-lg shadow">
                <p className="text-slate-500">Nenhum produto cadastrado ainda.</p>
                <button onClick={handleAdd} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2 mx-auto">
                    <PlusCircle size={20} />
                    <span>Adicionar primeiro produto</span>
                </button>
            </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-base-200 text-left text-sm font-semibold text-secondary uppercase tracking-wider">
              <th className="p-4 w-12"></th>
              <th className="p-4">Produto</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200" onDragOver={handleDragOver}>
            {localProducts.length > 0 ? localProducts.map((product, index) => (
              <tr 
                key={product.id} 
                className="hover:bg-slate-50"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
              >
                <td className="p-4 text-center cursor-grab touch-none text-slate-400">
                    <GripVertical size={20} />
                </td>
                <td className="p-4 flex items-center gap-4">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                    <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.id}</p>
                    </div>
                </td>
                <td className="p-4">
                    <span className="text-xs font-medium text-slate-700 bg-slate-200 px-2 py-1 rounded-full">{product.category}</span>
                </td>
                <td className="p-4 font-medium text-slate-700">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-4">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => handleEdit(product)} title="Editar" className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} title="Excluir" className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="text-center py-10 px-4">
                        <p className="text-slate-500">Nenhum produto cadastrado ainda.</p>
                         <button onClick={handleAdd} className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2 mx-auto">
                            <PlusCircle size={20} />
                            <span>Adicionar primeiro produto</span>
                        </button>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <ProductForm 
          product={editingProduct}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};