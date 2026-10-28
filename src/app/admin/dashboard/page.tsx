'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, LogOut, Search, Upload } from 'lucide-react';

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'
).replace(/\/+$/, '');

function getImageUrl(value: string): string {
  let url = value.trim();

  // Repair URLs previously saved with the API URL before an R2 URL.
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
  images: string[];
  filmDigital?: string;
  filmType?: string;
  film_digital?: string;
  film_type?: string;
  mount?: string;
  description?: {
    en: string;
    mk: string;
  };
  description_en?: string;
  description_mk?: string;
  specs?: Record<string, unknown>;

  // Sold and purchase fields
  selling_price_eur?: number | null;
  selling_price_mkd?: number | null;
  sold_date?: string | null;
  purchase_amount_eur?: number | null;
  purchase_amount_mkd?: number | null;
  purchased_by?: string | null;
  purchased_by_note?: string | null;
  general_note?: string | null;
  visible_in_catalog?: number;

  // Camera specifications
  megapixels?: string | null;
  batteryType?: string | null;
  memoryType?: string | null;
  maxMemoryCapacity?: string | null;
  internalMemory?: string | null;

  // Included accessories
  includedAccessories?: Array<{
    id: string;
    name_en: string;
    name_mk: string;
    detail: string;
  }>;
}

interface ProductForm {
  slug: string;
  name_en: string;
  name_mk: string;
  brand: string;
  category: string;
  status: 'available' | 'sold';
  film_digital: string;
  film_type: string;
  mount: string;
  condition: string;
  price_eur: string;
  price_mkd: string;
  description_en: string;
  description_mk: string;
  images: string[];
  // New sold fields
  selling_price_eur: string;
  selling_price_mkd: string;
  sold_date: string;
  purchase_amount_eur: string;
  purchase_amount_mkd: string;
  purchased_by: string;
  purchased_by_note: string;
  general_note: string;
  visible_in_catalog: boolean;
  // Camera specifications
  megapixels: string;
  battery_type: string;
  memory_type: string;
  max_memory_capacity: string;
  internal_memory: string;
  // Included accessories
  included_accessories: Array<{
    id: string;
    name_en: string;
    name_mk: string;
    detail: string;
  }>;
}

