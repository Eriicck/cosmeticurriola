import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import Index     from './index';
import Products  from './products';
import Checkout  from './checkout';
import Admin     from './admin';

export default function App() {
  const [cart, setCart]             = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartProps = {
    cart,
    cartCount,
    onAddToCart: addToCart,
    onOpenCart:  () => setIsCartOpen(true),
  };

  return (
    <BrowserRouter>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <Routes>
        <Route path="/"         element={<Index    {...cartProps} />} />
        <Route path="/products" element={<Products {...cartProps} />} />
        <Route path="/checkout" element={<Checkout cart={cart} cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />} />
        {/* Panel de administración */}
        <Route path="/admin"    element={<Admin />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}