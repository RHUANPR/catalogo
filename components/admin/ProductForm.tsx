
import React, { useState, useEffect } from 'react';
import { Product, ColorOption, SizeOption } from '../../types';
import { X, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

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
  sizes: [],
  colors: [],
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'order'> & { id?: string }>(emptyProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // States for variant inputs
  const [sizeNameInput, setSizeNameInput] = useState('');
  const [sizePriceInput, setSizePriceInput] = useState('');
  const [colorNameInput, setColorNameInput] = useState('');
  const [colorImageUrlInput, setColorImageUrlInput] = useState('');
  
  useEffect(() => {
    if (product) {
        const { id, ...productData } = product;
        setFormData({ 
            ...productData, 
            id,
            sizes: product.sizes || [],
            colors: product.colors || [] 
        });
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

  const handleAddSize = () => {
    if (sizeNameInput.trim() && sizePriceInput.trim()) {
      const newSize: SizeOption = {
        name: sizeNameInput.trim(),
        price: parseFloat(sizePriceInput) || 0
      };
      if (!formData.sizes?.find(s => s.name === newSize.name)) {
        setFormData(prev => ({ ...prev, sizes: [...(prev.sizes || []), newSize] }));
        setSizeNameInput('');
        setSizePriceInput('');
      }
    }
  };

  const handleRemoveSize = (sizeToRemove: SizeOption) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes?.filter(s => s.name !== sizeToRemove.name) }));
  };

  const handleAddColor = () => {
    if (colorNameInput.trim() && colorImageUrlInput.trim()) {
      const newColor: ColorOption = { name: colorNameInput.trim(), imageUrl: colorImageUrlInput.trim() };
      if (!formData.colors?.find(c => c.name === newColor.name)) {
        setFormData(prev => ({ ...prev, colors: [...(prev.colors || []), newColor] }));
        setColorNameInput('');
        setColorImageUrlInput('');
      }
    }
  };
  
  const handleRemoveColor = (colorToRemove: ColorOption) => {
    setFormData(prev => ({ ...prev, colors: prev.colors?.filter(c => c.name !== colorToRemove.name) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        alert("Por favor, adicione uma imagem principal para o produto.");
        return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-secondary">{product ? 'Editar Produto' : 'Adicionar Produto'}</h2>
          <button onClick={onClose}><X className="text-slate-500 hover:text-slate-800" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Basic Info */}
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome do Produto" className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrição" rows={3} className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Preço Padrão" className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Categoria" className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Imagem Principal do Produto</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Pré-visualização" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-base-200 flex-shrink-0" />}
                <div className="relative flex-grow w-full">
                    <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Cole uma URL de imagem principal" className="w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required />
                </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-secondary">Variações (Opcional)</h3>
            
            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tamanhos</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={sizeNameInput} onChange={e => setSizeNameInput(e.target.value)} placeholder="Nome do tamanho (Ex: P)" className="flex-grow p-2 border border-base-300 rounded-lg" />
                <input type="number" step="0.01" value={sizePriceInput} onChange={e => setSizePriceInput(e.target.value)} placeholder="Preço (Ex: 29.90)" className="flex-grow p-2 border border-base-300 rounded-lg" />
                <button type="button" onClick={handleAddSize} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold flex items-center gap-1"><Plus size={16}/> Adicionar</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.sizes?.map(size => (
                  <span key={size.name} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                    {size.name} {typeof size.price === 'number' ? `- ${size.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}` : ''}
                    <button type="button" onClick={() => handleRemoveSize(size)}><X size={14} className="hover:text-red-500"/></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cores</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="text" value={colorNameInput} onChange={e => setColorNameInput(e.target.value)} placeholder="Nome da cor (ex: Vermelho)" className="p-2 border border-base-300 rounded-lg"/>
                <input type="text" value={colorImageUrlInput} onChange={e => setColorImageUrlInput(e.target.value)} placeholder="URL da imagem para a cor" className="p-2 border border-base-300 rounded-lg"/>
              </div>
              <button type="button" onClick={handleAddColor} className="mt-2 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold flex items-center gap-1"><Plus size={16}/> Adicionar Cor</button>
              <div className="space-y-2 mt-2">
                {formData.colors?.map(color => (
                  <div key={color.name} className="flex items-center justify-between gap-2 bg-slate-100 p-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={color.imageUrl} alt={color.name} className="w-10 h-10 object-cover rounded-md"/>
                      <span className="font-medium text-slate-700">{color.name}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveColor(color)}><Trash2 size={16} className="text-red-500 hover:text-red-700"/></button>
                  </div>
                ))}
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