function createEmptyForm(): ProductForm {
  return {
    slug: '',
    name_en: '',
    name_mk: '',
    brand: '',
    category: 'camera',
    status: 'available',
    film_digital: '',
    film_type: '',
    mount: '',
    condition: 'good',
    price_eur: '',
    price_mkd: '',
    description_en: '',
    description_mk: '',
    images: [],
    selling_price_eur: '',
    selling_price_mkd: '',
    sold_date: '',
    purchase_amount_eur: '',
    purchase_amount_mkd: '',
    purchased_by: '',
    purchased_by_note: '',
    general_note: '',
    visible_in_catalog: true,
    megapixels: '',
    battery_type: '',
    memory_type: '',
    max_memory_capacity: '',
    internal_memory: '',
    included_accessories: []
  };
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900';

const filmTypes = [
  ['35mm', '35mm'],
  ['120', '120'],
  ['super-8', 'Super 8'],
  ['35mm-color', '35mm Color'],
  ['35mm-bw', '35mm Black & White'],
  ['120-color', '120 Color'],
  ['120-bw', '120 Black & White'],
  ['instant', 'Instant'],
  ['medium-format', 'Medium Format'],
  ['large-format', 'Large Format'],
  ['aps', 'APS'],
  ['110', '110'],
  ['disc', 'Disc'],
  ['polaroid-sx70', 'Polaroid SX-70'],
  ['polaroid-600', 'Polaroid 600'],
  ['polaroid-itype', 'Polaroid i-Type'],
  ['instax-mini', 'Instax Mini'],
  ['instax-square', 'Instax Square'],
  ['instax-wide', 'Instax Wide'],
  ['xiaomi-zink', 'Xiaomi ZINK Paper'],
];

const accessoryTypes = [
  { id: 'memory-card', name_en: 'Memory card', name_mk: 'Мемориска картичка' },
  { id: 'case', name_en: 'Case', name_mk: 'Футрола' },
  { id: 'flash', name_en: 'Flash', name_mk: 'Блиц' },
  { id: 'data-cable', name_en: 'Data transfer cable', name_mk: 'Кабел за пренос на податоци' },
  { id: 'charger', name_en: 'Charger', name_mk: 'Полнач' },
  { id: 'battery', name_en: 'Battery / batteries', name_mk: 'Батерија/и' },
  { id: 'strap', name_en: 'Strap', name_mk: 'Каиш' },
  { id: 'lens-strap', name_en: 'Lens strap', name_mk: 'Каиш за објектив' },
  { id: 'film', name_en: 'Film', name_mk: 'Филм' },
  { id: 'lens-cap', name_en: 'Lens cap', name_mk: 'Капаче за објектив' },
];

const mounts = [
  ['F', 'Nikon F'],
  ['EF', 'Canon EF'],
  ['EF-S', 'Canon EF-S'],
  ['E', 'Nikon Z'],
  ['RF', 'Canon RF'],
  ['M42', 'M42 Screw'],
  ['M', 'Leica M'],
  ['L', 'Sony E'],
  ['X', 'Fujifilm X'],
  ['K', 'Pentax K'],
  ['OM', 'Olympus OM'],
  ['PK', 'Pentax K'],
  ['C', 'Contax C/Y'],
  ['MD', 'Minolta MD'],
  ['A', 'Minolta/Sony A'],
  ['SA', 'Sigma SA'],
  ['4/3', 'Four Thirds'],
  ['m4/3', 'Micro Four Thirds'],
  ['G', 'Canon G'],
  ['NX', 'Samsung NX'],
  ['Q', 'Pentax Q'],
  ['T', 'Leica T'],
  ['SL', 'Leica SL'],
  ['S', 'Leica S'],
  ['TL', 'Leica TL'],
  ['CL', 'Leica CL'],
  ['CINE', 'Canon CINE'],
  ['PL', 'PL Mount'],
  ['MFT', 'MFT'],
  ['EF-M', 'Canon EF-M'],
  ['FT', 'Olympus FT'],
  ['PK-M42', 'Pentax K/M42'],
  ['T2', 'Contax T2'],
  ['other', 'Other'],
];

export default function AdminDashboard() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSold, setShowSold] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductForm>(createEmptyForm);
  const [activeTab, setActiveTab] = useState<'all' | 'sold'>('all');
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [expenseFormData, setExpenseFormData] = useState({
    category: '',
    description: '',
    amountMKD: '',
    date: new Date().toISOString().split('T')[0],
    paidBy: ''
  });
  const [soldFilters, setSoldFilters] = useState({
    dateFrom: '',
    dateTo: '',
    purchasedBy: '',
    expenseDateFrom: '',
    expenseDateTo: '',
    expensePaidBy: ''
  });

  const fetchFinancialSummary = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/financial-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load financial summary');
      }

      const data = await response.json();
      setFinancialSummary(data);
    } catch (err) {
      console.error('Failed to fetch financial summary:', err);
    }
  }, []);

  const addExpense = async (category: string, description: string, amountEUR: string, amountMKD: string, date: string, paidBy: string) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/api/admin/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category,
        description,
        amountEUR: amountEUR ? Number(amountEUR) : null,
        amountMKD: amountMKD ? Number(amountMKD) : null,
        date,
        paidBy,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Add expense error:', errorData);
      throw new Error(errorData.error || 'Failed to add expense');
    }

    await fetchFinancialSummary();
    setShowExpenseModal(false);
    setExpenseFormData({
      category: '',
      description: '',
      amountMKD: '',
      date: new Date().toISOString().split('T')[0],
      paidBy: ''
    });
  };

  const updateExpense = async (expenseId: number, category: string, description: string, amountEUR: string, amountMKD: string, date: string, paidBy: string) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/api/admin/expenses/${expenseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category,
        description,
        amountEUR: amountEUR ? Number(amountEUR) : null,
        amountMKD: amountMKD ? Number(amountMKD) : null,
        date,
        paidBy,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update expense');
    }

    await fetchFinancialSummary();
    setShowExpenseModal(false);
    setEditingExpense(null);
    setExpenseFormData({
      category: '',
      description: '',
      amountMKD: '',
      date: new Date().toISOString().split('T')[0],
      paidBy: ''
    });
  };

  const deleteExpense = async (expenseId: number) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/api/admin/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }

    await fetchFinancialSummary();
  };

  const openAddExpenseModal = () => {
    setEditingExpense(null);
    setExpenseFormData({
      category: '',
      description: '',
      amountMKD: '',
      date: new Date().toISOString().split('T')[0],
      paidBy: ''
    });
    setShowExpenseModal(true);
  };

  const openEditExpenseModal = (expense: any) => {
    setEditingExpense(expense);
    setExpenseFormData({
      category: expense.category,
      description: expense.description || '',
      amountMKD: expense.amountMKD?.toString() || '',
      date: expense.date,
      paidBy: expense.paidBy
    });
    setShowExpenseModal(true);
  };

  const handleExpenseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amountEUR = expenseFormData.amountMKD ? (Number(expenseFormData.amountMKD) / 62).toFixed(2) : '';

    try {
      if (editingExpense) {
        await updateExpense(
          editingExpense.id,
          expenseFormData.category,
          expenseFormData.description,
          amountEUR,
          expenseFormData.amountMKD,
          expenseFormData.date,
          expenseFormData.paidBy
        );
      } else {
        await addExpense(
          expenseFormData.category,
          expenseFormData.description,
          amountEUR,
          expenseFormData.amountMKD,
          expenseFormData.date,
          expenseFormData.paidBy
        );
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
      alert('Error saving expense. Please check if it was saved after refresh.');
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setError('');

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/products`, {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load products');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid products response');
      }

      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load products'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    void fetchProducts();
  }, [router, fetchProducts]);

  useEffect(() => {
    if (activeTab === 'sold') {
      void fetchFinancialSummary();
    }
  }, [activeTab, fetchFinancialSummary]);

  function resetForm() {
    setEditingProduct(null);
    setFormData(createEmptyForm());
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.replace('/admin/login');
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Image upload failed'
        );
      }

      if (typeof data.url !== 'string' || !data.url.trim()) {
        throw new Error('The upload response did not contain an image URL');
      }

      // R2 returns a complete URL. Do not prepend API_URL.
      const imageUrl = getImageUrl(data.url);

      setFormData((previous) => ({
        ...previous,
        images: [...previous.images, imageUrl],
      }));
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Image upload failed'
      );
    } finally {
      setUploadingImage(false);
      input.value = '';
    }
  }

  function handleRemoveImage(index: number) {
    setFormData((previous) => ({
      ...previous,
      images: previous.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (uploadingImage || saving) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: {
          en: formData.name_en,
          mk: formData.name_mk,
        },
        brand: formData.brand,
        category: formData.category,
        status: formData.status,
        filmDigital: formData.film_digital,
        filmType: formData.film_type,
        mount: formData.mount,
        condition: formData.condition,
        priceEUR:
          formData.price_eur === '' ? null : Number(formData.price_eur),
        priceMKD:
          formData.price_mkd === '' ? null : Number(formData.price_mkd),
        description: {
          en: formData.description_en,
          mk: formData.description_mk,
        },
        specs: editingProduct?.specs || {},
        images: formData.images.map(getImageUrl),
        // Sold fields
        sellingPriceEUR: formData.selling_price_eur === '' ? null : Number(formData.selling_price_eur),
        sellingPriceMKD: formData.selling_price_mkd === '' ? null : Number(formData.selling_price_mkd),
        soldDate: formData.sold_date || null,
        purchaseAmountEUR: formData.purchase_amount_eur === '' ? null : Number(formData.purchase_amount_eur),
        purchaseAmountMKD: formData.purchase_amount_mkd === '' ? null : Number(formData.purchase_amount_mkd),
        purchasedBy: formData.purchased_by || null,
        purchasedByNote: formData.purchased_by_note || null,
        generalNote: formData.general_note || null,
        visibleInCatalog: formData.visible_in_catalog,
        // Camera specifications
        megapixels: formData.megapixels || null,
        batteryType: formData.battery_type || null,
        memoryType: formData.memory_type || null,
        maxMemoryCapacity: formData.max_memory_capacity || null,
        internalMemory: formData.internal_memory || null,
        // Included accessories
        includedAccessories: formData.included_accessories
      };

      const url = editingProduct
        ? `${API_URL}/api/products/${editingProduct.id}`
        : `${API_URL}/api/products`;

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error || data.message || 'Failed to save product'
        );
      }

      closeModal();
      await fetchProducts();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Failed to save product'
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);

    setFormData({
      slug: product.slug,
      name_en: product.name?.en || '',
      name_mk: product.name?.mk || '',
      brand: product.brand || '',
      category: product.category || 'camera',
      status: product.status || 'available',
      film_digital: product.filmDigital ?? product.film_digital ?? '',
      film_type: product.filmType ?? product.film_type ?? '',
      mount: product.mount || '',
      condition: product.condition || 'good',
      price_eur:
        product.priceEUR == null ? '' : String(product.priceEUR),
      price_mkd:
        product.priceMKD == null ? '' : String(product.priceMKD),
      description_en:
        product.description?.en ?? product.description_en ?? '',
      description_mk:
        product.description?.mk ?? product.description_mk ?? '',
      images: (product.images || []).map(getImageUrl),
      selling_price_eur: product.selling_price_eur == null ? '' : String(product.selling_price_eur),
      selling_price_mkd: product.selling_price_mkd == null ? '' : String(product.selling_price_mkd),
      sold_date: product.sold_date || '',
      purchase_amount_eur: product.purchase_amount_eur == null ? '' : String(product.purchase_amount_eur),
      purchase_amount_mkd: product.purchase_amount_mkd == null ? '' : String(product.purchase_amount_mkd),
      purchased_by: product.purchased_by || '',
      purchased_by_note: product.purchased_by_note || '',
      general_note: product.general_note || '',
      visible_in_catalog: product.visible_in_catalog === 1,
      megapixels: product.megapixels || '',
      battery_type: product.batteryType || '',
      memory_type: product.memoryType || '',
      max_memory_capacity: product.maxMemoryCapacity || '',
      internal_memory: product.internalMemory || '',
      included_accessories: product.includedAccessories || []
    });

    setShowModal(true);
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error || data.message || 'Failed to delete product'
        );
      }

      await fetchProducts();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Failed to delete product'
      );
    }
  }

  const search = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name?.en || '').toLowerCase().includes(search) ||
      (product.name?.mk || '').toLowerCase().includes(search) ||
      (product.brand || '').toLowerCase().includes(search) ||
      String(product.slug || '').toLowerCase().includes(search);

    return matchesSearch && (showSold || product.status !== 'sold');
  }).filter((product) => {
    // Filter out products with no name or brand (empty/incomplete products)
    return product.name?.en && product.brand;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Switcher */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'sold'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sold Products
          </button>
        </div>

        {/* Sold Tab */}
        {activeTab === 'sold' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4 text-black">Филтри</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Product Filters */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Продажби</h4>
                  <label className="block text-xs text-gray-600">Датум од</label>
                  <input
                    type="date"
                    value={soldFilters.dateFrom}
                    onChange={(e) => setSoldFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <label className="block text-xs text-gray-600">Датум до</label>
                  <input
                    type="date"
                    value={soldFilters.dateTo}
                    onChange={(e) => setSoldFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <label className="block text-xs text-gray-600">Купено од</label>
                  <select
                    value={soldFilters.purchasedBy}
                    onChange={(e) => setSoldFilters(prev => ({ ...prev, purchasedBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Сите</option>
                    <option value="Matej">Matej</option>
                    <option value="Gogo">Gogo</option>
                    <option value="Drugo">Drugo</option>
                  </select>
                </div>

                {/* Expense Filters */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Трошоци</h4>
                  <label className="block text-xs text-gray-600">Датум од</label>
                  <input
                    type="date"
                    value={soldFilters.expenseDateFrom}
                    onChange={(e) => setSoldFilters(prev => ({ ...prev, expenseDateFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <label className="block text-xs text-gray-600">Датум до</label>
                  <input
                    type="date"
                    value={soldFilters.expenseDateTo}
                    onChange={(e) => setSoldFilters(prev => ({ ...prev, expenseDateTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <label className="block text-xs text-gray-600">Платено од</label>
                  <select
                    value={soldFilters.expensePaidBy}
                    onChange={(e) => setSoldFilters(prev => ({ ...prev, expensePaidBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Сите</option>
                    <option value="Matej">Matej</option>
                    <option value="Gogo">Gogo</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => setSoldFilters({
                      dateFrom: '',
                      dateTo: '',
                      purchasedBy: '',
                      expenseDateFrom: '',
                      expenseDateTo: '',
                      expensePaidBy: ''
                    })}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Исчисти Филтри
                  </button>
                </div>
              </div>
            </div>

            {financialSummary ? (
              <>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4 text-black">Финансиски Преглед (Филтрирано)</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Вкупна Цена</p>
                      <p className="text-lg font-bold text-black">{financialSummary.summary.totalPurchaseCostMKD.toFixed(0)} ден</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Вкупно Приход</p>
                      <p className="text-lg font-bold text-black">{financialSummary.summary.totalSalesRevenueMKD.toFixed(0)} ден</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Вкупно Профит</p>
                      <p className="text-lg font-bold text-black">{financialSummary.summary.totalProfitMKD.toFixed(0)} ден</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Матеј Вкупно</p>
                      <p className="text-lg font-bold text-black">{financialSummary.summary.matejTotalMKD.toFixed(0)} ден</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Гого Вкупно</p>
                      <p className="text-lg font-bold text-black">{financialSummary.summary.gogoTotalMKD.toFixed(0)} ден</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100 text-gray-600">
                        <tr>
                          <th className="px-4 py-3 text-black">Производ</th>
                          <th className="px-4 py-3 text-black">Продажна Цена</th>
                          <th className="px-4 py-3 text-black">Купена Цена</th>
                          <th className="px-4 py-3 text-black">Купено Од</th>
                          <th className="px-4 py-3 text-black">Профит</th>
                          <th className="px-4 py-3 text-black">Матеј</th>
                          <th className="px-4 py-3 text-black">Гого</th>
                          <th className="px-4 py-3 text-black">Датум на Продажба</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {financialSummary.products
                          .filter((product: any) => {
                            if (soldFilters.purchasedBy && product.purchasedBy !== soldFilters.purchasedBy) return false;
                            if (soldFilters.dateFrom && product.soldDate && product.soldDate < soldFilters.dateFrom) return false;
                            if (soldFilters.dateTo && product.soldDate && product.soldDate > soldFilters.dateTo) return false;
                            return true;
                          })
                          .map((product: any) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-black">{product.name}</td>
                            <td className="px-4 py-3 text-black">{product.sellingPriceMKD?.toFixed(0) || '-'} ден</td>
                            <td className="px-4 py-3 text-black">{product.purchaseAmountMKD?.toFixed(0) || '-'} ден</td>
                            <td className="px-4 py-3 text-black">{product.purchasedBy || '-'}</td>
                            <td className="px-4 py-3 text-green-600 font-medium text-black">{product.profitMKD?.toFixed(0) || '-'} ден</td>
                            <td className="px-4 py-3 text-black">{product.matejMKD?.toFixed(0) || '-'} ден</td>
                            <td className="px-4 py-3 text-black">{product.gogoMKD?.toFixed(0) || '-'} ден</td>
                            <td className="px-4 py-3 text-sm text-black">{product.soldDate ? new Date(product.soldDate).toLocaleDateString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* General Expenses Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-black">Општи Трошоци</h3>
                    <button
                      onClick={openAddExpenseModal}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      + Додај Трошок
                    </button>
                  </div>

                  {financialSummary.expenses && financialSummary.expenses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600">
                          <tr>
                            <th className="px-4 py-3 text-black">Категорија</th>
                            <th className="px-4 py-3 text-black">Опис</th>
                            <th className="px-4 py-3 text-black">Сума</th>
                            <th className="px-4 py-3 text-black">Датум</th>
                            <th className="px-4 py-3 text-black">Платено од</th>
                            <th className="px-4 py-3 text-black">Акции</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {financialSummary.expenses
                            .filter((expense: any) => {
                              if (soldFilters.expensePaidBy && expense.paidBy !== soldFilters.expensePaidBy) return false;
                              if (soldFilters.expenseDateFrom && expense.date < soldFilters.expenseDateFrom) return false;
                              if (soldFilters.expenseDateTo && expense.date > soldFilters.expenseDateTo) return false;
                              return true;
                            })
                            .map((expense: any) => (
                            <tr key={expense.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-black">{expense.category}</td>
                              <td className="px-4 py-3 text-black">{expense.description || '-'}</td>
                              <td className="px-4 py-3 text-black">{expense.amountMKD?.toFixed(0) || '-'} ден</td>
                              <td className="px-4 py-3 text-black">{new Date(expense.date).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-black">{expense.paidBy}</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => openEditExpenseModal(expense)}
                                  className="text-blue-600 hover:text-blue-800 text-sm mr-2"
                                >
                                  Уреди
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Да избришете овој трошок?')) {
                                      deleteExpense(expense.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Избриши
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Нема трошоци</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">Вчитување на финансиски податоци...</div>
            )}
          </div>
        )}

        {/* All Products Tab */}
        {activeTab === 'all' && (
          <>
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
                <button
                  onClick={() => void fetchProducts()}
                  className="ml-3 underline"
                >
                  Retry
                </button>
              </div>
            )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-gray-500">Total Products</p>
          <p className="text-3xl font-bold text-gray-900">
            {products.length}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={showSold}
              onChange={(e) => setShowSold(e.target.checked)}
              className="h-4 w-4"
            />
            Show sold products
          </label>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Brand</th>
                  <th className="px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {product.images?.[0] && (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name.en}
                            className="h-10 w-10 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name.en}
                          </p>
                          <p className="text-sm text-gray-500 hidden sm:block">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                      {product.brand}
                    </td>

                    <td className="px-4 py-3 text-gray-600 capitalize hidden md:table-cell">
                      {product.category}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.status === 'sold'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.status === 'sold' ? 'SOLD' : 'AVAILABLE'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-900">
                      {product.priceEUR != null
                        ? `€${Math.round(product.priceEUR)}`
                        : '—'}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          aria-label={`Edit ${product.name.en}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => void handleDelete(product.id)}
                          aria-label={`Delete ${product.name.en}`}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      {products.length === 0
                        ? 'No products yet. Add your first product.'
                        : 'No products match your search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
          >
            <h2
              id="product-modal-title"
              className="text-2xl font-bold text-gray-900 mb-6"
            >
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Slug (automatically generated)
                  <input
                    value={formData.slug}
                    disabled
                    placeholder="Generated when you create the product"
                    className={`${inputClass} mt-1 disabled:bg-gray-100`}
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Brand
                  <input
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        brand: e.target.value,
                      }))
                    }
                    required
                    className={`${inputClass} mt-1`}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name (English)
                  <input
                    value={formData.name_en}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        name_en: e.target.value,
                      }))
                    }
                    required
                    className={`${inputClass} mt-1`}
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Name (Macedonian)
                  <input
                    value={formData.name_mk}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        name_mk: e.target.value,
                      }))
                    }
                    required
                    className={`${inputClass} mt-1`}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        category: e.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  >
                    <option value="camera">Camera</option>
                    <option value="lens">Lens</option>
                    <option value="film">Film</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Status
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        status: e.target.value as ProductForm['status'],
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Condition
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        condition: e.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  >
                    <option value="like-new">Like New</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="low">Low</option>
                    <option value="parts">For Parts/Non Working</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Film / Digital
                  <select
                    value={formData.film_digital}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        film_digital: e.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">Select type</option>
                    <option value="film">Film</option>
                    <option value="digital">Digital</option>
                    <option value="analog">Analog</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Film Type
                  <select
                    value={formData.film_type}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        film_type: e.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">Select film type</option>
                    {filmTypes.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Mount
                  <select
                    value={formData.mount}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        mount: e.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">Select mount</option>
                    {mounts.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price (EUR)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_eur}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((previous) => ({
                        ...previous,
                        price_eur: value,
                        price_mkd:
                          value === ''
                            ? ''
                            : (Number(value) * 62).toFixed(0),
                      }));
                    }}
                    className={`${inputClass} mt-1`}
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Price (MKD)
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price_mkd}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((previous) => ({
                        ...previous,
                        price_mkd: value,
                        price_eur:
                          value === ''
                            ? ''
                            : Math.round(Number(value) / 62).toString(),
                      }));
                    }}
                    className={`${inputClass} mt-1`}
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Description (English)
                <textarea
                  rows={3}
                  value={formData.description_en}
                  onChange={(e) =>
                    setFormData((previous) => ({
                      ...previous,
                      description_en: e.target.value,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Description (Macedonian)
                <textarea
                  rows={3}
                  value={formData.description_mk}
                  onChange={(e) =>
                    setFormData((previous) => ({
                      ...previous,
                      description_mk: e.target.value,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Images
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    disabled={uploadingImage || saving}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center gap-2 text-gray-600 ${
                      uploadingImage || saving
                        ? 'cursor-wait opacity-50'
                        : 'cursor-pointer'
                    }`}
                  >
                    <Upload className="h-8 w-8" />
                    <span>
                      {uploadingImage
                        ? 'Uploading image...'
                        : 'Click to upload an image'}
                    </span>
                    <span className="text-xs text-gray-500">
                      JPEG, PNG, WebP or GIF. Maximum 10 MB.
                    </span>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={`${image}-${index}`} className="relative">
                        <img
                          src={getImageUrl(image)}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          disabled={saving}
                          aria-label={`Remove image ${index + 1}`}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Camera Specifications Section */}
              {formData.category === 'camera' && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold mb-4">Camera Specifications</h3>

                  {formData.film_digital === 'digital' && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Megapixels
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.megapixels}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              megapixels: e.target.value,
                            }))
                          }
                          className={`${inputClass} mt-1`}
                          placeholder="e.g. 12.1"
                        />
                      </label>

                      <label className="block text-sm font-medium text-gray-700">
                        Battery Type
                        <input
                          type="text"
                          list="battery-suggestions-digital"
                          value={formData.battery_type}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              battery_type: e.target.value,
                            }))
                          }
                          className={`${inputClass} mt-1`}
                          placeholder="e.g. AA, AAA, proprietary rechargeable"
                        />
                        <datalist id="battery-suggestions-digital">
                          <option value="AA" />
                          <option value="AAA" />
                          <option value="proprietary rechargeable battery" />
                          <option value="built-in rechargeable battery" />
                        </datalist>
                      </label>

                      <label className="block text-sm font-medium text-gray-700">
                        Memory/Storage Type
                        <input
                          type="text"
                          list="memory-suggestions"
                          value={formData.memory_type}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              memory_type: e.target.value,
                            }))
                          }
                          className={`${inputClass} mt-1`}
                          placeholder="e.g. SD, SDHC, SDXC, microSD"
                        />
                        <datalist id="memory-suggestions">
                          <option value="SD" />
                          <option value="SDHC" />
                          <option value="SDXC" />
                          <option value="microSD" />
                          <option value="CompactFlash" />
                          <option value="Memory Stick" />
                          <option value="xD" />
                          <option value="internal memory" />
                        </datalist>
                      </label>

                      <label className="block text-sm font-medium text-gray-700">
                        Maximum Memory Card Capacity (optional)
                        <input
                          type="text"
                          value={formData.max_memory_capacity}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              max_memory_capacity: e.target.value,
                            }))
                          }
                          className={`${inputClass} mt-1`}
                          placeholder="e.g. 16 GB"
                        />
                      </label>

                      <label className="block text-sm font-medium text-gray-700">
                        Internal Memory Capacity (optional)
                        <input
                          type="text"
                          value={formData.internal_memory}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              internal_memory: e.target.value,
                            }))
                          }
                          className={`${inputClass} mt-1`}
                          placeholder="e.g. 8 MB"
                        />
                      </label>
                    </div>
                  )}

                  {formData.film_digital === 'film' && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Film Type/Format
                        <select
                          value={formData.film_type}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              film_type: e.target.value,
                            }))
                          }
                          className={`${inputClass} mt-1`}
                        >
                          <option value="">Select film type</option>
                          {filmTypes.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block text-sm font-medium text-gray-700">
                        Battery Type (optional)
                        <input
                          type="text"
                          list="battery-suggestions-analog"
                          value={formData.battery_type}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              battery_type: e.target.value,
                            }))
                          }
                          className={`${inputClass} mt-1`}
                          placeholder="e.g. AA, AAA, CR123A, No battery required"
                        />
                        <datalist id="battery-suggestions-analog">
                          <option value="AA" />
                          <option value="AAA" />
                          <option value="CR123A" />
                          <option value="CR2" />
                          <option value="LR44" />
                          <option value="No battery required" />
                        </datalist>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Included Accessories Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Included Accessories</h3>

                <div className="space-y-3">
                  {accessoryTypes.map((accessory) => {
                    const isSelected = formData.included_accessories.some(
                      (a) => a.id === accessory.id
                    );
                    const selectedAccessory = formData.included_accessories.find(
                      (a) => a.id === accessory.id
                    );

                    return (
                      <div key={accessory.id} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={`accessory-${accessory.id}`}
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((previous) => ({
                                ...previous,
                                included_accessories: [
                                  ...previous.included_accessories,
                                  {
                                    id: accessory.id,
                                    name_en: accessory.name_en,
                                    name_mk: accessory.name_mk,
                                    detail: '',
                                  },
                                ],
                              }));
                            } else {
                              setFormData((previous) => ({
                                ...previous,
                                included_accessories: previous.included_accessories.filter(
                                  (a) => a.id !== accessory.id
                                ),
                              }));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`accessory-${accessory.id}`}
                            className="text-sm font-medium text-gray-700"
                          >
                            {accessory.name_en}
                          </label>
                          {isSelected && (
                            <input
                              type="text"
                              value={selectedAccessory?.detail || ''}
                              onChange={(e) => {
                                setFormData((previous) => ({
                                  ...previous,
                                  included_accessories: previous.included_accessories.map((a) =>
                                    a.id === accessory.id
                                      ? { ...a, detail: e.target.value }
                                      : a
                                  ),
                                }));
                              }}
                              className={`${inputClass} mt-1 text-sm`}
                              placeholder="Optional detail (e.g. 16 GB SD)"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Custom Accessories */}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Custom Accessories</p>
                    {formData.included_accessories
                      .filter((a) => a.id === 'custom')
                      .map((customAccessory, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={customAccessory.name_en}
                            onChange={(e) => {
                              setFormData((previous) => ({
                                ...previous,
                                included_accessories: previous.included_accessories.map((a, i) =>
                                  a.id === 'custom' && i === index
                                    ? { ...a, name_en: e.target.value }
                                    : a
                                ),
                              }));
                            }}
                            className={`${inputClass} flex-1`}
                            placeholder="Name (EN)"
                          />
                          <input
                            type="text"
                            value={customAccessory.name_mk}
                            onChange={(e) => {
                              setFormData((previous) => ({
                                ...previous,
                                included_accessories: previous.included_accessories.map((a, i) =>
                                  a.id === 'custom' && i === index
                                    ? { ...a, name_mk: e.target.value }
                                    : a
                                ),
                              }));
                            }}
                            className={`${inputClass} flex-1`}
                            placeholder="Name (MK)"
                          />
                          <input
                            type="text"
                            value={customAccessory.detail}
                            onChange={(e) => {
                              setFormData((previous) => ({
                                ...previous,
                                included_accessories: previous.included_accessories.map((a, i) =>
                                  a.id === 'custom' && i === index
                                    ? { ...a, detail: e.target.value }
                                    : a
                                ),
                              }));
                            }}
                            className={`${inputClass} flex-1`}
                            placeholder="Detail"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((previous) => ({
                                ...previous,
                                included_accessories: previous.included_accessories.filter(
                                  (a, i) => !(a.id === 'custom' && i === index)
                                ),
                              }));
                            }}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((previous) => ({
                          ...previous,
                          included_accessories: [
                            ...previous.included_accessories,
                            {
                              id: 'custom',
                              name_en: '',
                              name_mk: '',
                              detail: '',
                            },
                          ],
                        }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add custom accessory
                    </button>
                  </div>
                </div>
              </div>

              {/* Sold/Purchase Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4">Sold & Purchase Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Visible in Catalog
                    <select
                      value={formData.visible_in_catalog ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          visible_in_catalog: e.target.value === 'true',
                        }))
                      }
                      className={`${inputClass} mt-1`}
                    >
                      <option value="true">Show in catalog</option>
                      <option value="false">Stay hidden</option>
                    </select>
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Purchased By
                    <select
                      value={formData.purchased_by}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'Drugo') {
                          const note = prompt('Забелешка (Note):');
                          setFormData((previous) => ({
                            ...previous,
                            purchased_by: value,
                            purchased_by_note: note || '',
                          }));
                        } else {
                          setFormData((previous) => ({
                            ...previous,
                            purchased_by: value,
                            purchased_by_note: '',
                          }));
                        }
                      }}
                      className={`${inputClass} mt-1`}
                    >
                      <option value="">Select...</option>
                      <option value="Matej">Matej</option>
                      <option value="Gogo">Gogo</option>
                      <option value="Drugo">Drugo</option>
                    </select>
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Purchase Amount (EUR)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.purchase_amount_eur}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          purchase_amount_eur: e.target.value,
                          purchase_amount_mkd:
                            e.target.value === ''
                              ? ''
                              : Math.round(Number(e.target.value) * 62).toString(),
                        }))
                      }
                      className={`${inputClass} mt-1`}
                    />
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Purchase Amount (MKD)
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.purchase_amount_mkd}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          purchase_amount_mkd: e.target.value,
                          purchase_amount_eur:
                            e.target.value === ''
                              ? ''
                              : Math.round(Number(e.target.value) / 62).toString(),
                        }))
                      }
                      className={`${inputClass} mt-1`}
                    />
                  </label>

                  {formData.status === 'sold' && (
                    <>
                      <label className="block text-sm font-medium text-gray-700">
                        Selling Price (EUR)
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.selling_price_eur}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              selling_price_eur: e.target.value,
                              selling_price_mkd:
                                e.target.value === ''
                                  ? ''
                                  : Math.round(Number(e.target.value) * 62).toString(),
                            }))
                          }
                          className={`${inputClass} mt-1`}
                          required
                        />
                      </label>

                      <label className="block text-sm font-medium text-gray-700">
                        Selling Price (MKD)
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formData.selling_price_mkd}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              selling_price_mkd: e.target.value,
                              selling_price_eur:
                                e.target.value === ''
                                  ? ''
                                  : Math.round(Number(e.target.value) / 62).toString(),
                            }))
                          }
                          className={`${inputClass} mt-1`}
                        />
                      </label>

                      <label className="block text-sm font-medium text-gray-700 md:col-span-2">
                        Sold Date
                        <input
                          type="date"
                          value={formData.sold_date}
                          onChange={(e) =>
                            setFormData((previous) => ({
                              ...previous,
                              sold_date: e.target.value,
                            }))
                          }
                          className={`${inputClass} mt-1`}
                        />
                      </label>
                    </>
                  )}

                  <label className="block text-sm font-medium text-gray-700 md:col-span-2">
                    General Note / Забелешка
                    <textarea
                      rows={2}
                      value={formData.general_note}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          general_note: e.target.value,
                        }))
                      }
                      className={`${inputClass} mt-1`}
                      placeholder="Additional notes about this product..."
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving || uploadingImage}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? 'Saving...'
                    : editingProduct
                      ? 'Update Product'
                      : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-modal-title"
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
          >
            <h2
              id="expense-modal-title"
              className="text-2xl font-bold mb-6"
            >
              {editingExpense ? 'Уреди Трошок' : 'Додај Трошок'}
            </h2>

            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Категорија
                <input
                  type="text"
                  value={expenseFormData.category}
                  onChange={(e) =>
                    setExpenseFormData((previous) => ({
                      ...previous,
                      category: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Опис
                <textarea
                  rows={2}
                  value={expenseFormData.description}
                  onChange={(e) =>
                    setExpenseFormData((previous) => ({
                      ...previous,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Сума во MKD
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={expenseFormData.amountMKD}
                  onChange={(e) =>
                    setExpenseFormData((previous) => ({
                      ...previous,
                      amountMKD: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Датум
                <input
                  type="date"
                  value={expenseFormData.date}
                  onChange={(e) =>
                    setExpenseFormData((previous) => ({
                      ...previous,
                      date: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Платено од
                <select
                  value={expenseFormData.paidBy}
                  onChange={(e) =>
                    setExpenseFormData((previous) => ({
                      ...previous,
                      paidBy: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="Matej">Matej</option>
                  <option value="Gogo">Gogo</option>
                </select>
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseModal(false);
                    setEditingExpense(null);
                    setExpenseFormData({
                      category: '',
                      description: '',
                      amountMKD: '',
                      date: new Date().toISOString().split('T')[0],
                      paidBy: ''
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Откажи
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  {editingExpense ? 'Ажурирај' : 'Додај'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}