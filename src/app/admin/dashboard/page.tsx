'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Search,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

interface Product {
  id: number;
  slug: string;
  name: { en: string; mk: string };
  brand: string;
  category: string;
  status: string;
  condition: string;
  priceEUR: number | null;
  priceMKD: number | null;
  images: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSold, setShowSold] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
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
    images: [] as string[]
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      const response = await fetch(`${apiUrl}/api/products`);
      const data = await response.json();
      console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        // Combine API URL with the relative path
        const fullUrl = `${apiUrl}${data.url}`;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, fullUrl]
        }));
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
    const url = editingProduct
      ? `${apiUrl}/api/products/${editingProduct.id}`
      : `${apiUrl}/api/products`;

    const payload = {
      name: { en: formData.name_en, mk: formData.name_mk },
      brand: formData.brand,
      category: formData.category,
      status: formData.status,
      filmDigital: formData.film_digital,
      filmType: formData.film_type,
      mount: formData.mount,
      condition: formData.condition,
      priceEUR: formData.price_eur ? parseFloat(formData.price_eur) : null,
      priceMKD: formData.price_mkd ? parseFloat(formData.price_mkd) : null,
      description: { en: formData.description_en, mk: formData.description_mk },
      specs: {},
      images: formData.images
    };

    try {
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      slug: product.slug,
      name_en: product.name.en,
      name_mk: product.name.mk,
      brand: product.brand,
      category: product.category,
      status: product.status,
      film_digital: (product as any).film_digital || '',
      film_type: (product as any).film_type || '',
      mount: (product as any).mount || '',
      condition: product.condition,
      price_eur: product.priceEUR?.toString() || '',
      price_mkd: product.priceMKD?.toString() || '',
      description_en: (product as any).description_en || '',
      description_mk: (product as any).description_mk || '',
      images: product.images || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
    try {
      const response = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
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
      images: []
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSold = showSold || p.status !== 'sold';

    return matchesSearch && matchesSold;
  });

  console.log('Products:', products.length, 'Filtered:', filteredProducts.length, 'Show sold:', showSold);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
=        <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
          <p style={{ color: 'black' }}><strong>Total Products:</strong> {products.length}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900 placeholder-gray-500 w-full"
              />
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSold}
                onChange={(e) => setShowSold(e.target.checked)}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">Show sold</span>
            </label>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingProduct(null);
              setShowModal(true);
            }}
            className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-900 font-bold">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-900 font-bold">No products found. Click "Add Product" to create one.</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-900 font-bold">No products match your search criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider hidden sm:table-cell">
                    Brand
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.name.en}
                          className="h-10 w-10 rounded object-cover mr-3 flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.name.en}
                        </div>
                        <div className="text-xs text-gray-500 truncate hidden sm:block">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {product.brand}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {product.category}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.priceEUR ? `€${product.priceEUR}` : '-'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug (auto-generated)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-100 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name (English)
                    </label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name (Macedonian)
                    </label>
                    <input
                      type="text"
                      value={formData.name_mk}
                      onChange={(e) => setFormData({ ...formData, name_mk: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    >
                      <option value="camera">Camera</option>
                      <option value="lens">Lens</option>
                      <option value="film">Film</option>
                      <option value="accessory">Accessory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    >
                      <option value="like-new">Like New</option>
                      <option value="very-good">Very Good</option>
                      <option value="good">Good</option>
                      <option value="excellent">Excellent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Film/Digital
                    </label>
                    <select
                      value={formData.film_digital}
                      onChange={(e) => setFormData({ ...formData, film_digital: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    >
                      <option value="">Select...</option>
                      <option value="film">Film</option>
                      <option value="digital">Digital</option>
                      <option value="analog">Analog</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Film Type
                    </label>
                    <select
                      value={formData.film_type}
                      onChange={(e) => setFormData({ ...formData, film_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    >
                      <option value="">Select...</option>
                      <option value="35mm-color">35mm Color</option>
                      <option value="35mm-bw">35mm B&W</option>
                      <option value="120-color">120 Color</option>
                      <option value="120-bw">120 B&W</option>
                      <option value="instant">Instant</option>
                      <option value="medium-format">Medium Format</option>
                      <option value="large-format">Large Format</option>
                      <option value="aps">APS</option>
                      <option value="110">110</option>
                      <option value="disc">Disc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mount
                    </label>
                    <select
                      value={formData.mount}
                      onChange={(e) => setFormData({ ...formData, mount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    >
                      <option value="">Select...</option>
                      <option value="F">Nikon F</option>
                      <option value="EF">Canon EF</option>
                      <option value="EF-S">Canon EF-S</option>
                      <option value="E">Nikon Z</option>
                      <option value="RF">Canon RF</option>
                      <option value="M42">M42 Screw</option>
                      <option value="M">Leica M</option>
                      <option value="L">Sony E</option>
                      <option value="X">Fujifilm X</option>
                      <option value="K">Pentax K</option>
                      <option value="OM">Olympus OM</option>
                      <option value="PK">Pentax K</option>
                      <option value="C">Contax C/Y</option>
                      <option value="MD">Minolta MD</option>
                      <option value="A">Minolta/Sony A</option>
                      <option value="SA">Sigma SA</option>
                      <option value="4/3">Four Thirds</option>
                      <option value="m4/3">Micro Four Thirds</option>
                      <option value="G">Canon G</option>
                      <option value="NX">Samsung NX</option>
                      <option value="Q">Pentax Q</option>
                      <option value="T">Leica T</option>
                      <option value="SL">Leica SL</option>
                      <option value="S">Leica S</option>
                      <option value="TL">Leica TL</option>
                      <option value="CL">Leica CL</option>
                      <option value="CINE">Canon CINE</option>
                      <option value="PL">PL Mount</option>
                      <option value="MFT">MFT</option>
                      <option value="EF-M">Canon EF-M</option>
                      <option value="FT">Olympus FT</option>
                      <option value="PK-M42">Pentax K/M42</option>
                      <option value="T2">Contax T2</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (EUR)
                    </label>
                    <input
                      type="number"
                      value={formData.price_eur}
                      onChange={(e) => {
                        const eur = e.target.value;
                        const mkd = eur ? (parseFloat(eur) * 62).toFixed(0) : '';
                        setFormData({ ...formData, price_eur: eur, price_mkd: mkd });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (MKD)
                    </label>
                    <input
                      type="number"
                      value={formData.price_mkd}
                      onChange={(e) => {
                        const mkd = e.target.value;
                        const eur = mkd ? (parseFloat(mkd) / 62).toFixed(2) : '';
                        setFormData({ ...formData, price_mkd: mkd, price_eur: eur });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Macedonian)
                  </label>
                  <textarea
                    value={formData.description_mk}
                    onChange={(e) => setFormData({ ...formData, description_mk: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center space-x-2 cursor-pointer text-gray-700 hover:text-gray-900 font-medium"
                    >
                      <Upload className="h-5 w-5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
