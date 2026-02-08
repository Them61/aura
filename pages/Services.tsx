
import React, { useRef, useState } from 'react';
// Fix: Import Link along with useNavigate from react-router-dom
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Check, ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Sparkles, Heart, CreditCard, Lock, Loader2 } from 'lucide-react';
import { Product } from '../types';

interface ServicesProps {
  addToCart: (product: Product) => void;
}

const Services: React.FC<ServicesProps> = ({ addToCart }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 340;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBuyNow = (product: Product) => {
    setProcessingId(product.id);
    // On simule une petite préparation avant redirection
    setTimeout(() => {
      setProcessingId(null);
      // On navigue vers checkout en passant le produit dans le "state" de la navigation
      navigate('/checkout', { state: { directProduct: product } });
    }, 600);
  };

  const products: Product[] = [
    {
      id: 'p1',
      name: 'Huiles de cheveux naturels',
      description: 'Mélange d\'huiles précieuses 100% naturelles pour nourrir intensément vos microlocs.',
      price: 35.00,
      image: 'https://ik.imagekit.io/u4lig2jm2f/611677579_1555139552459694_8502816501605500686_n.jpg',
      category: 'Soin'
    },
    {
      id: 'p2',
      name: 'Mèches transformation Sisterlocks',
      description: 'Mèches de haute qualité pour les transformations et extensions.',
      price: 45.00,
      image: 'https://ik.imagekit.io/u4lig2jm2f/615776670_1236272001718085_974034722842599038_n.jpg',
      category: 'Extensions'
    },
    {
      id: 'p3',
      name: 'Crochet de resserrage professionnel',
      description: 'Outil de précision indispensable pour un resserrage net et durable.',
      price: 25.00,
      image: 'https://picsum.photos/seed/crochethook/400/400',
      category: 'Accessoire'
    },
    {
      id: 'p4',
      name: 'Shampooing Clarifiant',
      description: 'Nettoyage en profondeur sans résidus.',
      price: 28.00,
      image: 'https://picsum.photos/seed/shampoo/400/400',
      category: 'Lavage'
    },
    {
      id: 'p5',
      name: 'Bonnet Satin de luxe',
      description: 'Protection nocturne indispensable pour vos microlocs.',
      price: 15.00,
      image: 'https://picsum.photos/seed/bonnet/400/400',
      category: 'Accessoire'
    }
  ];

  return (
    <div className="animate-fade-in bg-aura-light/30">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* Header Section */}
      <section className="bg-aura-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-7xl text-aura-gold mb-6 tracking-tight">Services & Boutique</h1>
          <div className="w-24 h-1 bg-aura-gold mx-auto mb-8"></div>
          <p className="text-xl max-w-2xl mx-auto text-gray-300 font-light leading-relaxed">
            L'excellence artisanale pour vos cheveux. Découvrez nos soins experts et notre sélection de produits haut de gamme.
          </p>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-24 max-w-6xl mx-auto px-4 space-y-24">
        {/* Service 1: Installation */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 transition-transform duration-500 hover:scale-[1.01]">
          <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
             <img src="https://ik.imagekit.io/u4lig2jm2f/Gemini_Generated_Image_vgw0ebvgw0ebvgw0.png" alt="Installation Microlocs Aura Studio" className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition duration-700" />
             <div className="absolute inset-0 bg-aura-dark/10"></div>
          </div>
          <div className="md:w-1/2 p-10 md:p-14 space-y-6">
            <div className="flex items-center space-x-2 text-aura-accent">
              <Sparkles size={20} />
              <span className="uppercase tracking-widest text-xs font-bold">Nouveau Départ</span>
            </div>
            <h2 className="font-serif text-4xl text-aura-dark font-bold leading-tight">Installation de Microlocs</h2>
            <p className="text-aura-gold font-serif italic text-xl">L'élégance dès le premier jour</p>
            <p className="text-gray-600 leading-relaxed text-lg">Démarrez votre parcours avec sérénité. Une installation méticuleuse adaptée à la texture de vos cheveux pour un résultat durable et esthétique.</p>
            <div className="bg-aura-light p-6 rounded-2xl border-l-4 border-aura-gold space-y-4">
              <h4 className="font-bold text-aura-dark flex items-center"><Check className="text-aura-gold mr-3" size={20} /> Inclus dans le service :</h4>
              <ul className="space-y-3 text-sm text-gray-700 ml-8 list-disc">
                <li>Installation artisanale (grille personnalisée)</li>
                <li>Trousse de démarrage et conseils de suivi</li>
                <li>Conseils de suivi personnalisés</li>
              </ul>
            </div>
            <div className="pt-8 border-t border-gray-100 flex flex-wrap justify-between items-center gap-6">
               <div className="flex items-center">
                  <Clock className="text-aura-gold mr-3" size={24} />
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest">Durée estimée</span>
                    <span className="font-bold text-aura-dark text-lg">5 à 8 heures</span>
                  </div>
               </div>
               {/* Link used here */}
               <Link to="/contact?tab=booking&service=installation" className="bg-aura-accent text-white px-10 py-4 rounded-full hover:bg-aura-dark transition duration-300 shadow-xl font-bold">Réserver (Entre 450$ et 600$)</Link>
            </div>
          </div>
        </div>

        {/* Service 2: Entretien */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-gray-100 transition-transform duration-500 hover:scale-[1.01]">
          <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
             <img src="https://ik.imagekit.io/u4lig2jm2f/Gemini_Generated_Image_419g9o419g9o419g.png" alt="Entretien Microlocs Québec" className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition duration-700" />
          </div>
          <div className="md:w-1/2 p-10 md:p-14 space-y-6">
            <div className="flex items-center space-x-2 text-aura-accent">
              <Heart className="text-aura-accent fill-aura-accent" size={20} />
              <span className="uppercase tracking-widest text-xs font-bold">Bien-être</span>
            </div>
            <h2 className="font-serif text-4xl text-aura-dark font-bold leading-tight">Entretien Expert</h2>
            <p className="text-aura-gold font-serif italic text-xl">Préservez l'éclat de vos locs</p>
            <p className="text-gray-600 leading-relaxed text-lg">Un soin complet pour revitaliser vos cheveux. Nous utilisons des techniques douces pour nettoyer, hydrater et maintenir la structure de vos locs.</p>
            <div className="bg-aura-light p-6 rounded-2xl border-l-4 border-aura-gold space-y-4">
              <h4 className="font-bold text-aura-dark">Notre processus :</h4>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center"><span className="w-6 h-6 rounded-full bg-aura-dark text-aura-gold flex items-center justify-center text-[10px] font-bold mr-3 shrink-0">1</span> Lavage clarifiant en profondeur</li>
                <li className="flex items-center"><span className="w-6 h-6 rounded-full bg-aura-dark text-aura-gold flex items-center justify-center text-[10px] font-bold mr-3 shrink-0">2</span> Soin hydratant signature Aura</li>
                <li className="flex items-center"><span className="w-6 h-6 rounded-full bg-aura-dark text-aura-gold flex items-center justify-center text-[10px] font-bold mr-3 shrink-0">3</span> Séparation et inspection minutieuse</li>
              </ol>
            </div>
            <div className="pt-8 border-t border-gray-100 flex flex-wrap justify-between items-center gap-6">
               <div className="flex items-center">
                  <CalendarIcon className="text-aura-gold mr-3" size={24} />
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest">Fréquence</span>
                    <span className="font-bold text-aura-dark text-lg">Toutes les 5-7 semaines</span>
                  </div>
               </div>
               {/* Link used here */}
               <Link to="/contact?tab=booking&service=entretien" className="bg-aura-accent text-white px-10 py-4 rounded-full hover:bg-aura-dark transition duration-300 shadow-xl font-bold">Réserver (80.00$)</Link>
            </div>
          </div>
        </div>

        {/* Service 3: Resserrage */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 transition-transform duration-500 hover:scale-[1.01]">
          <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
             <img src="https://ik.imagekit.io/u4lig2jm2f/resserage.png" alt="Resserrage Microlocs Aura" className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition duration-700" />
          </div>
          <div className="md:w-1/2 p-10 md:p-14 space-y-6">
            <div className="flex items-center space-x-2 text-aura-accent">
              <Sparkles size={20} />
              <span className="uppercase tracking-widest text-xs font-bold">Précision</span>
            </div>
            <h2 className="font-serif text-4xl text-aura-dark font-bold leading-tight">Le Resserrage</h2>
            <p className="text-aura-gold font-serif italic text-xl">Une finition impeccable</p>
            <p className="text-gray-600 leading-relaxed text-lg">Le secret d'une chevelure soignée réside dans la précision du resserrage. Nous travaillons chaque racine avec délicatesse pour une tenue parfaite.</p>
            <div className="relative p-6 bg-aura-dark text-aura-gold italic rounded-2xl shadow-inner">"La régularité du resserrage est la clé de la santé et de la longévité de vos microlocs."</div>
            <div className="pt-8 border-t border-gray-100 flex flex-wrap justify-between items-center gap-6">
               <div className="flex items-center">
                  <Clock className="text-aura-gold mr-3" size={24} />
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest">Temps requis</span>
                    <span className="font-bold text-aura-dark text-lg">2h30 à 3h30</span>
                  </div>
               </div>
               {/* Link used here */}
               <Link to="/contact?tab=booking&service=resserage" className="bg-aura-accent text-white px-10 py-4 rounded-full hover:bg-aura-dark transition duration-300 shadow-xl font-bold">Réserver (Entre 65$ et 100$)</Link>
            </div>
          </div>
        </div>

        {/* Services Complémentaires */}
        <div className="space-y-10">
          <div className="text-center">
            <h3 className="font-serif text-4xl text-aura-dark font-bold uppercase tracking-widest">Services Complémentaires</h3>
            <div className="w-20 h-1 bg-aura-gold mx-auto mt-4 mb-6"></div>
            <p className="text-gray-500 max-w-2xl mx-auto italic">Des attentions sur-mesure pour révéler toute l'élégance de vos microlocs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-accent">Soin</span>
              <h4 className="font-serif text-2xl text-aura-dark font-bold mt-2">Traitement (Soin)</h4>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">Hydratation ciblée et douceur artisanale pour raviver la vitalité des locs.</p>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-aura-dark">
                <span>Entre 25$ et 35$</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">1h - 1h30</span>
              </div>
              <Link to="/contact?tab=booking&service=soin" className="mt-6 bg-aura-accent text-white px-6 py-3 rounded-full hover:bg-aura-dark transition duration-300 text-sm font-bold text-center">Réserver</Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-accent">Couleur</span>
              <h4 className="font-serif text-2xl text-aura-dark font-bold mt-2">Coloration</h4>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">Teintes élégantes et techniques douces pour sublimer sans compromettre la santé capillaire.</p>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-aura-dark">
                <span>Entre 45$ et 85$</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">2h - 3h</span>
              </div>
              <Link to="/contact?tab=booking&service=coloration" className="mt-6 bg-aura-accent text-white px-6 py-3 rounded-full hover:bg-aura-dark transition duration-300 text-sm font-bold text-center">Réserver</Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-accent">Transformation</span>
              <h4 className="font-serif text-2xl text-aura-dark font-bold mt-2">Ajout de rallonges</h4>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">Volume et longueur parfaitement intégrés pour une transformation harmonieuse.</p>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-aura-dark">
                <span>Entre 60$ et 150$</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">2h - 4h</span>
              </div>
              <Link to="/contact?tab=booking&service=transformation" className="mt-6 bg-aura-accent text-white px-6 py-3 rounded-full hover:bg-aura-dark transition duration-300 text-sm font-bold text-center">Réserver</Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-accent">Lavage</span>
              <h4 className="font-serif text-2xl text-aura-dark font-bold mt-2">Lavage simple</h4>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">Nettoyage délicat et rafraîchissant pour un cuir chevelu sain.</p>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-aura-dark">
                <span>35$</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">45 min - 1h</span>
              </div>
              <Link to="/contact?tab=booking&service=lavage" className="mt-6 bg-aura-accent text-white px-6 py-3 rounded-full hover:bg-aura-dark transition duration-300 text-sm font-bold text-center">Réserver</Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-accent">Consultation</span>
              <h4 className="font-serif text-2xl text-aura-dark font-bold mt-2">Consultation</h4>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">Analyse capillaire et plan personnalisé pour démarrer ou ajuster votre parcours.</p>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-aura-dark">
                <span>Gratuit</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">30 - 45 min</span>
              </div>
              <Link to="/contact?tab=booking&service=consultation" className="mt-6 bg-aura-accent text-white px-6 py-3 rounded-full hover:bg-aura-dark transition duration-300 text-sm font-bold text-center">Réserver</Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-aura-accent">Conseil</span>
              <h4 className="font-serif text-2xl text-aura-dark font-bold mt-2">Conseil personnalisé</h4>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">Guidance experte pour entretenir vos microlocs au quotidien avec sérénité.</p>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-aura-dark">
                <span>Gratuit pour les nouveaux clients</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">20 - 30 min</span>
              </div>
              <Link to="/contact?tab=booking&service=conseil" className="mt-6 bg-aura-accent text-white px-6 py-3 rounded-full hover:bg-aura-dark transition duration-300 text-sm font-bold text-center">Réserver</Link>
            </div>
          </div>

          <div className="text-center text-xs uppercase tracking-widest text-gray-400">
            Prix final confirmé après consultation pour les services à tarif variable.
          </div>
        </div>
      </section>

      {/* Boutique Section */}
      <section id="boutique-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="font-serif text-5xl text-aura-dark font-bold mb-4 tracking-tight">La Boutique Aura</h2>
                <div className="w-24 h-1 bg-aura-gold mx-auto mb-8"></div>
                <p className="text-gray-500 font-light max-w-2xl mx-auto text-lg leading-relaxed italic">"Ma vision c'est d'aider les gens à garder leurs cheveux naturels et propres à tout moment à prix abordable."</p>
                <p className="mt-4 text-[11px] uppercase tracking-widest text-aura-accent font-bold">Vente de rallonges : prix varient selon la demande</p>
                <div className="flex flex-col items-center mt-8">
                    <p className="text-[10px] text-aura-accent font-bold uppercase tracking-widest flex items-center gap-2 bg-aura-light px-4 py-2 rounded-full"><Lock size={12} /> Transactions sécurisées par Stripe</p>
                    <div className="flex gap-6 mt-6 opacity-40 grayscale hover:grayscale-0 transition duration-500">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    </div>
                </div>
            </div>

            <div className="relative group">
                <button type="button" onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-2xl p-5 rounded-full -ml-4 lg:-ml-8 hover:bg-aura-gold hover:text-white transition duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm" title="Scroll left" aria-label="Scroll products left"><ChevronLeft size={28} /></button>
                <div ref={scrollContainerRef} className="flex overflow-x-auto gap-8 pb-16 px-4 hide-scrollbar snap-x snap-mandatory scroll-smooth">
                    {products.map((product) => (
                        <div key={product.id} className="min-w-[300px] md:min-w-[360px] snap-center bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group/card relative overflow-hidden">
                            <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl bg-gray-50">
                                <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover/card:scale-110 transition duration-700" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-aura-dark shadow-sm">{product.category}</div>
                            </div>
                            <h3 className="font-serif font-bold text-aura-dark text-xl mb-3 group-hover/card:text-aura-accent transition">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed h-10">{product.description}</p>
                            <div className="mt-auto pt-6 border-t border-gray-50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-aura-accent text-2xl">{product.price.toFixed(2)}$</span>
                                    <span className="flex items-center text-[10px] text-green-600 font-bold uppercase tracking-tighter"><Check size={12} className="mr-1" /> En stock</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button onClick={() => handleBuyNow(product)} disabled={processingId === product.id} className="w-full flex items-center justify-center space-x-2 bg-aura-accent text-white px-4 py-3.5 rounded-xl hover:bg-aura-dark transition-all duration-300 shadow-lg font-bold uppercase tracking-widest text-xs disabled:opacity-70">
                                        {processingId === product.id ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                                        <span>Acheter maintenant</span>
                                    </button>
                                    <button onClick={() => addToCart(product)} className="w-full flex items-center justify-center space-x-2 bg-aura-dark text-aura-gold px-4 py-3.5 rounded-xl hover:bg-aura-gold hover:text-white transition-all duration-300 shadow-sm text-xs font-bold uppercase tracking-widest">
                                        <ShoppingBag size={18} />
                                        <span>Ajouter au panier</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-2xl p-5 rounded-full -mr-4 lg:-mr-8 hover:bg-aura-gold hover:text-white transition duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm" title="Scroll right" aria-label="Scroll products right"><ChevronRight size={28} /></button>
            </div>
        </div>
      </section>

      {/* Assurance Section */}
      <section className="py-24 bg-aura-dark text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-aura-gold"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16"><h2 className="font-serif text-3xl md:text-4xl text-aura-gold mb-4">L'Engagement Aura Studio</h2><div className="w-16 h-0.5 bg-white/20 mx-auto"></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-aura-gold group-hover:bg-aura-gold group-hover:text-aura-dark transition duration-500 border border-white/10 shadow-xl"><ShoppingBag size={28}/></div>
              <h4 className="font-bold text-lg tracking-wide">Retrait Express</h4>
              <p className="text-sm text-gray-400 leading-relaxed px-4 font-light">Commandez en ligne et récupérez vos produits directement au studio à Québec.</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-aura-gold group-hover:bg-aura-gold group-hover:text-aura-dark transition duration-500 border border-white/10 shadow-xl"><Sparkles size={28}/></div>
              <h4 className="font-bold text-lg tracking-wide">Qualité Supérieure</h4>
              <p className="text-sm text-gray-400 leading-relaxed px-4 font-light">Chaque produit est testé et approuvé pour garantir la santé de vos microlocs.</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-aura-gold group-hover:bg-aura-gold group-hover:text-aura-dark transition duration-500 border border-white/10 shadow-xl"><CreditCard size={28}/></div>
              <h4 className="font-bold text-lg tracking-wide">Sécurité Totale</h4>
              <p className="text-sm text-gray-400 leading-relaxed px-4 font-light">Vos données bancaires sont traitées de manière cryptée via la plateforme Stripe.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
