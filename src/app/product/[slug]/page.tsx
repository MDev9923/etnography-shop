'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useApp } from '@/lib/context';
import { getTranslation } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Mail
} from 'lucide-react';

type Product = {
  id: number;
  slug: string;
  name: { en: string; mk: string };
  brand: string;
  category: string;
  filmDigital: string;
  filmType?: string;
  mount: string;
  condition: string;
  priceEUR: number | null;
  priceMKD: number | null;
  description: { en: string; mk: string };
  specs: Record<string, unknown>;
  images: string[];
  status?: 'available' | 'sold';
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'
).replace(/\/+$/, '');

function getImageUrl(image: string): string {
  let url = image.trim();

  // Repair a backend URL accidentally prefixed to a complete image URL.
  if (url.startsWith(API_URL)) {
    const remainder = url.slice(API_URL.length);

    if (/^https?:\/\//i.test(remainder)) {
      url = remainder;
    }
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }

  if (url.startsWith('uploads/')) {
    return `${API_URL}/${url}`;
  }

  return url;
}

export default function ProductPage() {
  const { language, currency } = useApp();
  const params = useParams();
  const slug = params.slug as string;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = allProducts.find((item) => String(item.slug) === slug);

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid products response');
        }

        if (active) {
          setAllProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);

        try {
          const localProducts = (await import('@/data/products.json')).default;

          if (active) {
            setAllProducts(localProducts as unknown as Product[]);
          }
        } catch (fallbackError) {
          console.error('Failed to load local products:', fallbackError);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-center text-gray-900">
            {language === 'en'
              ? 'Loading product...'
              : 'Се вчитува производот...'}
          </p>
        </main>

        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'en'
                ? 'Product Not Found'
                : 'Производот не е пронајден'}
            </h1>

            <p className="text-gray-600">
              {language === 'en'
                ? 'The product you are looking for does not exist.'
                : 'Производот што го барате не постои.'}
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const isSold = product.status === 'sold';
  const price = currency === 'EUR' ? product.priceEUR : product.priceMKD;
  const formattedPrice = formatPrice(price ?? 0, currency);

  const productName = product.name[language] || product.name.en;
  const description =
    product.description?.[language] || product.description?.en || '';

  const conditionText = getTranslation(
    language,
    `catalog.conditions.${product.condition.replace(/\s+/g, '')}`
  );

  const categoryText = getTranslation(
    language,
    `catalog.categories.${product.category}`
  );

  const typeText = product.filmDigital
    ? getTranslation(language, `catalog.types.${product.filmDigital}`)
    : '';

  const validImages = (product.images || []).filter(
    (image) => typeof image === 'string' && image.trim().length > 0
  );

  const images = validImages.length
    ? validImages.map(getImageUrl)
    : ['/placeholder-product.jpg'];

  const safeIndex = Math.min(currentImageIndex, images.length - 1);
  const currentImage = images[safeIndex];

  const nextImage = () => {
    setCurrentImageIndex((previous) => (previous + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (previous) => (previous - 1 + images.length) % images.length
    );
  };

  const handleInstagramDM = () => {
    window.open(
      'https://ig.me/m/_etnography',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleEmailOrder = () => {
    const subject = encodeURIComponent(`Order Inquiry - ${productName}`);

    const body = encodeURIComponent(
      [
        language === 'en' ? 'Hello,' : 'Здраво,',
        '',
        language === 'en'
          ? `I'm interested in purchasing: ${productName}${
              product.brand ? ` (${product.brand})` : ''
            }`
          : `Заинтересиран сум за купување: ${productName}${
              product.brand ? ` (${product.brand})` : ''
            }`,
        `Product ID: ${product.id}`,
        `URL: ${window.location.href}`,
        '',
        language === 'en'
          ? 'Please let me know about availability and payment options.'
          : 'Ве молам известете ме за достапност и детали за плаќање.'
      ].join('\n')
    );

    const gmailUrl =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      '&to=etnography35mk%40gmail.com' +
      `&su=${subject}` +
      `&body=${body}`;

    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{getTranslation(language, 'common.back')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div className="min-w-0 space-y-4">
            <div className="relative aspect-square w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={currentImage}
                alt={productName}
                className="absolute inset-0 block w-full h-full object-contain p-6 sm:p-8"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white transition-all"
                    aria-label={
                      language === 'en' ? 'Previous image' : 'Претходна слика'
                    }
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white transition-all"
                    aria-label={
                      language === 'en' ? 'Next image' : 'Следна слика'
                    }
                  >
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      index === safeIndex
                        ? 'border-blue-500 opacity-100'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={
                      language === 'en'
                        ? `View image ${index + 1}`
                        : `Прикажи слика ${index + 1}`
                    }
                    aria-pressed={index === safeIndex}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      className="block w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product information */}
          <div className="min-w-0 space-y-6">
            <div>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-2">
                <span className="text-sm text-gray-500">
                  {product.brand}
                </span>

                <span className="text-gray-300">•</span>

                <span className="text-sm text-gray-500">
                  {categoryText}
                </span>

                {typeText && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {typeText}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {productName}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formattedPrice}
                </span>

                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {conditionText}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isSold
                        ? 'bg-red-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isSold
                      ? language === 'en'
                        ? 'Sold'
                        : 'Продадено'
                      : language === 'en'
                        ? 'Available'
                        : 'Достапно'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getTranslation(language, 'product.description')}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getTranslation(language, 'product.specifications')}
              </h3>

              <div className="bg-gray-50 rounded-lg p-6">
                <dl className="space-y-3">
                  {Object.entries(product.specs ?? {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4">
                      <dt className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>

                      <dd className="text-sm text-gray-900 font-medium text-right">
                        {String(value)}
                      </dd>
                    </div>
                  ))}

                  <div className="flex justify-between pt-3 border-t border-gray-200 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      {getTranslation(language, 'product.condition')}
                    </dt>

                    <dd className="text-sm text-gray-900 font-medium text-right">
                      {conditionText}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleInstagramDM}
                disabled={isSold}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSold
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-accent hover:to-primary'
                }`}
              >
                <Instagram className="h-5 w-5" />

                <span>
                  {isSold
                    ? language === 'en'
                      ? 'Sold'
                      : 'Продадено'
                    : language === 'en'
                      ? 'DM for Info'
                      : 'Порака за Информации'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleEmailOrder}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="h-5 w-5" />

                <span>
                  {language === 'en'
                    ? 'Email for Order'
                    : 'Е-пошта за Нарачка'}
                </span>
              </button>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Instagram className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {language === 'en'
                      ? 'How to Purchase'
                      : 'Како да купите'}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Contact us via Instagram (@_etnography), or click “Email for Order” to open a prepared message in Gmail. We will respond with availability and payment details.'
                      : 'Контактирајте нè преку Instagram (@_etnography), или кликнете на „Е-пошта за Нарачка“ за да отворите подготвена порака во Gmail. Ќе одговориме со информации за достапност и детали за плаќање.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}