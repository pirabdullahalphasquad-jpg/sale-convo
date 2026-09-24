import React, { useState } from 'react';
import { ProductItem, WizardState } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  ShoppingBag,
  Trash2,
  FileSpreadsheet,
  Check,
  PackageCheck,
  Tag,
  Boxes,
} from 'lucide-react';

interface Step4Props {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4AddProducts: React.FC<Step4Props> = ({
  state,
  updateState,
  onNext,
  onBack,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('Rs. 2,499');
  const [description, setDescription] = useState('Heavyweight cotton oversized T-shirt.');
  const [availability, setAvailability] = useState<'In stock' | 'Out of stock'>('In stock');
  const [variants, setVariants] = useState('Black, White, Beige');
  const [sizes, setSizes] = useState('S, M, L, XL');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      price: price.trim() || 'Rs. 0',
      description: description.trim(),
      availability,
      variants: variants.trim() || 'Default',
      sizes: sizes.trim() || 'Standard',
    };

    updateState({
      products: [...state.products, newProd],
    });

    // Reset form
    setName('');
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
        name: 'Premium Oversized T-Shirt',
        price: 'Rs. 2,499',
        description: 'Heavyweight cotton oversized T-shirt with reinforced crew neck.',
        availability: 'In stock',
        variants: 'Black, White, Beige',
        sizes: 'S, M, L, XL',
      },
      {
        id: 'prod-sample-2',
        name: 'Relaxed Cargo Pants',
        price: 'Rs. 3,899',
        description: 'Multi-pocket utilitarian streetwear cargo trousers in durable twill.',
        availability: 'In stock',
        variants: 'Charcoal, Khaki, Army Green',
        sizes: 'M, L, XL',
      },
      {
        id: 'prod-sample-3',
        name: 'Acid Wash Vintage Hoodie',
        price: 'Rs. 4,500',
        description: '380 GSM fleece pullover with brushed interior and custom drop fit.',
        availability: 'In stock',
        variants: 'Washed Grey, Vintage Slate',
        sizes: 'S, M, L',
      },
      {
        id: 'prod-sample-4',
        name: 'Classic Canvas Tote Bag',
        price: 'Rs. 1,200',
        description: '100% natural cotton canvas tote with heavy-duty shoulder straps.',
        availability: 'In stock',
        variants: 'Natural Ecru, Midnight Black',
        sizes: 'One Size',
      },
    ];

    updateState({
      products: samples,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            Step 4 of 7
          </span>
          <span className="text-xs text-slate-400">• Inventory & Catalog</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Add your products
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
          Your AI needs to know what you sell so it can answer product questions and help
          customers make a purchase.
        </p>
      </div>

      <div className="border-t border-slate-100 pt-6 space-y-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Catalog ({state.products.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="open-add-product-modal-btn"
              onClick={() => {
                setName('Premium Oversized T-Shirt');
                setShowAddModal(true);
              }}
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add product</span>
            </button>
          </div>
        </div>

        {/* Product Cards List or Empty State */}
        {state.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {state.products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-sm font-bold text-emerald-700 shrink-0 font-mono">
                      {product.price}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {product.description || 'No description provided'}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Status:</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full ${
                          product.availability === 'In stock'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {product.availability}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Variants:</span>
                      <span className="font-medium truncate max-w-[140px]">
                        {product.variants || '—'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Sizes:</span>
                      <span className="font-medium truncate max-w-[140px]">
                        {product.sizes || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.id)}
                    title="Delete product"
                    className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            id="products-empty-state"
            className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto mb-3 text-slate-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No products added yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Add at least one product so your AI can start answering product questions and
              converting shoppers into buyers.
            </p>
            <button
              type="button"
              id="add-first-product-btn"
              onClick={() => {
                setName('Premium Oversized T-Shirt');
                setShowAddModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add your first product</span>
            </button>
          </div>
        )}

        {/* Optional Import Section */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Have many products?</h4>
              <p className="text-xs text-slate-500">
                You can import your products later or load demo products now.
              </p>
            </div>
          </div>
          <button
            type="button"
            id="import-products-btn"
            onClick={handleImportSampleCatalog}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            Import products
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          id="step4-back-btn"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          id="step4-continue-btn"
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
              <h4 className="font-bold text-slate-900 text-base">Add Product Card</h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Oversized T-Shirt"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900"
                />
              </div>

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
                    placeholder="Rs. 2,499"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) =>
                      setAvailability(e.target.value as 'In stock' | 'Out of stock')
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900"
                  >
                    <option value="In stock">In stock</option>
                    <option value="Out of stock">Out of stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Heavyweight cotton oversized T-shirt."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Variants
                  </label>
                  <input
                    type="text"
                    value={variants}
                    onChange={(e) => setVariants(e.target.value)}
                    placeholder="Black, White, Beige"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sizes
                  </label>
                  <input
                    type="text"
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
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
                <span>Add Product</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
