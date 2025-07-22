
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { X, Image, Link2 } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
  });
  const [imageSource, setImageSource] = useState<'url' | 'file'>('url');

  useEffect(() => {
    if (product) {
      setFormData(product);
      if (product.imageUrl && product.imageUrl.startsWith('data:image')) {
        setImageSource('file');
      } else {
        setImageSource('url');
      }
    } else {
      setFormData({ name: '', description: '', price: 0, category: '', imageUrl: 'https://picsum.photos/400/400' });
      setImageSource('url');
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave: Product = {
      ...formData,
      id: product?.id || `prod_${new Date().getTime()}`,
    };
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
            <div className="flex border border-gray-300 rounded-lg p-1 w-min mb-3 bg-base-200">
              <button type="button" onClick={() => setImageSource('url')} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${imageSource === 'url' ? 'bg-primary text-white shadow' : 'text-slate-600 hover:bg-gray-100'}`}>
                <Link2 size={16}/> URL
              </button>
              <button type="button" onClick={() => setImageSource('file')} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${imageSource === 'file' ? 'bg-primary text-white shadow' : 'text-slate-600 hover:bg-gray-100'}`}>
                <Image size={16}/> Upload
              </button>
            </div>
            {imageSource === 'url' ? (
              <input name="imageUrl" value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl} onChange={handleChange} placeholder="https://exemplo.com/imagem.png" className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
            ) : (
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 cursor-pointer" />
            )}
          </div>

          {formData.imageUrl && (
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Pré-visualização:</p>
              <img src={formData.imageUrl} alt="Pré-visualização" className="w-32 h-32 object-cover rounded-lg border-2 border-base-200" />
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t mt-2">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
