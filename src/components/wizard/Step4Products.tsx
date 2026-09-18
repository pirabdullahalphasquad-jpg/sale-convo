import { useState } from "react";
import { ArrowLeft, ArrowRight, FileSpreadsheet, Plus, Trash2 } from "lucide-react";
import { useWizardStore } from "@/store/useWizardStore";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  variants: string;
  sizes: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "premium-oversized-t-shirt",
    name: "Premium Oversized T-Shirt",
    price: "Rs. 2,499",
    description: "Heavyweight 240 GSM combed cotton oversized drop-shoulder T-shirt.",
    variants: "Black, White, Beige, Olive",
    sizes: "S, M, L, XL",
  },
  {
    id: "relaxed-cargo-pants",
    name: "Relaxed Cargo Pants",
    price: "Rs. 3,899",
    description: "Durable cotton-twill cargo pants with 6 utility pockets and drawstring waist.",
    variants: "Charcoal, Khaki, Army Green",
    sizes: "M, L, XL",
  },
];

const EMPTY_FORM = { name: "", price: "", description: "", status: "In stock", variants: "", sizes: "" };

export function Step4Products() {
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep);
  const updateWizardData = useWizardStore((state) => state.updateWizardData);
  const catalogProducts = useWizardStore((state) => state.catalogProducts);
  const [products, setProducts] = useState<Product[]>(() =>
    DEFAULT_PRODUCTS.slice(0, Math.min(catalogProducts, DEFAULT_PRODUCTS.length)),
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const syncProducts = (nextProducts: Product[]) => {
    setProducts(nextProducts);
    updateWizardData({ catalogProducts: nextProducts.length });
  };

  const addProduct = () => {
    const name = form.name.trim();
    if (!name) return;
    syncProducts([
      ...products,
      {
        id: `product-${Date.now()}`,
        name,
        price: form.price.trim() || "Rs. 0",
        description: form.description.trim(),
        variants: form.variants.trim(),
        sizes: form.sizes.trim(),
      },
    ]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const removeProduct = (id: string) => {
    syncProducts(products.filter((product) => product.id !== id));
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-brand-border/60 bg-brand-soft px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-brand">
          Step 4 of 7
        </span>
        <span className="text-xs text-muted-foreground">• Inventory &amp; Catalog</span>
      </div>

      <h1 className="mt-1.5 text-3xl font-bold leading-tight tracking-tight text-foreground">
        Add your products
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Your AI needs to know what you sell so it can answer product questions and help customers
        make a purchase.
      </p>

      <div className="mt-6 border-t border-border/60 pt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-foreground">
            Product Catalog ({products.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowForm((open) => !open)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-strong"
          >
            <Plus className="h-3.5 w-3.5" />
            Add product
          </button>
        </div>

        {showForm ? (
          <div className="mt-6 rounded-xl border border-brand-border/60 bg-card p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="product-name" className="pb-1.5 text-xs font-semibold text-foreground">
                  Product Name
                </label>
                <input
                  id="product-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Premium Oversized T-Shirt"
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                />
              </div>
              <div>
                <label htmlFor="product-price" className="pb-1.5 text-xs font-semibold text-foreground">
                  Price (Rs.)
                </label>
                <input
                  id="product-price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. Rs. 2,499"
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="product-description" className="pb-1.5 text-xs font-semibold text-foreground">
                  Description
                </label>
                <textarea
                  id="product-description"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of the product."
                  className="w-full resize-none rounded-xl border border-border bg-card p-3 text-sm leading-relaxed text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                />
              </div>
              <div>
                <label htmlFor="product-status" className="pb-1.5 text-xs font-semibold text-foreground">
                  Status
                </label>
                <input
                  id="product-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-brand"
                />
              </div>
              <div>
                <label htmlFor="product-variants" className="pb-1.5 text-xs font-semibold text-foreground">
                  Variants
                </label>
                <input
                  id="product-variants"
                  value={form.variants}
                  onChange={(e) => setForm({ ...form, variants: e.target.value })}
                  placeholder="e.g. Black, White"
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="product-sizes" className="pb-1.5 text-xs font-semibold text-foreground">
                  Sizes
                </label>
                <input
                  id="product-sizes"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  placeholder="e.g. S, M, L, XL"
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={cancelForm}
                className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addProduct}
                disabled={!form.name.trim()}
                className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-strong disabled:opacity-50"
              >
                Add Product
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex min-h-[246px] flex-col rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm font-bold leading-5 text-foreground">{product.name}</h3>
                <span className="shrink-0 text-sm font-bold leading-5 text-brand">
                  {product.price}
                </span>
              </div>
              <p className="mt-1.5 min-h-8 text-xs leading-snug text-muted-foreground">
                {product.description}
              </p>

              <div className="mt-3 border-t border-border/60 pt-2 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground/70">Status:</span>
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-brand">
                    In stock
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <span className="text-muted-foreground/70">Variants:</span>
                  <span className="truncate font-medium text-muted-foreground">
                    {product.variants}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <span className="text-muted-foreground/70">Sizes:</span>
                  <span className="font-medium text-muted-foreground">{product.sizes}</span>
                </div>
              </div>

              <div className="mt-auto flex justify-end border-t border-border/60 pt-3">
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
                  aria-label={`Remove ${product.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/60 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-foreground">Have many products?</h3>
              <p className="text-xs leading-snug text-muted-foreground">
                You can import your products later or load demo products now.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
          >
            Import products
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(5)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-medium text-brand-foreground shadow-sm transition-colors hover:bg-brand-strong"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
