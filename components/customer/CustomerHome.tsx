'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Category = {
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePerKg: number;
  stockKg: number;
  catchLocation: string;
  imageUrl: string;
  category: Category;
};

type CartItem = {
  id: string;
  quantityKg: number;
  product: Product;
};

type Cart = {
  id: string;
  items: CartItem[];
};

export default function CustomerHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCartLoading, setIsCartLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsResponse, cartResponse] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/cart', { cache: 'no-store' })
        ]);

        if (!productsResponse.ok) {
          throw new Error('Unable to load products');
        }

        const productsPayload = await productsResponse.json();
        setProducts(productsPayload.products ?? []);

        if (cartResponse.ok) {
          const cartPayload = await cartResponse.json();
          setCart(cartPayload.cart);
        } else {
          setCart(null);
        }
      } catch (error) {
        setMessage('Unable to load menu. Try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const categories = useMemo(() => {
    const categoriesSet = new Set(products.map((product) => product.category.name));
    return ['All', ...Array.from(categoriesSet)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase()) || product.catchLocation.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const cartSubtotal = useMemo(() => {
    return cart?.items.reduce((total, item) => total + item.quantityKg * item.product.pricePerKg, 0) ?? 0;
  }, [cart]);

  const deliveryFee = cartSubtotal > 0 ? 60 : 0;
  const cartTotal = cartSubtotal + deliveryFee;

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((current) => {
      const next = Math.max(1, (current[productId] ?? 1) + delta);
      return { ...current, [productId]: next };
    });
  };

  const refreshCart = async () => {
    setIsCartLoading(true);
    try {
      const response = await fetch('/api/cart', { cache: 'no-store' });
      if (response.ok) {
        const payload = await response.json();
        setCart(payload.cart);
      }
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    const quantityKg = quantities[productId] ?? 1;
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantityKg })
      });

      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error ?? 'Failed to add to cart');
        return;
      }

      setMessage('Item added to cart successfully.');
      await refreshCart();
    } catch (error) {
      setMessage('Unable to add item. Make sure you are signed in.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2rem] bg-white p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-ocean-100 px-4 py-1 text-sm font-semibold text-ocean-700">Live menu</span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Seafood Delivery, Coastal Freshness</h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">Browse live seafood inventory, filter by catch, add to cart instantly, and manage your order from the same page.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:auto-cols-max lg:grid-flow-col">
              <div className="rounded-3xl bg-slate-100 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Delivery ETA</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">45-60 mins</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Live inventory</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">{products.length} items</p>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-[1.5fr_0.8fr]">
            <div className="rounded-[1.75rem] bg-slate-50 p-5 shadow-sm">
              <label className="block text-sm font-semibold text-slate-900">Search seafood</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by fish name, location, or flavor"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 outline-none transition focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Categories</p>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${selectedCategory === category ? 'bg-ocean-600 text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-slate-100'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.45fr_0.75fr]">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Browse the catch</h2>
                <p className="mt-2 text-sm text-slate-500">Interactive menu with live filters and pricing.</p>
              </div>
              <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">Showing {filteredProducts.length} of {products.length} items</div>
            </div>

            {message ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{message}</div>
            ) : null}

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-72 rounded-[1.75rem] bg-slate-100" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-[1.75rem] bg-white p-10 text-center text-slate-500 shadow-soft">No seafood matched your search. Try a different category or keyword.</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const selectedQuantity = quantities[product.id] ?? 1;
                  const cartItem = cart?.items.find((item) => item.product.id === product.id);
                  return (
                    <article key={product.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
                      <div className="relative h-52 w-full">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition duration-300 hover:scale-105" />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
                          <span>{product.category.name}</span>
                          <span>{product.stockKg} kg</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">{product.name}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                          <div>
                            <p className="text-sm text-slate-500">₹{product.pricePerKg}/kg</p>
                            <p className="text-xs text-slate-400">Catch from {product.catchLocation}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => handleQuantityChange(product.id, -1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100">-</button>
                            <span className="w-10 text-center text-sm font-semibold text-slate-900">{selectedQuantity}</span>
                            <button type="button" onClick={() => handleQuantityChange(product.id, 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100">+</button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <Button disabled={product.stockKg === 0} onClick={() => handleAddToCart(product.id)}>
                            {product.stockKg === 0 ? 'Out of stock' : cartItem ? 'Add more' : 'Add to cart'}
                          </Button>
                          {cartItem ? <span className="text-xs font-semibold uppercase tracking-[0.22em] text-ocean-600">{cartItem.quantityKg} kg in cart</span> : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="sticky top-6 space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Your cart</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Order summary</h2>
              </div>
              {isCartLoading ? (
                <div className="text-sm text-slate-500">Refreshing cart…</div>
              ) : cart === null ? (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">Sign in to add items and manage your order in real time.</div>
              ) : cart.items.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">Add items to your cart to see order totals and proceed to checkout.</div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-950">{item.product.name}</p>
                            <p className="text-sm text-slate-500">{item.quantityKg} kg × ₹{item.product.pricePerKg}</p>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">₹{item.product.pricePerKg * item.quantityKg}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">
                    <div className="flex justify-between py-1">Subtotal</div>
                    <div className="flex justify-between py-1">Delivery</div>
                    <div className="flex justify-between py-1 text-slate-950 font-semibold">Total</div>
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Delivery fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-950">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>
              <Button disabled={!cart || !cart.items.length}>Proceed to checkout</Button>
            </div>
            <div className="rounded-[2rem] bg-ocean-900 p-6 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.24em] text-coral-100">Why order here?</p>
              <ul className="mt-4 space-y-3 text-sm leading-6">
                <li>• Live inventory with coastal freshness</li>
                <li>• Secure checkout and order status updates</li>
                <li>• Easy add-to-cart experience and fast delivery</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
