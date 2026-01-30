import React, { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chatbot from './components/Chatbot';
import CartDrawer from './components/CartDrawer';
import { CartItem, Product } from './types';
import { reportWebVitals } from './services/webVitals';

// Lazy load components to reduce main-thread blocking
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));

// Simple loading fallback component
const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-aura-gold/20 border-t-aura-gold rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500">Chargement...</p>
    </div>
  </div>
);

// Optimize scroll behavior - use instant scroll instead of smooth for better performance
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize Web Vitals tracking on mount
  useEffect(() => {
    reportWebVitals((metric) => {
      // Send metrics to analytics if needed
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }
    });
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <ScrollToTop />
      <Layout 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
      >
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services addToCart={addToCart} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
            <Route path="/checkout/success" element={<ThankYou clearCart={clearCart} />} />
          </Routes>
        </Suspense>
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
        <Suspense fallback={null}>
          <CartDrawer 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            clearCart={clearCart}
          />
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;