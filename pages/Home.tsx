import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Heart, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { throttle } from '../services/performanceUtils';

const Home: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback(
    throttle((direction: 'left' | 'right') => {
      if (scrollContainerRef.current) {
        const { current } = scrollContainerRef;
        const scrollAmount = 400;
        current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    }, 150),
    []
  );

  const realizations = [
    {
      type: 'video',
      url: 'https://ik.imagekit.io/u4lig2jm2f/AQPIT9ob2DODz0SL8GqPDOYoqJFXCDyxHVyTTAJiQW-n8jj83xpmZv-k2OPLW1gEWdfV7z7bXyztY5KuOOoKLecKdv6qWD8uf7nrPOLAQQ.mp4',
      alt: 'Résultat installation microlocs Aura Studio - Détail et brillance',
      title: 'Détail installation de microlocs experte'
    },
    {
      type: 'image',
      url: 'https://ik.imagekit.io/u4lig2jm2f/576095716_2014224022660891_818868447080233546_n.jpg',
      alt: 'Portrait de microlocs après installation complète Aura Studio',
      title: 'Microlocs Installation Portrait'
    },
    {
      type: 'image',
      url: 'https://ik.imagekit.io/u4lig2jm2f/574565763_804653252379442_2926939056557316950_n.jpg',
      alt: 'Détail du resserrage des racines sur microlocs matures',
      title: 'Entretien et Maintenance Microlocs'
    },
    {
      type: 'image',
      url: 'https://ik.imagekit.io/u4lig2jm2f/615421736_857469200376697_2396014384706661373_n.jpg',
      alt: 'Réalisation Aura Microlocs Québec - Style et santé capillaire',
      title: 'Résultat Microlocs Professionnel'
    },
    {
      type: 'image',
      url: 'https://ik.imagekit.io/u4lig2jm2f/613354850_855481070701426_3628782886450825214_n%20(1).jpg',
      alt: 'Gros plan sur des microlocs parfaitement entretenues à Québec',
      title: 'Maintenance Microlocs Perfection'
    }
  ];

  return (
    <div className="animate-fade-in">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* Hero Section */}
      <section id="hero" className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.im.ge/2026/01/16/GwAmAp.Brown-Macro-Coffee-Brand-Guidelines-Presentation.png" 
            alt="Aura Microlocs - Spécialiste cheveux naturels et microlocs à Québec" 
            title="Aura Microlocs Studio"
            width="1920"
            height="1080"
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-aura-dark/70 via-aura-dark/50 to-aura-dark/80"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-6 tracking-tight leading-tight">
            Vos Microlocs, <br />
            <span className="text-aura-gold italic">Notre Passion</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
            Spécialiste en installation, entretien et resserrage de microlocs à Québec. 
            Des locs impeccables, des cheveux en bonne santé, un service personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact?tab=booking" className="bg-aura-gold text-aura-dark px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-aura-accent transition duration-300 transform hover:-translate-y-1 shadow-lg">
              Réserver mon rendez-vous
            </Link>
            <Link to="/services" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-aura-dark transition duration-300">
              Découvrir nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-aura-gold/20 rounded-full z-0"></div>
            <img 
              src="https://ik.imagekit.io/u4lig2jm2f/611659544_1555479165656955_6415288038940427528_n%20(1).jpg" 
              alt="Expertise professionnelle en microlocs Aura Studio Québec" 
              title="Pourquoi choisir Aura Microlocs"
              width="400"
              height="500"
              loading="lazy"
              className="relative z-10 rounded-lg shadow-2xl object-cover h-[500px] w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-aura-dark text-white p-6 rounded-lg shadow-xl z-20 max-w-xs hidden md:block">
              <p className="font-serif italic text-lg">"La perfection est dans les détails."</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="font-serif text-4xl text-aura-dark font-bold">Pourquoi Choisir Nos Services?</h2>
            <div className="w-20 h-1 bg-aura-gold"></div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Vos cheveux méritent le meilleur. Avec une expertise reconnue en microlocs et une approche personnalisée, nous transformons votre vision en réalité. 
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Que vous débutiez votre voyage locs ou que vous cherchiez un entretien professionnel, nous sommes là pour sublimer vos cheveux naturels.
            </p>
            <div className="bg-aura-light p-6 rounded-xl border-l-4 border-aura-accent mt-4">
              <h4 className="font-bold text-aura-dark mb-2">Notre promesse</h4>
              <p className="text-gray-700 italic">Des microlocs magnifiques qui reflètent votre personnalité, réalisées avec soin et passion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-aura-light/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-aura-dark font-bold mb-4">Ce Que Nous Offrons</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Une gamme complète de services pour accompagner la beauté de vos cheveux naturels.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-transparent hover:border-aura-gold group">
              <div className="w-14 h-14 bg-aura-dark text-aura-gold rounded-full flex items-center justify-center mb-6 group-hover:bg-aura-gold group-hover:text-white transition">
                <Star size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-aura-dark mb-3">Installation Complète</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Démarrez votre parcours locs avec une installation professionnelle sur mesure. Consultation incluse et résultats impeccables.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-transparent hover:border-aura-gold group">
              <div className="w-14 h-14 bg-aura-dark text-aura-gold rounded-full flex items-center justify-center mb-6 group-hover:bg-aura-gold group-hover:text-white transition">
                <Heart size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-aura-dark mb-3">Entretien Expert</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Gardez vos microlocs en santé. Nettoyage, hydratation, inspection minutieuse et conseils personnalisés.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-transparent hover:border-aura-gold group">
               <div className="w-14 h-14 bg-aura-dark text-aura-gold rounded-full flex items-center justify-center mb-6 group-hover:bg-aura-gold group-hover:text-white transition">
                <Clock size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-aura-dark mb-3">Resserrage</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Maintenez vos racines impeccables. Technique douce mais efficace pour une apparence soignée et durable.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-transparent hover:border-aura-gold group">
               <div className="w-14 h-14 bg-aura-dark text-aura-gold rounded-full flex items-center justify-center mb-6 group-hover:bg-aura-gold group-hover:text-white transition">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-aura-dark mb-3">Produits</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Sélection de produits professionnels pour nourrir et protéger vos microlocs au quotidien.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center text-aura-accent font-bold uppercase tracking-wide hover:text-aura-dark transition">
              Voir tous nos services <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-aura-dark text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8 text-left">
            <h2 className="font-serif text-4xl text-aura-gold">Pourquoi nous faire confiance?</h2>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-2 h-full bg-aura-gold rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-white">Expertise Professionnelle</h4>
                  <p className="text-gray-400 text-sm">Des années d'expérience et une formation continue pour maîtriser les techniques les plus récentes.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-2 h-full bg-aura-gold rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-white">Approche Personnalisée</h4>
                  <p className="text-gray-400 text-sm">Chaque tête est unique. Nous prenons le temps d'écouter vos besoins.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-2 h-full bg-aura-gold rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-white">Service Complet</h4>
                  <p className="text-gray-400 text-sm">De l'installation au resserrage, en passant par les produits : tout sous un même toit.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="rounded-xl overflow-hidden aspect-[9/16] shadow-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                <img 
                  src="https://ik.imagekit.io/u4lig2jm2f/47681581_300619553907971_1846817773863305216_n.jpg" 
                  alt="Réalisation signature Aura Microlocs Québec" 
                  title="Expertise Confiance Aura"
                  width="300"
                  height="400"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
             </div>
             <div className="rounded-xl overflow-hidden aspect-[9/16] shadow-2xl border border-white/10 bg-white/5 mt-6 md:mt-12">
               <img 
                 src="https://ik.imagekit.io/u4lig2jm2f/613354850_855481070701426_3628782886450825214_n%20(1).jpg" 
                 alt="Détail entretien microlocs professionnelles Québec" 
                 title="Expertise Microlocs Aura"
                 width="300"
                 height="500"
                 loading="lazy"
                 className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-500"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Carroussel */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="font-serif text-4xl text-aura-dark font-bold mb-4">Nos Réalisations</h2>
                <div className="w-24 h-1 bg-aura-gold mx-auto mb-6"></div>
                <p className="text-gray-500 max-w-2xl mx-auto">Des centaines de client(e)s satisfait(e)s. Découvrez l'excellence Aura Microlocs en images.</p>
            </div>
            
            <div className="relative group">
                {/* Navigation Buttons */}
                <button 
                  onClick={() => scroll('left')} 
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-xl p-4 rounded-full -ml-4 lg:-ml-6 hover:bg-aura-gold hover:text-white transition duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  title="Scroll left"
                  aria-label="Scroll carousel left"
                >
                  <ChevronLeft size={24} />
                </button>

                <div 
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto gap-6 pb-8 px-2 hide-scrollbar snap-x snap-mandatory scroll-smooth"
                >
                    {realizations.map((item, index) => (
                        <div 
                          key={index} 
                          className="min-w-[300px] md:min-w-[400px] snap-center group/card relative overflow-hidden rounded-2xl aspect-[1080/1350] cursor-pointer shadow-lg bg-gray-100"
                        >
                            {item.type === 'video' ? (
                              <video 
                                src={item.url} 
                                autoPlay 
                                muted 
                                loop 
                                playsInline
                                width="400"
                                height="500"
                                className="w-full h-full object-cover transform group-hover/card:scale-105 transition duration-700"
                              />
                            ) : (
                              <img 
                                src={item.url}
                                alt={item.alt}
                                title={item.title}
                                width="400"
                                height="500"
                                loading="lazy"
                                className="w-full h-full object-cover transform group-hover/card:scale-105 transition duration-700"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-aura-dark/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition duration-300 flex items-end p-8">
                                <span className="text-white font-serif italic text-xl border-b-2 border-aura-gold pb-2">Aura Signature</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                  onClick={() => scroll('right')} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-xl p-4 rounded-full -mr-4 lg:-mr-6 hover:bg-aura-gold hover:text-white transition duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  title="Scroll right"
                  aria-label="Scroll carousel right"
                >
                  <ChevronRight size={24} />
                </button>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-aura-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-aura-dark/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Prêt(e) à Transformer Vos Cheveux?</h2>
          <p className="text-xl mb-10 opacity-90">Ne laissez plus vos cheveux attendre. Découvrez la différence d'un service professionnel.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/contact?tab=booking" className="bg-white text-aura-accent px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-aura-dark hover:text-white transition duration-300 shadow-xl">
               Réserver maintenant
             </Link>
             <Link to="/contact?tab=contact" className="border-2 border-white text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white/20 transition duration-300">
               Nous contacter
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;