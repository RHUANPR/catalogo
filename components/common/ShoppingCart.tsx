import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ShoppingCart as ShoppingCartIcon, X, Plus, Minus, Trash2 } from 'lucide-react';

const CheckoutForm: React.FC<{onSuccess: () => void}> = ({onSuccess}) => {
    const { cart, cartTotal, clearCart, trackQuoteCompletion } = useAppContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let message = `Olá! Gostaria de um orçamento para os seguintes itens:\n\n`;
        cart.forEach(item => {
            message += `*${item.name}* (x${item.quantity})\n`;
            if (item.imageUrl) {
                message += `Imagem: ${item.imageUrl}\n`;
            }
            message += `Subtotal: ${ (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }\n\n`;
        });
        message += `*Total do Orçamento: ${cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n\n`;
        message += `Nome: ${name}\n`;
        message += `Email: ${email}`;

        const fixedWhatsappNumber = '5514998971450';
        const whatsappUrl = `https://wa.me/${fixedWhatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        trackQuoteCompletion();
        onSuccess();
        clearCart();
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-secondary">Seus Dados</h3>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-600">Nome Completo</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-slate-900" required />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-slate-900" required />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-semibold">
                Receber Orçamento no WhatsApp
            </button>
        </form>
    );
}


export const ShoppingCart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, cartTotal, updateQuantity, removeFromCart } = useAppContext();
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleSuccess = () => {
      setIsOpen(false);
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="relative">
        <ShoppingCartIcon size={28} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-base-200 w-full max-w-md h-full shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-base-300 bg-white">
              <h2 className="text-xl font-bold text-secondary">Meu Carrinho</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} className="text-slate-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              {cart.length === 0 ? (
                <p className="text-slate-500">Seu carrinho está vazio.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover"/>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-secondary">{item.name}</h4>
                        <p className="text-sm text-slate-500">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        <div className="flex items-center mt-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-base-300 hover:bg-slate-400"><Minus size={14}/></button>
                          <span className="px-3">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-base-300 hover:bg-slate-400"><Plus size={14}/></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)}><Trash2 size={20} className="text-red-500 hover:text-red-700"/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-base-300 bg-white">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-secondary">Total:</span>
                  <span className="text-primary">{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <CheckoutForm onSuccess={handleSuccess} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
