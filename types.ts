export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  idealFor: string[];
  includes: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}