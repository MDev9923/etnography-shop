'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useApp } from '@/lib/context';
import { getTranslation } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, ChevronLeft, ChevronRight, Instagram, Mail } from 'lucide-react';

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
  specs: Record<string, any>;
  images: string[];
  status?: 'available' | 'sold';
};

export default function ProductPage() {
  const { language, currency } = useApp();
  const params = useParams();
  const slug = params.slug as string;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const product = allProducts.find((p) => p.slug === slug);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
        const response = await fetch(`${apiUrl}/api/products`);
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to local JSON if API fails
        const localProducts = (await import('@/data/products.json')).default;
        setAllProducts(localProducts as unknown as Product[]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-gray-900">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Product Not Found' : 'Производот не е пронајден'}
            </h1>
            <p className="text-gray-600">
              {language === 'en'
                ? 'The product you are looking for does not exist.'
                : 'Производот што го барате не постои.'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isSold = product.status === 'sold';
  const price = currency === 'EUR' ? product.priceEUR : product.priceMKD;
  const formattedPrice = formatPrice(price ?? 0, currency);
  const productName = product.name[language];
  const description = product.description[language];

  const conditionText = getTranslation(
    language,
    `catalog.conditions.${product.condition.replace(/\s+/g, '')}`
  );
  const categoryText = getTranslation(language, `catalog.categories.${product.category}`);
  const typeText = getTranslation(language, `catalog.types.${product.filmDigital}`);

  const images = product.images?.length ? product.images : ['/placeholder-product.jpg'];
  const safeIndex = Math.min(currentImageIndex, images.length - 1);
  const currentImage = images[safeIndex];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleInstagramDM = () => {
    const url = 'https://ig.me/m/_etnography';
    if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailOrder = () => {
    const name = product?.name?.[language] ?? product?.name?.en ?? 'Product';
    const brand = product?.brand ?? '';
    const subject = encodeURIComponent(`Order Inquiry - ${name}`);

    const body = encodeURIComponent(
      [
        language === 'en' ? 'Hello,' : 'Здраво,',
        '',
        language === 'en'
          ? `I'm interested in purchasing: ${name}${brand ? ` (${brand})` : ''}`
          : `Заинтересиран сум за купување: ${name}${brand ? ` (${brand})` : ''}`,
        `Product ID: ${product?.id ?? ''}`,
        '',
        language === 'en'
          ? 'Please let me know about availability and payment options.'
          : 'Ве молам известете ме за достапност и детали за плаќање.',
      ].filter(Boolean).join('\n')
    );

    const mailtoUrl = `mailto:etnography35mk@gmail.com?subject=${subject}&body=${body}`;

    if (typeof window !== 'undefined') {
      try {
        window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.error('Email order failed:', e);
        alert(
          language === 'en'
            ? 'Failed to open email client. Please copy the email address: etnography35mk@gmail.com'
            : 'Не успе да се отвори е-пошта клиент. Копирајте го адресот: etnography35mk@gmail.com'
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ✅ Background Music: has a real src and will try autoplay on mount */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{getTranslation(language, 'common.back')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentImage || '/placeholder-product.jpg'}
                alt={productName}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === safeIndex
                        ? 'border-blue-500 opacity-100'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-2">
                <span className="text-sm text-gray-500">{product.brand}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{categoryText}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{typeText}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{productName}</h1>

              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>

                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {conditionText}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isSold ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-800'
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
              <p className="text-gray-600 leading-relaxed">{description}</p>
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
                onClick={isSold ? undefined : handleInstagramDM}
                disabled={isSold}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
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
                onClick={handleEmailOrder}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>{language === 'en' ? 'Email for Order' : 'Е-пошта за Нарачка'}</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Instagram className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {language === 'en' ? 'How to Purchase' : 'Како да купите'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                {language === 'en'
                      ? 'Click the "DM to Buy" button to contact us via Instagram (@_etnography) with your inquiry. Our team will respond promptly with availability and payment details.'
                  : 'Кликнете на "Порака за Купување" за да не контактирате преку Instagram (@_etnography) со вашето прашање. Нашиот тим ќе одговори брзо со информации за достапност и детали за плаќање.'
}
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
