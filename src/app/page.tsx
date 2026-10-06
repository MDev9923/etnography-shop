import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { getTranslation } from '@/lib/i18n';
import { Language } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';

type Product = {
  id: number;
  slug: string;
  name: {
    en: string;
    mk: string;
  };
  brand: string;
  category: string;
  filmDigital: string;
  filmType?: string;
  mount: string;
  condition: string;
  priceEUR: number | null;
  priceMKD: number | null;
  description: {
    en: string;
    mk: string;
  };
  specs: Record<string, any>;
  images: string[];
  status?: 'available' | 'sold';
};

// Inline hook to bypass import issues
function useApp() {
  return {
    language: 'en' as Language,
    currency: 'EUR',
    setLanguage: (lang: Language) => console.log('Set language:', lang),
    setCurrency: (curr: string) => console.log('Set currency:', curr)
  };
}

export default function HomePage() {
  const { language } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
        const response = await fetch(`${apiUrl}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to local JSON if API fails
        const localProducts = (await import('@/data/products.json')).default;
        setProducts(localProducts as unknown as Product[]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get featured products (newest 6 available products)
  const featuredProducts = [...products]
    .filter((p) => p.status !== 'sold')
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-black text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-repeat" style={{
            //backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='macedonian' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M20 5c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.15'/%3E%3Cpath d='M5 15c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.25'/%3E%3Cpath d='M35 15c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.2'/%3E%3Cpath d='M5 25c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.1'/%3E%3Cpath d='M20 35c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='80' height='80' fill='url(%23macedonian)'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        {/* Background Image */}
        <div className="absolute inset-0 opacity-45">
          <img
            src="/catalog-camera.JPG"
            alt="Etnography Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo and Camera as background elements */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <img
                  src="/Logo.png"
                  alt="Etnography Logo Background"
                  className="w-96 h-96 object-contain"
                />
              </div>
              <Home className="relative z-10 h-16 w-16 mx-auto text-gray-300 opacity-80" />
            </div>
            
            <h1 className="relative z-10 text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Etnography
            </h1>
            <p className="relative z-10 text-xl text-white max-w-3xl mx-auto drop-shadow pb-5">
              {getTranslation(language, 'home.subtitle')}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center px-8 py-3 bg-card text-primary font-semibold rounded-lg hover:bg-accent transition-colors duration-200 relative z-20"
            >
              {getTranslation(language, 'home.shopNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {getTranslation(language, 'home.featured')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'en' 
                ? 'Handpicked selection of our finest camera equipment'
                : 'Рачно избрана селекција од нашата најдобра фото опрема'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-colors duration-200"
            >
              {getTranslation(language, 'home.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === 'en' ? 'Premium Quality' : 'Премиум Квалитет'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'Carefully selected and tested equipment for professionals'
                  : 'Пажливо избрана и тестирана опрема за професионалци'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === 'en' ? 'Expert Support' : 'Експертска Поддршка'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'Professional advice and support for your photography needs'
                  : 'Професионален совет и поддршка за вашите фотографски потреби'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === 'en' ? 'Fast Delivery' : 'Брза Достава'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'Quick and secure delivery to your doorstep'
                  : 'Брза и сигурна доставка до вашата врата'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
