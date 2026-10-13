'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';
import { useApp } from '@/lib/context';
import { useAudio } from '@/contexts/AudioContext';
import { Search, Menu, X, Globe, DollarSign } from 'lucide-react';
import { VinylRecord } from './VinylRecord';
import { ScrollingTitle } from './ScrollingTitle';

export function Header() {
  const { language, currency, setLanguage, setCurrency } = useApp();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isMuted, toggleMute, isPlaying, currentTrackTitle } = useAudio();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'mk' : 'en';
    setLanguage(newLang);
    setCurrency(newLang === 'en' ? 'EUR' : 'MKD');
  };

  const toggleCurrency = () => {
    const newCurrency = currency === 'EUR' ? 'MKD' : 'EUR';
    setCurrency(newCurrency);
    setLanguage(newCurrency === 'EUR' ? 'en' : 'mk');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/catalog?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="bg-card border-border border-b sticky top-0 z-50 relative overflow-hidden">
      {/* Macedonian Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img src="/Logo.png" alt="Etnography Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-primary">Etnography</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            >
              {getTranslation(language, 'nav.home')}
            </Link>
            <Link
              href="/catalog"
              className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            >
              {getTranslation(language, 'nav.catalog')}
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            >
              {getTranslation(language, 'nav.about')}
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
            >
              {getTranslation(language, 'nav.contact')}
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getTranslation(language, 'common.search')}
                className="w-64 pl-10 pr-4 py-2 bg-input border-border border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </form>

          {/* Language, Currency, Music */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 text-sm border-border border rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              <Globe className="h-4 w-4" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={toggleCurrency}
              className="flex items-center space-x-1 px-3 py-2 text-sm border-border border rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              <DollarSign className="h-4 w-4" />
              <span>{currency}</span>
            </button>

            {/* Music Player */}
            <div className="flex items-center space-x-2 px-3 py-2 border-border border rounded-lg hover:bg-muted transition-colors">
              <VinylRecord isPlaying={isPlaying && !isMuted} onClick={toggleMute} size="md" />
              <ScrollingTitle title={currentTrackTitle} width="md" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Compact Music Player - only show vinyl on mobile */}
            <VinylRecord isPlaying={isPlaying && !isMuted} onClick={toggleMute} size="sm" />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-foreground hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-card border-border border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {getTranslation(language, 'nav.home')}
              </Link>

              <Link
                href="/catalog"
                className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {getTranslation(language, 'nav.catalog')}
              </Link>

              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {getTranslation(language, 'nav.about')}
              </Link>

              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {getTranslation(language, 'nav.contact')}
              </Link>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={getTranslation(language, 'common.search')}
                    className="w-full pl-10 pr-4 py-2 bg-input border-border border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </form>

              {/* Mobile Language & Currency */}
              <div className="px-3 py-2 space-y-2">
                {/* Mobile Music Player */}
                <div className="flex items-center justify-center space-x-2 px-3 py-2 border-border border rounded-lg bg-muted">
                  <VinylRecord isPlaying={isPlaying && !isMuted} onClick={toggleMute} size="md" />
                  <ScrollingTitle title={currentTrackTitle} width="md" />
                </div>

                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-center space-x-1 px-3 py-2 text-sm border-border border rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  <span>{language.toUpperCase()}</span>
                </button>

                <button
                  onClick={toggleCurrency}
                  className="w-full flex items-center justify-center space-x-1 px-3 py-2 text-sm border-border border rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>{currency}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
