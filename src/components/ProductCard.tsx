'use client';

import Link from 'next/link';
import { useApp } from '@/lib/context';
import { useCart } from '@/contexts/CartContext';
import { getTranslation } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { Eye, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'
).replace(/\/+$/, '');

function getImageUrl(value?: string): string {
  let url = value?.trim() || '';

  if (!url) {
    return '/placeholder-product.jpg';
  }

  // Repair URLs containing the API URL before a complete image URL.
  while (
    url.startsWith(API_URL) &&
    /^https?:\/\//i.test(url.slice(API_URL.length))
  ) {
    url = url.slice(API_URL.length);
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

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
  specs: Record<string, unknown>;
  images: string[];
  quantity?: number;
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
  const { addToCart, canAddToCart, getCartQuantity } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);

  const price =
    currency === 'EUR' ? product.priceEUR : product.priceMKD;

  const formattedPrice = formatPrice(price ?? 0, currency);

  const productName =
    product.name[language] || product.name.en || product.brand;

  const conditionText = getTranslation(
    language,
    `catalog.conditions.${product.condition.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/\s+/g, '')}`
  ) || product.condition;

  const availableText = getTranslation(language, 'catalog.common.available');
  const soldText = getTranslation(language, 'catalog.common.sold');

  const isSold = product.status === 'sold';
  const imageUrl = getImageUrl(product.images?.[0]);
  const productUrl = `/product/${product.slug}`;

  const maxQuantity = product.quantity ?? 1;
  const cartQuantity = getCartQuantity(product.id);
  const canAdd = canAddToCart(product.id, maxQuantity);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <Link href={productUrl} className="block">
        <div
          className="group relative aspect-[4/3] bg-white overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/camera-bg.png')",
          }}
        >
          <img
            key={imageUrl}
            src={imageUrl}
            alt={productName}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-300 ease-out group-hover:scale-110"
            onError={(event) => {
              const image = event.currentTarget;

              if (image.dataset.fallbackApplied === 'true') {
                return;
              }

              image.dataset.fallbackApplied = 'true';
              image.src = '/placeholder-product.jpg';
            }}
          />

          {showConditionBadge && (
            <div className="absolute z-10 top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700">
              {conditionText}
            </div>
          )}

          <div
            className={`absolute z-10 top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
              isSold
                ? 'bg-red-600 text-white'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isSold ? soldText : availableText}
          </div>
        </div>
      </Link>

      <div className="p-2 flex flex-col flex-1">
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

        {/* Description - truncate and preserve line breaks */}
        <div className="mb-4 flex-1">
          <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">
            {product.description?.[language] || product.description?.en || ''}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            {formattedPrice}
          </span>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm text-gray-500 capitalize">
              {getTranslation(
                language,
                `catalog.categories.${product.category}`
              )}
            </span>
            {(product.quantity ?? 1) > 1 && (
              <span className="text-xs text-gray-400">
                Qty: {product.quantity}
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <Link
            href={productUrl}
            className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Eye className="h-4 w-4" />

            <span>
              {getTranslation(language, 'common.viewDetails')}
            </span>
          </Link>

          {!isSold && (
            <button
              onClick={() => {
                if (canAdd) {
                  setShowConfirm(true);
                }
              }}
              disabled={!canAdd}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 ${
                canAdd
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>
                {getTranslation(language, 'common.addToCart')}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Confirm Add to Cart Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">
              {getTranslation(language, 'common.addToCart')}
            </h3>
            <p className="text-gray-600 mb-4">
              {getTranslation(language, 'common.addToCartConfirm', {
                productName: productName,
              })}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                {getTranslation(language, 'common.cancel')}
              </button>
              <button
                onClick={() => {
                  addToCart({
                    id: product.id,
                    slug: product.slug,
                    name: productName,
                    brand: product.brand,
                    priceEUR: product.priceEUR,
                    priceMKD: product.priceMKD,
                    image: imageUrl,
                    nameEN: product.name.en,
                    nameMK: product.name.mk,
                    maxQuantity,
                  });
                  setShowConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {getTranslation(language, 'common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}