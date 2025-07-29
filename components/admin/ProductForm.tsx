import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { X, Link as LinkIcon } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product | Omit<Product, 'id' | 'order'>) => void;
  onClose: () => void;
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: '',
  order: 0,
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (product) {
        const { id, ...productData } = product;
        setFormData(productData);
        if (product.imageUrl) {
            setImagePreview(product.imageUrl);
        }
    } else {
        setFormData(emptyProduct);
        setImagePreview(null);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
     if (name === 'imageUrl') {
        setImagePreview(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        alert("Por favor, adicione uma imagem para o produto.");
        return;
    }
    const productToSave = product ? { ...formData, id: product.id } : formData;
    onSave(productToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-secondary">{product ? 'Editar Produto' : 'Adicionar Produto'}</h2>
          <button onClick={onClose}><X className="text-slate-500 hover:text-slate-800" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome do Produto" className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrição" rows={3} className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Preço" className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Categoria" className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Imagem do Produto</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Pré-visualização" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-base-200 flex-shrink-0" />}
                <div className="relative flex-grow w-full">
                    <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        name="imageUrl" 
                        value={formData.imageUrl} 
                        onChange={handleChange} 
                        placeholder="Cole uma URL de imagem" 
                        className="w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                        required 
                    />
                </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t mt-2">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold">
                Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};