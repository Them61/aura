import React, { useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronRight, ShieldCheck, Mail, Phone } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
  onCartClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, cartCount, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-aura-accent font-bold' : 'text-aura-light hover:text-white transition-colors';
  const mobileActive = (path: string) => location.pathname === path ? 'text-aura-accent pl-4 border-l-4 border-aura-accent' : 'text-aura-dark pl-4 border-l-4 border-transparent';

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <nav className="bg-aura-gold text-white sticky top-0 z-50 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 border-2 border-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300 overflow-hidden">
                <img src="https://ik.imagekit.io/u4lig2jm2f/626685180_2354594188318781_3570031940854477105_n-removebg-preview.png" alt="Aura Microlocs" className="w-7 h-7 object-contain" />
              </div>
              <span className="font-serif text-2xl tracking-widest text-white uppercase">Aura</span>
            </Link>

            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>ACCUEIL</Link>
              <Link to="/services" className={isActive('/services')}>SERVICES & PRODUITS</Link>
              <Link to="/contact" className={isActive('/contact')}>CONTACT</Link>
              
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/30">
                <button onClick={onCartClick} className="relative p-2 text-white/90 hover:text-white transition-colors">
                  <ShoppingBag size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-aura-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-aura-dark">
                      {cartCount}
                    </span>
                  )}
                </button>

                <Link to="/contact?tab=booking" className="bg-aura-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-aura-accent transition-all duration-300 transform hover:scale-105">
                  RÉSERVER
                </Link>
              </div>
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button onClick={onCartClick} className="relative p-2 text-white">
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-aura-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white text-aura-dark animate-fade-in-down absolute w-full shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className={`block py-3 text-lg font-medium ${mobileActive('/')}`}>ACCUEIL</Link>
              <Link to="/services" onClick={() => setIsMenuOpen(false)} className={`block py-3 text-lg font-medium ${mobileActive('/services')}`}>SERVICES & PRODUITS</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={`block py-3 text-lg font-medium ${mobileActive('/contact')}`}>CONTACT</Link>
              <Link to="/contact?tab=booking" onClick={() => setIsMenuOpen(false)} className="mx-4 mt-4 text-center bg-aura-accent text-white py-3 rounded-md font-bold uppercase tracking-wide">
                Réserver maintenant
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">{children}</main>

      <footer className="bg-aura-dark text-white pt-24 pb-12 border-t-8 border-aura-gold relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-aura-gold/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
            <div className="space-y-8">
                <Link to="/" className="flex items-center space-x-3 group">
                  <div className="w-14 h-14 border-2 border-aura-gold rounded-full flex items-center justify-center group-hover:bg-aura-gold transition-all duration-500 shadow-lg shadow-aura-gold/10 overflow-hidden">
                    <img src="https://ik.imagekit.io/u4lig2jm2f/626685180_2354594188318781_3570031940854477105_n-removebg-preview.png" alt="Aura Microlocs" className="w-10 h-10 object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-3xl tracking-[0.2em] text-aura-gold uppercase font-bold leading-none">Aura</span>
                  </div>
                </Link>
              <p className="text-gray-400 font-light text-sm leading-relaxed max-w-sm">
                L'élégance naturelle à Québec. Expertise artisanale dédiée aux microlocs.
              </p>
            </div>

            <div className="space-y-8">
              <h4 className="font-serif text-xl text-white font-bold tracking-wider">EXPLORATION</h4>
              <ul className="space-y-5">
                <li><Link to="/" className="text-gray-400 hover:text-aura-gold flex items-center group text-sm"><ChevronRight size={16} className="mr-2" />Accueil</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-aura-gold flex items-center group text-sm"><ChevronRight size={16} className="mr-2" />Nos Services</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-aura-gold flex items-center group text-sm"><ChevronRight size={16} className="mr-2" />Contact</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-serif text-xl text-white font-bold tracking-wider">CONCIERGERIE</h4>
              <ul className="space-y-6">
                <li className="flex items-start"><Phone size={18} className="text-aura-gold mr-4" /><div><span className="text-[10px] text-gray-500 uppercase tracking-widest block">Téléphone</span><span className="text-gray-300">438-933-6195</span></div></li>
                <li className="flex items-start"><Mail size={18} className="text-aura-gold mr-4" /><div><span className="text-[10px] text-gray-500 uppercase tracking-widest block">Email</span><span className="text-gray-300 text-sm">Sikatialice@gmail.com</span></div></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-serif text-xl text-white font-bold tracking-wider">PAIEMENT</h4>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm space-y-4">
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 uppercase font-bold">
                  <ShieldCheck size={14} className="text-aura-gold" />
                  <span>Sécurité SSL</span>
                </div>
                <div className="flex gap-4 opacity-50">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-20 pt-10 text-center">
            <p className="text-[11px] text-gray-500 font-medium">© 2026 Aura Microlocs Studio. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default memo(Layout);