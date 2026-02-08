import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Calendar, MessageSquare, Send, Lock, Sparkles, 
  Info, Mail, Phone, Clock, ChevronRight
} from 'lucide-react';
import { sendGeneralContact } from '../services/emailService';

// Déclare le type global pour Cal.com
declare global {
  interface Window {
    Cal: any;
  }
}

type ServiceKey =
  | 'resserage'
  | 'installation'
  | 'entretien'
  | 'soin'
  | 'coloration'
  | 'transformation'
  | 'lavage'
  | 'consultation'
  | 'conseil';

type BookingService = {
  id: string;
  ns: string;
  link: string;
  title: string;
  desc: string;
  embedId: string;
  duration: string;
  priceLabel: string;
  priceNote?: string;
};

const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'contact' ? 'contact' : 'booking';
  const initialService = (searchParams.get('service') as ServiceKey) || 'resserage';
  
  const [activeTab, setActiveTab] = useState<'booking' | 'contact'>(initialTab);
  const [selectedService, setSelectedService] = useState<ServiceKey>(initialService);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const services: Record<ServiceKey, BookingService> = {
    resserage: {
      id: 'resserage',
      ns: 'resserage',
      link: '',
      title: 'Le Resserrage',
      desc: 'Maintenance des racines.',
      embedId: 'my-cal-inline-resserage',
      duration: '2h30 - 3h30',
      priceLabel: 'Entre 65$ et 100$',
      priceNote: 'Prix final confirmé après consultation.'
    },
    installation: {
      id: '300',
      ns: '300',
      link: '',
      title: 'Installation Microlocs',
      desc: 'Début de votre parcours.',
      embedId: 'my-cal-inline-300',
      duration: '5h - 8h',
      priceLabel: 'Entre 450$ et 600$',
      priceNote: 'Prix final confirmé après consultation.'
    },
    entretien: {
      id: 'test',
      ns: 'test',
      link: '',
      title: 'Entretien de Microlocs',
      desc: 'Soin complet et santé.',
      embedId: 'my-cal-inline-test',
      duration: '1h30 - 2h',
      priceLabel: '80$'
    },
    soin: {
      id: 'soin',
      ns: 'soin',
      link: '',
      title: 'Traitement (Soin)',
      desc: 'Hydratation ciblée et douceur.',
      embedId: 'my-cal-inline-soin',
      duration: '1h - 1h30',
      priceLabel: 'Entre 25$ et 35$',
      priceNote: 'Prix final confirmé après consultation.'
    },
    coloration: {
      id: 'coloration',
      ns: 'coloration',
      link: '',
      title: 'Coloration',
      desc: 'Teintes sur-mesure.',
      embedId: 'my-cal-inline-coloration',
      duration: '2h - 3h',
      priceLabel: 'Entre 45$ et 85$',
      priceNote: 'Prix final confirmé après consultation.'
    },
    transformation: {
      id: 'transformation',
      ns: 'transformation',
      link: '',
      title: 'Transformation (Ajout de rallonges)',
      desc: 'Volume et longueur intégrés.',
      embedId: 'my-cal-inline-transformation',
      duration: '2h - 4h',
      priceLabel: 'Entre 60$ et 150$',
      priceNote: 'Prix final confirmé après consultation.'
    },
    lavage: {
      id: 'lavage',
      ns: 'lavage',
      link: '',
      title: 'Lavage simple',
      desc: 'Nettoyage délicat et rafraîchissant.',
      embedId: 'my-cal-inline-lavage',
      duration: '45 min - 1h',
      priceLabel: '35$'
    },
    consultation: {
      id: 'consultation',
      ns: 'consultation',
      link: '',
      title: 'Consultation',
      desc: 'Analyse capillaire personnalisée.',
      embedId: 'my-cal-inline-consultation',
      duration: '30 - 45 min',
      priceLabel: 'Gratuit'
    },
    conseil: {
      id: 'conseil',
      ns: 'conseil',
      link: '',
      title: 'Conseil personnalisé',
      desc: 'Guidance pour l’entretien quotidien.',
      embedId: 'my-cal-inline-conseil',
      duration: '20 - 30 min',
      priceLabel: 'Gratuit pour les nouveaux clients'
    }
  };

  useEffect(() => {
    if (activeTab === 'booking' && window.Cal) {
      const config = services[selectedService];
      
      // Nettoyage de l'élément avant ré-injection
      const container = document.getElementById('booking-container');
      if (container) container.innerHTML = `<div style="width:100%;height:100%;overflow:scroll" id="${config.embedId}"></div>`;

      window.Cal("init", config.ns, { origin: "https://app.cal.com" });
      window.Cal.ns[config.ns]("inline", {
        elementOrSelector: `#${config.embedId}`,
        config: { "layout": "month_view", "useSlotsViewOnSmallScreen": "true" },
        calLink: config.link,
      });
      window.Cal.ns[config.ns]("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
    }
  }, [activeTab, selectedService]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setContactStatus('idle');

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      await sendGeneralContact(data);
      setContactStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setContactStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20 font-sans bg-aura-light/20 min-h-screen">
      {/* Hero Header */}
      <section className="bg-aura-dark text-white py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative z-10 space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl text-aura-gold uppercase tracking-widest">
            {activeTab === 'booking' ? 'Réservation' : 'Contactez-nous'}
          </h1>
          <div className="w-24 h-1 bg-aura-gold mx-auto"></div>
          <p className="text-gray-400 font-light max-w-lg mx-auto italic">
            "Votre beauté naturelle mérite une expertise dédiée."
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-full shadow-2xl border border-gray-100 flex">
            <button 
              onClick={() => setActiveTab('booking')}
              className={`px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${activeTab === 'booking' ? 'bg-aura-dark text-white shadow-lg' : 'text-gray-400 hover:text-aura-dark'}`}
            >
              <Calendar size={18} /> Réserver
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${activeTab === 'contact' ? 'bg-aura-dark text-white shadow-lg' : 'text-gray-400 hover:text-aura-dark'}`}
            >
              <MessageSquare size={18} /> Message
            </button>
          </div>
        </div>

        {activeTab === 'booking' ? (
          <div className="space-y-8 animate-fade-in">
            {/* Service Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
              {(Object.keys(services) as ServiceKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedService(key)}
                  className={`p-6 rounded-3xl text-left transition-all duration-300 border-2 ${
                    selectedService === key 
                    ? 'bg-aura-dark text-white border-aura-gold shadow-xl scale-[1.02]' 
                    : 'bg-white text-aura-dark border-transparent hover:border-aura-gold/30 shadow-md'
                  }`}
                >
                  <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${selectedService === key ? 'text-aura-gold' : 'text-gray-400'}`}>Service</p>
                  <h4 className="font-serif text-xl font-bold">{services[key].title}</h4>
                  <p className={`text-xs mt-2 ${selectedService === key ? 'text-gray-300' : 'text-gray-500'}`}>{services[key].desc}</p>
                  <div className={`mt-3 text-[11px] font-semibold ${selectedService === key ? 'text-white' : 'text-aura-dark'}`}>{services[key].priceLabel}</div>
                  <div className={`text-[10px] uppercase tracking-widest ${selectedService === key ? 'text-aura-gold' : 'text-gray-400'}`}>Durée: {services[key].duration}</div>
                  <div className={`mt-4 flex items-center text-[10px] font-bold uppercase tracking-widest ${selectedService === key ? 'text-aura-gold' : 'text-aura-accent'}`}>
                    Choisir ce service <ChevronRight size={12} className="ml-1" />
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 p-4 md:p-8 min-h-[700px]">
              <div className="text-center mb-8 space-y-2">
                <h3 className="text-2xl font-serif font-bold text-aura-dark">Calendrier : {services[selectedService].title}</h3>
                <p className="text-sm text-gray-500">{services[selectedService].priceLabel} • {services[selectedService].duration}</p>
                {services[selectedService].priceNote && (
                  <p className="text-[11px] text-aura-accent uppercase tracking-widest">{services[selectedService].priceNote}</p>
                )}
                <div className="flex items-center justify-center gap-6 pt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-1.5"><Lock size={12} className="text-aura-gold"/> Sécurisé</span>
                  <span className="flex items-center gap-1.5"><Sparkles size={12} className="text-aura-gold"/> Confirmation Immédiate</span>
                </div>
              </div>
              
              {/* Container for Cal.com Embed */}
              <div id="booking-container" className="w-full h-full min-h-[600px] bg-gray-50 rounded-2xl overflow-hidden">
                {/* Dynamically injected based on selectedService */}
              </div>

              <div className="mt-8 p-6 bg-aura-light rounded-2xl flex items-start gap-4 border border-aura-gold/10">
                <Info className="text-aura-gold flex-shrink-0 mt-1" size={20} />
                <p className="text-xs text-aura-dark/70 leading-relaxed">
                  <strong>Note sur la réservation :</strong> Veuillez choisir une date et une heure qui vous conviennent. Vous recevrez un courriel de confirmation immédiatement après la validation. Pour les tarifs variables, le prix final est confirmé après consultation. En cas d'acompte, il est calculé sur le prix minimum.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-aura-dark text-white p-10 rounded-[2.5rem] shadow-xl space-y-8 h-full">
                <h3 className="font-serif text-3xl text-aura-gold">Studio Aura</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-aura-gold border border-white/10">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Email professionnel</p>
                      <p className="text-base font-medium">Sikatialice@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-aura-gold border border-white/10">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Téléphone</p>
                      <p className="text-base font-medium">438-933-6195</p>
                    </div>
                  </div>
                </div>
                <div className="pt-10 border-t border-white/10">
                  <p className="text-[10px] uppercase font-bold text-aura-gold mb-6 tracking-[0.2em]">Heures d'ouverture</p>
                  <ul className="text-sm space-y-4 text-gray-300">
                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Mercredi & Vendredi</span> <span className="text-white font-bold">16:00 - 21:30</span></li>
                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Samedi & Dimanche</span> <span className="text-white font-bold">08:00 - 16:00</span></li>
                    <li className="flex justify-between text-gray-500 italic"><span>Autres jours</span> <span>Fermé</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl p-10 md:p-14 border border-gray-100 h-full">
              <h3 className="text-3xl font-serif font-bold text-aura-dark mb-10">Envoyez un message privé</h3>
              
              {contactStatus === 'success' && (
                <div className="bg-green-50 text-green-700 p-8 rounded-3xl mb-10 flex items-center gap-5 border border-green-100 animate-slide-in">
                  <Sparkles className="text-green-500 shrink-0" size={24} />
                  <p className="text-sm font-semibold italic">Nous avons bien reçu votre message. Une réponse vous sera adressée sous 24 heures.</p>
                </div>
              )}

              {contactStatus === 'error' && (
                <div className="bg-red-50 text-red-700 p-8 rounded-3xl mb-10 flex items-center gap-5 border border-red-100">
                  <Info className="text-red-500 shrink-0" size={24} />
                  <p className="text-sm font-semibold italic">Erreur technique. Merci de nous contacter directement par téléphone.</p>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-5 tracking-widest">Identité</label>
                    <input name="name" required className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-aura-gold/20 focus:bg-white transition-all border border-transparent" placeholder="Votre nom complet" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-5 tracking-widest">Courriel</label>
                    <input name="email" type="email" required className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-aura-gold/20 focus:bg-white transition-all border border-transparent" placeholder="votre@email.com" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-5 tracking-widest">Objet de la demande</label>
                  <input name="subject" required className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-aura-gold/20 focus:bg-white transition-all border border-transparent" placeholder="Ex: Entretien, Produits, Microlocs..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-5 tracking-widest">Votre Message</label>
                  <textarea name="message" required rows={6} className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-aura-gold/20 focus:bg-white transition-all border border-transparent resize-none" placeholder="Détaillez votre demande ici..."></textarea>
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-aura-accent text-white py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-aura-dark transition shadow-2xl disabled:opacity-50 group"
                >
                  {isSubmitting ? "Transmission en cours..." : "Transmettre ma demande"} <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;