import React, { useState, useEffect } from 'react';
import { ShoppingBag, Lock, CreditCard, ChevronLeft, ShieldCheck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartItem, Product } from '../types';
import { loadStripe } from '@stripe/stripe-js';

// IMPORTANT: La clé publique Stripe est chargée depuis les variables d'environnement
// La CLÉ SECRÈTE (sk_test_...) doit être utilisée UNIQUEMENT côté serveur (Edge Function/API)
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  // Déterminer si on paie le panier complet ou un produit direct
  useEffect(() => {
    const directProduct = location.state?.directProduct as Product;
    if (directProduct) {
      setCheckoutItems([{ ...directProduct, quantity: 1 }]);
    } else {
      setCheckoutItems(cart);
    }
  }, [location.state, cart]);

  const subtotal = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.14975; // Québec Taxes
  const total = subtotal + tax;

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripePromise) {
      alert("Stripe n'est pas configuré. Veuillez contacter l'administrateur.");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const clientEmail = formData.get('email') as string;
    const clientName = formData.get('name') as string;

    console.log("Préparation de la session Stripe...");
    console.log("Articles à facturer:", checkoutItems.map(i => ({ id: i.id, name: i.name, price: i.price })));

    try {
      // 1. Appel vers votre backend (Edge Function ou Node.js)
      // C'est là que vous utiliseriez votre clé SECRÈTE (sk_test_...)
      // IMPORTANT: Ne jamais exposer la clé secrète dans le code frontend
      // 
      // Pour Supabase Edge Functions: https://votre-projet.supabase.co/functions/v1/create-checkout-session
      // Pour Vercel/Netlify API Routes: /api/create-checkout-session or /.netlify/functions/create-checkout-session
      // Pour un serveur Node.js: https://votre-domaine.com/api/create-checkout-session
      const envEndpoint = import.meta.env.VITE_STRIPE_API_ENDPOINT;
      const API_ENDPOINT = (envEndpoint && (envEndpoint.startsWith('http') || envEndpoint.startsWith('/'))) 
        ? envEndpoint 
        : '/.netlify/functions/create-checkout-session';
        
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clientEmail,
          name: clientName,
          items: checkoutItems.map(i => ({
            price_data: {
              currency: 'cad',
              product_data: { 
                name: i.name, 
                description: i.description,
                images: [i.image] 
              },
              unit_amount: Math.round(i.price * 100), // Prix unitaire en centimes (sans taxes)
            },
            quantity: i.quantity,
          })),
          // Les taxes seront calculées par Stripe selon la configuration du compte
          // ou vous pouvez les inclure dans unit_amount: Math.round(i.price * 100 * 1.14975)
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session Stripe');
      }

      const session = await response.json();
      
      // Use modern direct redirect to Stripe Checkout
      if (session.url) {
        // Redirect to Stripe's hosted checkout page
        window.location.href = session.url;
      } else if (session.id) {
        // Fallback to legacy method if needed
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe n\'a pas pu être initialisé');
        }
        const { error } = await stripe.redirectToCheckout({ 
          sessionId: session.id 
        });
        if (error) {
          throw error;
        }
      } else {
        throw new Error('Session invalide reçue du serveur');
      }

    } catch (err: any) {
      console.error("Erreur d'initialisation Stripe:", err);
      setIsProcessing(false);
      alert(
        err.message || 
        "Une erreur technique empêche la connexion à Stripe. Veuillez réessayer ou nous contacter au 438-933-6195."
      );
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-aura-light/30">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-aura-light rounded-full flex items-center justify-center mx-auto text-aura-gold"><ShoppingBag size={40} /></div>
          <h2 className="font-serif text-3xl font-bold text-aura-dark">Votre panier est vide</h2>
          <p className="text-gray-500">Ajoutez des produits de notre boutique pour procéder au paiement.</p>
          <Link to="/services" className="inline-block bg-aura-accent text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-aura-dark transition shadow-xl">Voir la boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aura-light/30 py-12 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Formulaire de paiement */}
        <div className="space-y-10 animate-fade-in">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 hover:text-aura-dark transition text-sm font-medium">
            <ChevronLeft size={18} className="mr-1" /> Retour
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-aura-gold flex items-center justify-center overflow-hidden">
                <img src="https://ik.imagekit.io/u4lig2jm2f/626685180_2354594188318781_3570031940854477105_n-removebg-preview.png" alt="Aura Microlocs" className="w-7 h-7 object-contain" />
              </div>
              <span className="font-serif text-lg tracking-widest text-aura-gold uppercase">Aura</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-aura-dark font-bold tracking-tight">Paiement Sécurisé</h1>
            <p className="text-gray-500">Propulsé par Stripe - Leader mondial des paiements en ligne.</p>
          </div>

          <form onSubmit={handleStripePayment} className="space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
              <h3 className="text-lg font-bold text-aura-dark flex items-center gap-3">
                <span className="w-8 h-8 bg-aura-dark text-aura-gold rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Informations Facturation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-4">Nom complet</label>
                  <input name="name" required className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-aura-gold/30 outline-none transition" placeholder="Prénom Nom" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-4">Téléphone</label>
                  <input name="phone" type="tel" required className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-aura-gold/30 outline-none transition" placeholder="438-000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-4">Adresse courriel</label>
                <input name="email" type="email" required className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-aura-gold/30 outline-none transition" placeholder="votre@email.com" />
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
               <h3 className="text-lg font-bold text-aura-dark flex items-center gap-3">
                <span className="w-8 h-8 bg-aura-dark text-aura-gold rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Mode de Paiement
              </h3>
              <div className="p-6 border-2 border-aura-gold bg-aura-gold/5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CreditCard className="text-aura-accent" size={24} />
                  <div>
                    <p className="font-bold text-aura-dark text-sm">Stripe Checkout</p>
                    <p className="text-xs text-gray-500">Carte de crédit, Google Pay, Apple Pay</p>
                  </div>
                </div>
                <CheckCircle2 className="text-aura-gold" size={20} />
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-aura-accent text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-aura-dark transition shadow-2xl disabled:opacity-50 group"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={18} /> : null}
                  {isProcessing ? "Liaison avec Stripe..." : "Payer maintenant"} 
                  {!isProcessing && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
                <div className="flex justify-center items-center gap-6 pt-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 opacity-40" />
                  <div className="h-4 w-[1px] bg-gray-200"></div>
                  <div className="flex items-center text-[10px] text-gray-400 font-bold tracking-widest gap-1 uppercase">
                    <ShieldCheck size={12} className="text-green-500" /> Certifié PCI-DSS
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Résumé Commande */}
        <div className="lg:sticky lg:top-32 h-fit space-y-8 animate-fade-in">\n
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-aura-dark p-8 text-white">
              <h3 className="font-serif text-2xl font-bold text-aura-gold">Votre Commande</h3>
              <p className="text-gray-400 text-sm mt-1">Aura Microlocs Studio Québec</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-aura-dark text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">{item.quantity} x {item.price.toFixed(2)}$</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-aura-dark text-sm">{(item.price * item.quantity).toFixed(2)}$</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total</span>
                  <span className="font-medium text-aura-dark">{subtotal.toFixed(2)}$</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxes (TPS/TVQ 14.975%)</span>
                  <span className="font-medium text-aura-dark">{tax.toFixed(2)}$</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-aura-gold/10">
                  <span className="text-lg font-bold text-aura-dark">TOTAL</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-aura-accent">{total.toFixed(2)}$</span>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">CAD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white/50 border border-white rounded-3xl flex items-center gap-4 italic text-sm text-gray-500">
            <Lock size={20} className="text-aura-gold shrink-0" />
            "La sécurité de vos paiements est notre priorité absolue."
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;