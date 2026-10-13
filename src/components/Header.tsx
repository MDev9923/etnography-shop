'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Globe, DollarSign } from 'lucide-react';

import { getTranslation } from '@/lib/i18n';
import { useApp } from '@/lib/context';
import { useAudio } from '@/contexts/AudioContext';
import { VinylRecord } from './VinylRecord';
import { ScrollingTitle } from './ScrollingTitle';

const navigation = [
  { href: '/', key: 'nav.home' },
  { href: '/catalog', key: 'nav.catalog' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
];

export function Header() {
  const { language, currency, setLanguage, setCurrency } = useApp();
  const { isMuted, toggleMute, isPlaying, currentTrackTitle } = useAudio();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'mk' : 'en';

    setLanguage(newLanguage);
    setCurrency(newLanguage === 'en' ? 'EUR' : 'MKD');
  };

  const toggleCurrency = () => {
    const newCurrency = currency === 'EUR' ? 'MKD' : 'EUR';

    setCurrency(newCurrency);
    setLanguage(newCurrency === 'EUR' ? 'en' : 'mk');
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    setIsMenuOpen(false);
    router.push(`/catalog?search=${encodeURIComponent(query)}`);
  };

  const controlClass =
    'inline-flex shrink-0 items-center justify-center gap-2 ' +
    'rounded-lg border border-white/15 bg-black/30 px-3 py-2 ' +
    'text-sm font-medium text-white whitespace-nowrap ' +
    'transition-colors hover:bg-white/15 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

const titleClass =
  'min-w-0 flex-1 overflow-hidden text-white';

  const searchField = (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
      />

      <input
        type="search"
        aria-label={getTranslation(language, 'common.search')}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder={getTranslation(language, 'common.search')}
        className="h-10 w-full rounded-lg border border-white/15 bg-black/40 pl-10 pr-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );

  return (
    <header className="sticky top-0 z-50 isolate border-b border-white/15 bg-neutral-950">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/qr-background.png)',
          }}
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/etnography-white.png)',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center',
            backgroundSize: '40rem',
          }}
        />

        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] items-center gap-3 xl:gap-5">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex shrink-0 items-center gap-2 rounded-lg px-1 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src="/Logo.png"
              alt=""
              className="h-10 w-10 shrink-0 object-contain"
            />

            <span className="whitespace-nowrap text-lg font-bold text-primary sm:text-xl">
              Etnography
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label={
              language === 'mk' ? 'Главна навигација' : 'Main navigation'
            }
            className="hidden shrink-0 items-center gap-1 xl:flex"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {getTranslation(language, item.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden min-w-0 flex-1 xl:block"
          >
            {searchField}
          </form>

          {/* Desktop controls */}
          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={
                language === 'mk'
                  ? 'Switch to English'
                  : 'Промени на македонски'
              }
              className={controlClass}
            >
              <Globe aria-hidden="true" className="h-4 w-4" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              type="button"
              onClick={toggleCurrency}
              aria-label={
                language === 'mk' ? 'Промени валута' : 'Change currency'
              }
              className={controlClass}
            >
              <DollarSign aria-hidden="true" className="h-4 w-4" />
              <span>{currency}</span>
            </button>

            {/* Desktop music player: 352px instead of 176px */}
            <div className="ml-1 flex w-[22rem] min-w-0 items-center gap-2 border-l border-white/15 pl-3">
              <div className="shrink-0">
                <VinylRecord
                  isPlaying={isPlaying && !isMuted}
                  onClick={toggleMute}
                  size="md"
                />
              </div>

              <div className={titleClass}>
                <ScrollingTitle title={currentTrackTitle} width="sm" />
              </div>
            </div>
          </div>

          {/* Mobile and tablet controls */}
          <div className="ml-auto flex shrink-0 items-center gap-3 xl:hidden">
            <VinylRecord
              isPlaying={isPlaying && !isMuted}
              onClick={toggleMute}
              size="sm"
            />

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="header-mobile-menu"
              aria-label={
                language === 'mk'
                  ? isMenuOpen
                    ? 'Затвори мени'
                    : 'Отвори мени'
                  : isMenuOpen
                    ? 'Close menu'
                    : 'Open menu'
              }
              className="rounded-lg border border-white/15 bg-black/30 p-2 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile and tablet menu */}
        {isMenuOpen && (
          <div
            id="header-mobile-menu"
            className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/15 pb-4 pt-4 xl:hidden"
          >
            <form onSubmit={handleSearch} role="search" className="mb-4">
              {searchField}
            </form>

            <nav
              aria-label={
                language === 'mk' ? 'Главна навигација' : 'Main navigation'
              }
              className="grid grid-cols-2 gap-2"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center whitespace-nowrap rounded-lg border border-white/15 bg-black/30 px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {getTranslation(language, item.key)}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={
                  language === 'mk'
                    ? 'Switch to English'
                    : 'Промени на македонски'
                }
                className={`${controlClass} flex-1`}
              >
                <Globe aria-hidden="true" className="h-4 w-4" />
                <span>{language.toUpperCase()}</span>
              </button>

              <button
                type="button"
                onClick={toggleCurrency}
                aria-label={
                  language === 'mk' ? 'Промени валута' : 'Change currency'
                }
                className={`${controlClass} flex-1`}
              >
                <DollarSign aria-hidden="true" className="h-4 w-4" />
                <span>{currency}</span>
              </button>
            </div>

            {/* Mobile music player: title fills the remaining width */}
            <div className="mt-3 flex w-full min-w-0 items-center gap-3 rounded-lg border border-white/15 bg-black/30 px-3 py-2">
              <div className="shrink-0">
                <VinylRecord
                  isPlaying={isPlaying && !isMuted}
                  onClick={toggleMute}
                  size="sm"
                />
              </div>

              <div className={titleClass}>
                <ScrollingTitle title={currentTrackTitle} width="sm" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}