/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioItem, ClientReview, QuoteRequest } from './types';

// Hardcoded initial assets generated during setup
export const PORTFOLIO_CATEGORIES = [
  'Logo Design',
  'Social Media Design',
  'Thumbnail Design',
  'Posters and Flyers',
  'Banners',
  'Visiting Cards'
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'burger-creative',
    title: 'Burger Creative',
    category: 'Posters and Flyers',
    imageUrl: '/src/assets/images/burger_creative_1780153108585.png',
    description: 'A contemporary high-concept poster design for a gourmet burger brand, layering artful ingredients with bold typography, intense colors, and custom neon shadow grading.',
    date: '2025-11-12',
    client: 'Burger Creative Corp',
    isFeatured: true
  },
  {
    id: 'boat-watch',
    title: 'Boat Watch',
    category: 'Banners',
    imageUrl: '/src/assets/images/boat_watch_1780153129536.png',
    description: 'A rugged and sleek product advertisement designed for the digital native smartwatch line, showcasing rich water splash effects and intense high-contrast neon tones.',
    date: '2025-12-05',
    client: 'Boat Wearables',
    isFeatured: true
  },
  {
    id: 'mamaearth-creative',
    title: 'MamaEarth Creative',
    category: 'Logo Design',
    imageUrl: '/src/assets/images/mamaearth_creative_1780153146328.png',
    description: 'An organic and clean cosmetics brand campaign, focusing on nature-inspired elements, soft lighting, and eco-friendly wellness aesthetic palettes.',
    date: '2026-02-18',
    client: 'MamaEarth Organics',
    isFeatured: true
  },
  {
    id: 'kozmic-coffee',
    title: 'Kozmic Coffee',
    category: 'Logo Design',
    imageUrl: '/src/assets/images/coffee_branding_design_1780155093190.png',
    description: 'A premium packaging label context for selection coffee beans. Emphasizing organic typography design, clean layout guidelines, and exquisite visual texture.',
    date: '2026-04-10',
    client: 'Kozmic Coffee Co.',
    isFeatured: true
  },
  {
    id: 'vogue-noir-perfume',
    title: 'Vogue Noir Perfume',
    category: 'Posters and Flyers',
    imageUrl: '/src/assets/images/perfume_packaging_design_1780155114508.png',
    description: 'High-concept luxury product visualizer designed for Noir brand. Features custom sharp modern typography, ambient stone presentation, and sleek glass highlights.',
    date: '2026-05-15',
    client: 'Vogue France',
    isFeatured: true
  }
];

export const INITIAL_REVIEWS: ClientReview[] = [
  {
    id: 'rev-1',
    name: 'Arjit Sharma',
    role: 'Brand Manager',
    reviewText: 'Honestly, working with Niorpixel was a really smooth experience. I didn’t have to explain things again and again—they understood what I wanted pretty quickly. The final design looked clean and professional. Would definitely work with them again.',
    rating: 5
  },
  {
    id: 'rev-2',
    name: 'Bhuvnesh Pasrija',
    role: 'Founder',
    reviewText: 'Yesterday (20/09/2025) we talked with Mr. Mayank for our logo work. From yesterday night he starts doing working on logo work with all the details we provided to him. When the outcome comes in front of us is really very impressive. He is really very Hard working and passionate about his work. Keep it up 👍',
    rating: 5
  },
  {
    id: 'rev-3',
    name: 'Ronit Rathee',
    role: 'Youtuber and Reel Creator',
    reviewText: 'Great work and with a good creative mindset. Person is very creative and trusted everyone should use this to create a better design and creativity. I like the work. Person is very hardworking and very trusted and a good knowledge about the work. Everyone should use this firm to make their creative mind in reality. Thanku',
    rating: 5
  }
];

// Helper functions for LocalStorage management
let inMemoryPortfolio: PortfolioItem[] | null = null;

export const getStoredPortfolio = (): PortfolioItem[] => {
  if (inMemoryPortfolio) return inMemoryPortfolio;
  if (typeof window === 'undefined') return INITIAL_PORTFOLIO;
  const stored = localStorage.getItem('niorpixel_portfolio');
  if (stored) {
    try {
      const items = JSON.parse(stored);
      if (Array.isArray(items)) {
        inMemoryPortfolio = items.map((item: any) => {
          let cat = item.category || 'Logo Design';
          if (cat === 'Commercial Art & Branding') {
            cat = 'Posters and Flyers';
          } else if (cat === 'Product & Advertising') {
            cat = 'Banners';
          } else if (cat === 'Eco Branding & Design') {
            cat = 'Logo Design';
          } else if (cat === 'Brand Kits') {
            cat = 'Logo Design';
          } else if (cat === 'Packaging & Illustration') {
            cat = 'Logo Design';
          } else if (cat === 'Web Development') {
            cat = 'Banners';
          }
          return { ...item, category: cat };
        });
        return inMemoryPortfolio;
      }
    } catch (e) {
      console.error('Failed to parse stored portfolio', e);
    }
  }
  inMemoryPortfolio = [...INITIAL_PORTFOLIO];
  return inMemoryPortfolio;
};

export const saveStoredPortfolio = (items: PortfolioItem[]) => {
  inMemoryPortfolio = items;
  try {
    localStorage.setItem('niorpixel_portfolio', JSON.stringify(items));
    return true;
  } catch (e) {
    console.error('Failed to save portfolio items to localStorage:', e);
    return false;
  }
};

export const getStoredReviews = (): ClientReview[] => {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  const stored = localStorage.getItem('niorpixel_reviews');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored reviews', e);
    }
  }
  return INITIAL_REVIEWS;
};

export const saveStoredReviews = (reviews: ClientReview[]) => {
  localStorage.setItem('niorpixel_reviews', JSON.stringify(reviews));
};

export const getStoredQuotes = (): QuoteRequest[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('niorpixel_quotes');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored quotes', e);
    }
  }
  return [];
};

export const saveStoredQuotes = (quotes: any[]) => {
  localStorage.setItem('niorpixel_quotes', JSON.stringify(quotes));
};

export const BRANCHES_DATA = [
  {
    name: 'Gurugram Headquarters',
    city: 'Gurugram',
    address: 'Sector 104, Gurugram, Haryana 122001',
    phone: '+91 9354200231',
    email: 'DESIGNSTUDIONIORPIXEL@GMAIL.COM'
  },
  {
    name: 'New Delhi Studio',
    city: 'Delhi NCR',
    address: 'Connaught Place, New Delhi, 110001',
    phone: '+91 9354200231',
    email: 'DELHI@NIORPIXEL.COM'
  },
  {
    name: 'Mumbai Creative Lab',
    city: 'Mumbai',
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    phone: '+91 9354200231',
    email: 'MUMBAI@NIORPIXEL.COM'
  }
];
