import { Language, Currency } from './i18n';

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatPrice(price: number, currency: Currency): string {
  if (currency === 'EUR') {
    return `€${Math.round(price).toLocaleString()}`;
  } else {
    return `${price.toLocaleString()} MKD`;
  }
}

export function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'mk')) return saved;
    
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('mk') || browserLang.startsWith('sr')) return 'mk';
  }
  return 'en';
}

export function getInitialCurrency(): Currency {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('currency') as Currency;
    if (saved && (saved === 'EUR' || saved === 'MKD')) return saved;
  }
  return 'EUR';
}

export function createInstagramDM(instagramHandle: string, productName: string, price: string, productUrl?: string): string {
  const message = `Hi! I'm interested in ${productName} (${price})${productUrl ? ` Link: ${productUrl}` : ''}`;
  return `https://www.instagram.com/direct/inbox/compose/?text=${encodeURIComponent(message)}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
