'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useApp } from '@/lib/context';
import { getTranslation } from '@/lib/i18n';
import { ArrowRight, Filter, Search, X, ChevronDown } from 'lucide-react';

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
  status?: 'available' | 'sold';
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
};

export default function CatalogPage() {
  const { language, currency } = useApp();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    filmDigital: '',
    filmType: '',
    mount: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    showSold: false
  });
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3003/api/products');
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

  // Get unique values for filters
  const uniqueBrands = useMemo(() => Array.from(new Set(allProducts.map(p => p.brand))), [allProducts]);
  const uniqueMounts = useMemo(() => Array.from(new Set(allProducts.map(p => p.mount).filter(m => m !== 'N/A'))), [allProducts]);

  // Initialize filters from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const search = urlParams.get('search') || '';
      setFilters(prev => ({ ...prev, search }));
    }
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      if (filters.search && !product.name[language].toLowerCase().includes(filters.search.toLowerCase()) && 
          !product.brand.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      const isSold = product.status === 'sold';
      if (!filters.showSold && isSold) return false;

      const selectedPrice = currency === 'EUR' ? product.priceEUR : product.priceMKD;
      if (filters.brand && product.brand !== filters.brand) return false;
      if (filters.category && product.category !== filters.category) return false;
      if (filters.filmDigital && product.filmDigital !== filters.filmDigital) return false;
      if (filters.filmType && product.filmType !== filters.filmType) return false;
      if (filters.mount && product.mount !== filters.mount) return false;
      if (filters.condition && product.condition !== filters.condition) return false;
      if (filters.minPrice && selectedPrice !== null && selectedPrice < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && selectedPrice !== null && selectedPrice > parseInt(filters.maxPrice)) return false;
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priceLowHigh':
          return (
            (currency === 'EUR' ? a.priceEUR : a.priceMKD) ?? Number.POSITIVE_INFINITY
          ) - (
            (currency === 'EUR' ? b.priceEUR : b.priceMKD) ?? Number.POSITIVE_INFINITY
          );
        case 'priceHighLow':
          return (
            (currency === 'EUR' ? b.priceEUR : b.priceMKD) ?? Number.NEGATIVE_INFINITY
          ) - (
            (currency === 'EUR' ? a.priceEUR : a.priceMKD) ?? Number.NEGATIVE_INFINITY
          );
        case 'oldest':
          return a.id - b.id;
        case 'newest':
        default:
          return b.id - a.id;
      }
    });

    return filtered;
  }, [allProducts, filters, sortBy, currency, language]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      if (key === 'showSold') {
        return { ...prev, showSold: value === 'true' };
      }
      if (key === 'category' && value !== 'film') {
        return { ...prev, category: value, filmType: '' };
      }
      return { ...prev, [key]: value };
    });
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      category: '',
      filmDigital: '',
      filmType: '',
      mount: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      showSold: false
    });
  };

  const FilterSidebar = () => (
    <div className="bg-card p-6 rounded-lg shadow-md border-border relative overflow-hidden">
      {/* Catalog Image */}

      <div className="relative z-10">
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          {getTranslation(language, 'catalog.clearFilters')}
        </button>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => handleFilterChange('showSold', filters.showSold ? '' : 'true')}
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
            filters.showSold
              ? 'bg-primary text-primary-foreground hover:bg-accent'
              : 'bg-card text-foreground border border-border hover:bg-muted'
          }`}
        >
          {language === 'en' ? 'Show sold' : 'Прикажи продадени'}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          {getTranslation(language, 'common.search')}
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          placeholder={getTranslation(language, 'common.search')}
        />
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          {getTranslation(language, 'catalog.filterBy.brand')}
        </label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          <option value="">{language === 'en' ? 'All Brands' : 'Сите Брендови'}</option>
          {uniqueBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          {getTranslation(language, 'catalog.filterBy.category')}
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          <option value="">{language === 'en' ? 'All Categories' : 'Сите Категории'}</option>
          <option value="camera">{getTranslation(language, 'catalog.categories.camera')}</option>
          <option value="lens">{getTranslation(language, 'catalog.categories.lens')}</option>
          <option value="accessory">{getTranslation(language, 'catalog.categories.accessory')}</option>
          <option value="film">{getTranslation(language, 'catalog.categories.film')}</option>
        </select>
      </div>

      {/* Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          {getTranslation(language, 'catalog.filterBy.type')}
        </label>
        <select
          value={filters.filmDigital}
          onChange={(e) => handleFilterChange('filmDigital', e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          <option value="">{language === 'en' ? 'All Types' : 'Сите Типови'}</option>
          <option value="film">{getTranslation(language, 'catalog.types.film')}</option>
          <option value="digital">{getTranslation(language, 'catalog.types.digital')}</option>
          <option value="both">{getTranslation(language, 'catalog.types.both')}</option>
        </select>
      </div>

      {/* Film Type Filter */}
      {filters.category === 'film' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            {getTranslation(language, 'catalog.filterBy.filmType')}
          </label>
          <select
            value={filters.filmType}
            onChange={(e) => handleFilterChange('filmType', e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="">{language === 'en' ? 'All Film Types' : 'Сите типови филм'}</option>
            <option value="35mm-color">{getTranslation(language, 'catalog.filmTypes.mm35Color')}</option>
            <option value="35mm-bw">{getTranslation(language, 'catalog.filmTypes.mm35BW')}</option>
            <option value="120-color">{getTranslation(language, 'catalog.filmTypes.mm120Color')}</option>
            <option value="120-bw">{getTranslation(language, 'catalog.filmTypes.mm120BW')}</option>
          </select>
        </div>
      )}

      {/* Mount Filter */}
      {filters.category === 'lens' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            {getTranslation(language, 'catalog.filterBy.mount')}
          </label>
          <select
            value={filters.mount}
            onChange={(e) => handleFilterChange('mount', e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="">{language === 'en' ? 'All Mounts' : 'Сите Монти'}</option>
            {uniqueMounts.map(mount => (
              <option key={mount} value={mount}>{mount}</option>
            ))}
          </select>
        </div>
      )}

      {/* Condition Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          {getTranslation(language, 'catalog.filterBy.condition')}
        </label>
        <select
          value={filters.condition}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          <option value="">{language === 'en' ? 'All Conditions' : 'Сите Состојби'}</option>
          <option value="like-new">{getTranslation(language, 'catalog.conditions.likeNew')}</option>
          <option value="excellent">{getTranslation(language, 'catalog.conditions.excellent')}</option>
          <option value="very-good">{getTranslation(language, 'catalog.conditions.veryGood')}</option>
          <option value="good">{getTranslation(language, 'catalog.conditions.good')}</option>
          <option value="low">{getTranslation(language, 'catalog.conditions.low')}</option>
          <option value="parts">{language === 'en' ? 'For Parts/Non Working' : 'За Делови/Расипани/Полуфункционални'}</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          {getTranslation(language, 'catalog.filterBy.priceRange')}
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-1/2 px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            placeholder={language === 'en' ? 'Min' : 'Мин'}
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-1/2 px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            placeholder={language === 'en' ? 'Max' : 'Макс'}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">
            {getTranslation(language, 'catalog.title')}
          </h1>
          
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-foreground">
              {getTranslation(language, 'catalog.sortBy')}:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="newest">{getTranslation(language, 'catalog.newest')}</option>
              <option value="oldest">{getTranslation(language, 'catalog.oldest')}</option>
              <option value="priceLowHigh">{getTranslation(language, 'catalog.priceLowHigh')}</option>
              <option value="priceHighLow">{getTranslation(language, 'catalog.priceHighLow')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-center space-x-2 bg-card px-4 py-3 border border-border rounded-lg shadow-sm hover:bg-muted transition-colors text-foreground"
            >
              <Filter className="h-5 w-5" />
              <span>{getTranslation(language, 'catalog.filters')}</span>
              <ChevronDown className={`h-4 w-4 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="fixed right-0 top-0 h-full w-80 bg-card shadow-lg overflow-y-auto border-l border-border">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{getTranslation(language, 'catalog.filters')}</h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-foreground" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading products...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {getTranslation(language, 'catalog.noProducts')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showConditionBadge={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
