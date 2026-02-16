import React, { useState, memo } from 'react';
import { X, ShoppingBag, Trash2, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, onClose, cart, removeFromCart, updateQuantity, clearCart
}) => {
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.14975; // Estimation taxes Québec
  const total = subtotal + tax;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in flex flex-col font-sans">
        {/* Header */}
        <div className="p-8 border-b flex justify-between items-center bg-aura-dark text-white">
          <div className="flex items-center">
            <ShoppingBag className="mr-3 text-aura-gold" size={24} />
            <h2 className="font-serif text-2xl font-bold tracking-tight">Votre Panier</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition" title="Close cart" aria-label="Close shopping cart">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
                <ShoppingBag size={40} />
              </div>
              <p className="text-gray-400 font-medium">Votre panier est encore vide</p>
              <button type="button" onClick={onClose} className="bg-aura-dark text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-aura-gold transition shadow-md" title="Continue shopping">
                Continuer la visite
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-5 border-b border-gray-50 pb-8 last:border-0 group">
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-aura-dark text-lg leading-tight">{item.name}</h4>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition p-1" title="Remove from cart">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-aura-gold font-bold uppercase tracking-widest">{item.category}</p>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 shadow-inner">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-aura-dark hover:text-aura-accent font-bold transition">-</button>
                        <span className="px-3 text-sm font-bold text-aura-dark">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-aura-dark hover:text-aura-accent font-bold transition">+</button>
                      </div>
                      <span className="font-bold text-aura-accent text-lg">{(item.price * item.quantity).toFixed(2)}$</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sous-total</span>
                <span className="font-medium text-aura-dark">{subtotal.toFixed(2)}$</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Taxes (approx.)</span>
                <span className="font-medium text-aura-dark">{tax.toFixed(2)}$</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-aura-dark border-t border-gray-200 pt-4">
                <span>Total</span>
                <span className="text-aura-accent">{total.toFixed(2)}$</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-aura-accent text-white py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-aura-dark transition shadow-xl group"
            >
              <CreditCard size={20} className="group-hover:scale-110 transition" />
              <span>Procéder au paiement</span>
            </button>
            <div className="flex justify-center items-center gap-3">
               <Lock size={12} className="text-gray-400" />
               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Paiement 100% sécurisé</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CartDrawer);