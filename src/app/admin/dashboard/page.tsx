'use client';

import { useCallback, useEffect, useState } from 'react';
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
  };
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900';

const filmTypes = [
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

  const fetchProducts = useCallback(async () => {
    try {
      setError('');

      const response = await fetch(`${API_URL}/api/products`, {
        cache: 'no-store',
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
                        ? `€${product.priceEUR}`
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
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
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
                            : (Number(value) / 62).toFixed(2),
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
    </div>
  );
}