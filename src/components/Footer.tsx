'use client';

import Link from 'next/link';
import { getTranslation } from '@/lib/i18n';
import { Instagram, Mail, Phone } from 'lucide-react';
import { useApp } from '@/lib/context';

export function Footer() {
  const { language } = useApp();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">
              {getTranslation(language, 'about.title')}
            </h3>
            <p className="text-gray-300 mb-4">
              {language === 'en' 
                ? 'Professional photography equipment in Skopje, Macedonia'
                : 'Професионална фото опрема во Скопје, Македонија'
              }
            </p>
            <div className="flex space-x-4">
              <a
                href="https://ig.me/_etnography"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="mailto:etnography35mk@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
              <a
                href="tel:+38912345678"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {getTranslation(language, 'footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  {getTranslation(language, 'nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-white transition-colors">
                  {getTranslation(language, 'nav.catalog')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {getTranslation(language, 'nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {getTranslation(language, 'nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {getTranslation(language, 'footer.contactInfo')}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-300" />
                <span className="text-gray-300">etnography35mk@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Instagram className="h-4 w-4 text-gray-300" />
                <span className="text-gray-300">_etnography</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 {getTranslation(language, 'about.title')}. {getTranslation(language, 'common.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
