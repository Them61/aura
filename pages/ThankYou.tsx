import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home, Download } from 'lucide-react';


interface CheckoutSession {
  id: string;
  customer_email: string;
  amount_total: number;
  currency: string;
  payment_status: string;
  customer_details?: {
    name: string;
  };
  line_items?: Array<{
    description: string;
    price: {
      unit_amount: number;
      currency: string;
    };
    quantity: number;
    product: {
      name: string;
      description?: string;
    };
  }>;
}

interface ThankYouProps {
  clearCart: () => void;
}

const ThankYou: React.FC<ThankYouProps> = ({ clearCart }) => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (sessionId) {
        // Clear the cart since the purchase was successful
        clearCart();
        
        try {
          // Try to fetch real session details from backend
          const API_ENDPOINT = (import.meta.env as any).VITE_STRIPE_API_ENDPOINT?.replace('/create-checkout-session', '') || 'http://localhost:3003/api';
          const response = await fetch(`${API_ENDPOINT}/get-session?session_id=${sessionId}`);
          
          if (response.ok) {
            const sessionData = await response.json();
            setSession(sessionData);

            // Save order to Supabase
            try {
              const orderData = {
                session_id: sessionData.id,
                customer_email: sessionData.customer_email || sessionData.customer_details?.email,
                customer_name: sessionData.customer_details?.name,
                items: sessionData.line_items?.data || [],
                amount_total: sessionData.amount_total,
                currency: sessionData.currency,
                payment_status: sessionData.payment_status,
              };

              const saveOrderResponse = await fetch(`${API_ENDPOINT}/save-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
              });

              if (!saveOrderResponse.ok) {
                console.error('Failed to save order to database');
              }
            } catch (saveError) {
              console.error('Error saving order:', saveError);
              // Continue even if saving fails - the payment already succeeded
            }
          } else {
            // Fallback to generic success message if API fails
            setSession({
              id: sessionId,
              customer_email: 'customer@example.com',
              amount_total: 0,
              currency: 'cad',
              payment_status: 'paid',
            });
          }
        } catch (error) {
          console.error('Error fetching session details:', error);
          // Fallback to generic success message
          setSession({
            id: sessionId,
            customer_email: 'customer@example.com',
            amount_total: 0,
            currency: 'cad',
            payment_status: 'paid',
          });
        }
      }
      setIsLoading(false);
    };

    fetchSessionDetails();
  }, [sessionId, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-aura-light/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aura-dark mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de votre commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aura-light/30 py-12 md:py-20 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Animation */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-aura-dark font-bold mb-4">
            Merci pour votre commande !
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre paiement a été traité avec succès. Nous préparons déjà votre commande avec le plus grand soin.
          </p>
        </div>

        {/* Order Confirmation Card */}
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden mb-8 animate-fade-in-up">
          <div className="bg-gradient-to-r from-aura-dark to-aura-gold p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Commande Confirmée</h2>
                <p className="opacity-90">
                  {sessionId ? `Numéro de transaction: ${sessionId.slice(-8).toUpperCase()}` : 'Transaction réussie'}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white/20 rounded-full px-4 py-2 text-sm font-semibold">
                  ✅ PAIEMENT CONFIRMÉ
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Items (if available) */}
              {session?.line_items && session.line_items.length > 0 && (
                <div className="md:col-span-2 mb-8">
                  <h3 className="text-2xl font-bold text-aura-dark mb-4">Articles commandés</h3>
                  <div className="space-y-3">
                    {session.line_items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-aura-light/30 rounded-2xl">
                        <div className="flex-1">
                          <h4 className="font-semibold text-aura-dark">{item.product.name}</h4>
                          {item.product.description && (
                            <p className="text-sm text-gray-600">{item.product.description}</p>
                          )}
                          <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-aura-dark">
                            {((item.price.unit_amount * item.quantity) / 100).toFixed(2)} {item.price.currency.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Total */}
                    {session.amount_total > 0 && (
                      <div className="border-t-2 border-aura-light pt-4 mt-6">
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total payé:</span>
                          <span className="text-aura-dark">
                            {(session.amount_total / 100).toFixed(2)} {session.currency.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* What's Next */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-aura-dark mb-4">Prochaines étapes</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-aura-light rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-aura-dark font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-aura-dark">Confirmation par email</h4>
                      <p className="text-gray-600 text-sm">Vous recevrez un reçu détaillé dans quelques minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-aura-light rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-aura-dark font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-aura-dark">Préparation</h4>
                      <p className="text-gray-600 text-sm">Notre équipe prépare votre service avec attention</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-aura-light rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-aura-dark font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-aura-dark">Contact personnel</h4>
                      <p className="text-gray-600 text-sm">Nous vous contacterons pour planifier votre rendez-vous</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-aura-dark mb-4">Besoin d'aide ?</h3>
                <div className="bg-aura-light/50 rounded-2xl p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-aura-dark mb-2">Support client</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Notre équipe est disponible pour répondre à toutes vos questions
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Téléphone:</span>
                        <a href="tel:438-933-6195" className="ml-2 text-aura-dark hover:text-aura-gold transition">
                          438-933-6195
                        </a>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span>
                        <a href="mailto:contact@auramicrolocs.com" className="ml-2 text-aura-dark hover:text-aura-gold transition">
                          contact@auramicrolocs.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
          <Link 
            to="/" 
            className="bg-aura-dark text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-aura-gold transition shadow-xl flex items-center gap-2 group"
          >
            <Home size={16} />
            Retour à l'accueil
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/services" 
            className="bg-white text-aura-dark border-2 border-aura-dark px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-aura-dark hover:text-white transition shadow-xl flex items-center gap-2 group"
          >
            <Package size={16} />
            Découvrir nos services
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center text-gray-500 text-sm space-y-2 animate-fade-in-up">
          <p>🔒 Votre paiement a été traité de manière sécurisée par Stripe</p>
          <p>💝 Merci de faire confiance à Aura Microlocs pour vos soins capillaires</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;