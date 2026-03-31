import React from 'react';
import { X, ShoppingCart, Plus, Minus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Drawer = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-medium text-gray-900 tracking-wide">{title}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e5e7eb transparent' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemove }) {
  const navigate = useNavigate();
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Tu carrito (${cartCount})`}>
      <div className="flex h-full flex-col">
        {/* Barra de progreso decorativa */}
        <div className="h-0.5 w-full bg-gray-100">
          <div className="h-full bg-gray-900 w-full transition-all duration-700 ease-out" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-16 space-y-4">
              <ShoppingCart size={40} className="mx-auto text-gray-200" strokeWidth={1.5} />
              <p className="text-sm">Tu carrito está vacío.</p>
              <button
                onClick={onClose}
                className="text-xs text-[#4a3a31] underline underline-offset-2 hover:text-[#c9a96e] transition-colors"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 object-cover object-center rounded-lg bg-gray-50 flex-shrink-0"
                />
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#b8986a] tracking-wider uppercase mb-0.5">{item.brand}</p>
                      <h3 className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-2">{item.name}</h3>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors p-0.5"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg h-8 w-24 overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="flex-1 flex justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 h-full transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="flex-1 flex justify-center items-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 h-full transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-2xl font-semibold text-gray-900">${cartTotal.toFixed(2)} <span className="text-sm font-normal text-gray-400">USD</span></span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#4a3a31] text-white py-4 text-sm font-bold tracking-widest hover:bg-[#382b24] transition-colors duration-300 rounded-full shadow-md hover:shadow-lg"
            >
              PAGAR
            </button>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1 transition-colors"
            >
              Continuar comprando <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}