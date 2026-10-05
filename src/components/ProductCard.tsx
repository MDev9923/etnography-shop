'use client';

import Link from 'next/link';
import { useApp } from '@/lib/context';
import { getTranslation } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { Eye } from 'lucide-react';

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'
).replace(/\/+$/, '');

function getImageUrl(value?: string): string {
  let url = value?.trim() || '';

  if (!url) {
    return '/placeholder-product.jpg';
  }

  // Repair URLs that accidentally contain the API URL before an R2 URL.
  while (
    url.startsWith(API_URL) &&
    /^https?:\/\//i.test(url.slice(API_URL.length))
  ) {
    url = url.slice(API_URL.length);
  }

  // Preserve complete R2 and other public image URLs.
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // Support older images served by the backend.
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    return `${API_URL}/${url.replace(/^\/+/, '')}`;
  }

  return url;
}

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
  specs: Record<string, any>;
  images: string[];
}

interface ProductCardProps {
  product: Product;
  showConditionBadge?: boolean;
}

export function ProductCard({
  product,
  showConditionBadge = true,
}: ProductCardProps) {
  const { language, currency } = useApp();

  const price =
    currency === 'EUR' ? product.priceEUR : product.priceMKD;

  const formattedPrice = formatPrice(price ?? 0, currency);
  const productName =
    product.name[language] || product.name.en || product.brand;

  const conditionText = getTranslation(
    language,
    `catalog.conditions.${product.condition.replace(' ', '')}`
  );

  const isSold = product.status === 'sold';
  const imageUrl = getImageUrl(product.images?.[0]);
  const productUrl = `/product/${product.slug}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <Link href={productUrl} className="block">
        <div className="relative aspect-[4/3] bg-white overflow-hidden">
          <img
            src={imageUrl}
            alt={productName}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-2"
            onError={(e) => {
              const image = e.currentTarget;

              if (image.dataset.fallbackApplied === 'true') return;

              image.dataset.fallbackApplied = 'true';
              image.src = '/placeholder-product.jpg';
            }}
          />

          {showConditionBadge && (
            <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700">
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
            {isSold ? 'SOLD' : 'AVAILABLE'}
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-sm text-gray-500">
            {product.brand}
          </span>

          <Link href={productUrl}>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {productName}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-2 mb-4">
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

        <Link
          href={productUrl}
          className="mt-auto w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Eye className="h-4 w-4" />
          <span>
            {getTranslation(language, 'common.viewDetails')}
          </span>
        </Link>
      </div>
    </div>
  );
}