import React, { useState } from 'react';
import { ProductItem, WizardState } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  ShoppingBag,
  Trash2,
  Sparkles,
  Check,
  Tag,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface Step5Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  'Fashion & Apparel',
  'Beauty & Cosmetics',
  'Electronics & Gadgets',
  'Food & Grocery',
  'Home & Lifestyle',
  'Health & Wellness',
  'Accessories',
  'General',
];

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const COMMON_COLORS = ['Black', 'White', 'Navy', 'Beige', 'Grey', 'Olive', 'Maroon'];

const PRESET_IMAGES = [
  { label: 'T-Shirt', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
  { label: 'Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80' },
  { label: 'Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80' },
  { label: 'Cosmetics', url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&auto=format&fit=crop&q=80' },
  { label: 'Accessories', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80' },
];

export const Step5AddProducts: React.FC<Step5Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('PKR 2,499');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [availability, setAvailability] = useState<'In stock' | 'Out of stock' | 'Coming soon'>('In stock');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Black', 'White']);
  const [customColor, setCustomColor] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  const toggleSize = (s: string) => {
    if (selectedSizes.includes(s)) {
      setSelectedSizes(selectedSizes.filter((x) => x !== s));
    } else {
      setSelectedSizes([...selectedSizes, s]);
    }
  };

  const toggleColor = (c: string) => {
    if (selectedColors.includes(c)) {
      setSelectedColors(selectedColors.filter((x) => x !== c));
    } else {
      setSelectedColors([...selectedColors, c]);
    }
  };

  const handleAddCustomColor = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customColor.trim()) return;
    if (!selectedColors.includes(customColor.trim())) {
      setSelectedColors([...selectedColors, customColor.trim()]);
    }
    setCustomColor('');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      price: price.trim() || 'PKR 0',
      description: description.trim(),
      category,
      availability,
      variants: selectedColors.join(', ') || 'Standard',
      sizes: selectedSizes.join(', ') || 'Standard',
      imageUrl,
    };

    updateState({
      products: [...state.products, newProd],
    });

    // Reset fields
    setName('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleRemoveProduct = (id: string) => {
    updateState({
      products: state.products.filter((p) => p.id !== id),
    });
  };

  const handleImportSampleCatalog = () => {
    const samples: ProductItem[] = [
      {
        id: 'prod-sample-1',
        name: 'Premium Cotton T-Shirt',
        price: 'PKR 2,499',
        description: 'Premium 100% combed cotton oversized T-shirt with reinforced crew neck.',
        category: 'Fashion & Apparel',
        availability: 'In stock',
        variants: 'Black, White, Navy',
        sizes: 'S, M, L, XL',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'prod-sample-2',
        name: 'Heavyweight Fleece Hoodie',
        price: 'PKR 4,800',
        description: '380 GSM brushed interior hoodie tailored for all-day comfort and warmth.',
        category: 'Fashion & Apparel',
        availability: 'In stock',
        variants: 'Charcoal, Washed Olive',
        sizes: 'M, L, XL',
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'prod-sample-3',
        name: 'Everyday Relaxed Cargo Pants',
        price: 'PKR 3,750',
        description: 'Durable stretch cotton twill with deep utilitarian storage pockets.',
        category: 'Fashion & Apparel',
        availability: 'In stock',
        variants: 'Beige, Black',
        sizes: 'S, M, L',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
      },
    ];

    updateState({ products: samples });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Step 5 of 7
          </span>
          <span className="text-xs text-slate-400">• Product Catalog</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Add your products
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          Give SaleConvo accurate product information so it can answer questions and help customers buy.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Products ({state.products.length})
            </span>
            <span className="text-xs text-slate-400">• 1–3 products are enough for onboarding</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="import-sample-catalog-btn"
              onClick={handleImportSampleCatalog}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Import Sample Products</span>
            </button>

            <button
              type="button"
              id="open-add-product-modal-btn"
              onClick={() => {
                setName('');
                setDescription('');
                setShowAddModal(true);
              }}
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Product</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {state.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div>
                  {product.imageUrl && (
                    <div className="h-32 w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                          product.availability === 'In stock'
                            ? 'bg-emerald-600 text-white'
                            : product.availability === 'Coming soon'
                            ? 'bg-amber-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {product.availability}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {product.category || 'General'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {product.name}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60 shrink-0 font-mono">
                        {product.price}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description || 'No description provided'}
                    </p>

                    <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                      {product.variants && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">Colors: {product.variants}</span>
                        </div>
                      )}
                      {product.sizes && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">Sizes: {product.sizes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">AI Synced</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto mb-3 text-slate-400">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No products added yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Add at least 1 product or import samples so your AI can practice answering questions about sizes, colors, and prices.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleImportSampleCatalog}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Load Sample Products</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Product</span>
              </button>
            </div>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Don’t worry about entering your entire inventory now:</strong> SaleConvo connects with your full inventory and catalog via Shopify, WooCommerce, or CSV export in your live dashboard later.
          </span>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          id="step5-back-btn"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          id="step5-continue-btn"
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 text-sm cursor-pointer group"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div
          id="add-product-modal"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleAddProduct}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">Add Product</h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Cotton T-Shirt"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. PKR 2,499"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Stock Availability
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['In stock', 'Out of stock', 'Coming soon'] as const).map((status) => (
                    <button
                      type="button"
                      key={status}
                      onClick={() => setAvailability(status)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        availability === status
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 text-slate-600 bg-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Premium 100% cotton oversized T-shirt."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
                />
              </div>

              {/* Sizes (chips) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_SIZES.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COMMON_COLORS.map((col) => {
                    const isSelected = selectedColors.includes(col);
                    return (
                      <button
                        type="button"
                        key={col}
                        onClick={() => toggleColor(col)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onKeyDown={handleAddCustomColor}
                    placeholder="Add custom color..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 rounded-lg cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Product Image Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Product Image Preview
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setImageUrl(preset.url)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                        imageUrl === preset.url
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-product-btn"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Product</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
