'use client';

import Link from 'next/link';
import { useApp } from '@/lib/context';
import { getTranslation } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface Product {
  id: number;
  slug: string;
  name: {
    en: string;
    mk: string;
  };
  brand: string;
  category: string;
  status?: 'available' | 'sold';
  condition: string;
  priceEUR: number | null;
  priceMKD: number | null;
  description: {
    en: string;
    mk: string;
  };
  specs: Record<string, unknown>;
  images: string[];
}

interface ProductCardProps {
  product: Product;
  showConditionBadge?: boolean;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'
).replace(/\/+$/, '');

function getImageUrl(image?: string): string {
  if (!image?.trim()) {
    return '/placeholder-product.jpg';
  }

  let url = image.trim();

  // Repair a backend URL accidentally prefixed to an R2 URL.
  if (url.startsWith(API_URL)) {
    const remainder = url.slice(API_URL.length);

    if (/^https?:\/\//i.test(remainder)) {
      url = remainder;
    }
  }

  // Preserve complete image URLs.
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // Legacy images served by the backend.
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }

  if (url.startsWith('uploads/')) {
    return `${API_URL}/${url}`;
  }

  // Frontend assets.
  return url;
}

export function ProductCard({
  product,
  showConditionBadge = true
}: ProductCardProps) {
  const { language, currency } = useApp();

  const price = currency === 'EUR' ? product.priceEUR : product.priceMKD;
  const formattedPrice = formatPrice(price ?? 0, currency);
  const productName = product.name[language] || product.name.en;

  const conditionText = getTranslation(
    language,
    `catalog.conditions.${product.condition.replace(/\s+/g, '')}`
  );

  const isSold = product.status === 'sold';
  const imageUrl = getImageUrl(product.images?.[0]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/3] bg-gray-100">
          <img
            src={imageUrl}
            alt={productName}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {showConditionBadge && (
            <div className="absolute top-2 left-2 bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-medium">
              {conditionText}
            </div>
          )}

          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
              isSold
                ? 'bg-red-600 text-white'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isSold
              ? language === 'en'
                ? 'SOLD'
                : 'ПРОДАДЕНО'
              : language === 'en'
                ? 'AVAILABLE'
                : 'ДОСТАПНО'}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-sm text-gray-500">{product.brand}</span>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {productName}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-gray-900">
            {formattedPrice}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {getTranslation(
              language,
              `catalog.categories.${product.category}`
            )}
          </span>
        </div>

        {/* Additional image retained from your original card. */}
        <div className="mb-3 flex justify-center">
          <img
            src={imageUrl}
            alt={productName}
            loading="lazy"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>{getTranslation(language, 'common.viewDetails')}</span>
        </Link>
      </div>
    </div>
  );
}