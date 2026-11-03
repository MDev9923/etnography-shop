'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useApp } from '@/lib/context';
import { getTranslation } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { language, currency } = useApp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert(language === 'mk' ? 'Кошничката е празна' : 'Cart is empty');
      return;
    }

    // Generate email body
    const message = `
${language === 'mk' ? 'Нова нарачка' : 'New Order'}:

${language === 'mk' ? 'Име' : 'Name'}: ${formData.name}
${language === 'mk' ? 'Email' : 'Email'}: ${formData.email}
${language === 'mk' ? 'Телефон' : 'Phone'}: ${formData.phone}
${language === 'mk' ? 'Адреса' : 'Address'}: ${formData.address}

${language === 'mk' ? 'Продукти' : 'Products'}:
${cart.map((item, index) => `${index + 1}. ${item.brand} ${language === 'mk' ? item.nameMK : item.nameEN} - ${currency === 'EUR' ? `€${Math.round(item.priceEUR || 0)}` : `${Math.round(item.priceMKD || 0)} ден`}`).join('\n')}

${language === 'mk' ? 'Вкупно' : 'Total'}: ${currency === 'EUR' ? `€${Math.round(cartTotal.EUR || 0)}` : `${Math.round(cartTotal.MKD || 0)} ден`}

${language === 'mk' ? 'Белешки' : 'Notes'}: ${formData.notes || '-'}
    `.trim();

    // Open email client
    const subject = encodeURIComponent(language === 'mk' ? 'Нова нарачка - Etnography' : 'New Order - Etnography');
    const body = encodeURIComponent(message);
    const emailUrl = `mailto:contact@etnography.com?subject=${subject}&body=${body}`;

    window.location.href = emailUrl;

    // Clear cart after successful order
    clearCart();
    router.push('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'mk' ? 'Кошничката е празна' : 'Your cart is empty'}
            </h1>
            <p className="text-gray-600 mb-6">
              {language === 'mk'
                ? 'Додадете продукти за да продолжите'
                : 'Add some products to continue'}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === 'mk' ? 'Кон каталог' : 'Back to Catalog'}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {language === 'mk' ? 'Кошничка' : 'Checkout'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.brand} {item.name}</h3>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    {currency === 'EUR'
                      ? `€${Math.round(item.priceEUR || 0)}`
                      : `${Math.round(item.priceMKD || 0)} ден`}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'mk' ? 'Нарачка' : 'Order Details'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'mk' ? 'Име' : 'Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'mk' ? 'Email' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'mk' ? 'Телефон' : 'Phone'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'mk' ? 'Адреса' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'mk' ? 'Белешки' : 'Notes'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                    <span>{language === 'mk' ? 'Вкупно' : 'Total'}</span>
                    <span>
                      {currency === 'EUR'
                        ? `€${Math.round(cartTotal.EUR || 0)}`
                        : `${Math.round(cartTotal.MKD || 0)} ден`}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 font-medium"
                  >
                    {language === 'mk' ? 'Порачај преку Email' : 'Order via Email'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
