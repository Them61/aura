
/**
 * Service d'envoi d'emails via EmailJS
 */

import emailjs from '@emailjs/browser';

const EMAIL_CONFIG = {
  PUBLIC_KEY: 'ieVFxq_2dKb6KsOOO',
  SERVICE_ID: 'service_13jnj44',
  TEMPLATES: {
    TO_OWNER: 'template_w6pm6jm',
    TO_CLIENT: 'template_58yo7aw',
    GENERAL_CONTACT: 'template_w6pm6jm' // Utilisation du template admin pour les contacts aussi
  },
  OWNER_EMAIL: 'aterne9@gmail.com',
  BUSINESS_NAME: 'Aura Microlocs',
  BUSINESS_PHONE: '438-933-6195'
};

emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

export interface BookingData {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const formatDateFr = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Envoie les emails de confirmation de réservation (admin + client)
 * Valide la présence de tous les champs requis avant l'envoi.
 */
export const sendBookingEmails = async (data: BookingData): Promise<void> => {
  // Validation des champs obligatoires
  const requiredFields: (keyof BookingData)[] = ['fullName', 'email', 'phone', 'service', 'date', 'time'];
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      console.error(`❌ Validation Error: Le champ ${field} est requis.`);
      throw new Error(`Informations de réservation incomplètes : le champ ${field} est manquant.`);
    }
  }

  try {
    const formattedDate = formatDateFr(data.date);
    const timestamp = new Date().toLocaleString('fr-FR');

    const ownerParams = {
      to_email: EMAIL_CONFIG.OWNER_EMAIL,
      client_name: data.fullName,
      client_email: data.email,
      client_phone: data.phone,
      service: data.service,
      date_formatted: formattedDate,
      time: data.time,
      message: data.message || 'Aucun message',
      timestamp: timestamp
    };

    // Email pour l'administrateur
    await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATES.TO_OWNER, ownerParams);

    const clientParams = {
      to_email: data.email,
      client_first_name: data.fullName.split(' ')[0],
      service: data.service,
      date_formatted: formattedDate,
      time: data.time,
      business_name: EMAIL_CONFIG.BUSINESS_NAME,
      business_phone: EMAIL_CONFIG.BUSINESS_PHONE,
      business_email: EMAIL_CONFIG.OWNER_EMAIL
    };

    // Email pour le client
    await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATES.TO_CLIENT, clientParams);
  } catch (error) {
    console.error('❌ EmailJS Booking Error:', error);
    throw error;
  }
};

/**
 * Envoie un message de contact général à l'administrateur
 * Valide la présence de tous les champs requis avant l'envoi.
 */
export const sendGeneralContact = async (data: ContactData): Promise<void> => {
  // Validation des champs obligatoires
  const requiredFields: (keyof ContactData)[] = ['name', 'email', 'subject', 'message'];
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      console.error(`❌ Validation Error: Le champ ${field} est requis.`);
      throw new Error(`Informations de contact incomplètes : le champ ${field} est manquant.`);
    }
  }

  try {
    const params = {
      to_email: EMAIL_CONFIG.OWNER_EMAIL,
      client_name: data.name,
      client_email: data.email,
      service: `DEMANDE D'INFO: ${data.subject}`,
      message: data.message,
      timestamp: new Date().toLocaleString('fr-FR')
    };

    await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATES.GENERAL_CONTACT, params);
  } catch (error) {
    console.error('❌ EmailJS Contact Error:', error);
    throw error;
  }
};
