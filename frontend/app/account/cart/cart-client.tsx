'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    slug: string;
    price: number;
    images?: {
      id: number;
      url: string;
      formats?: {
        thumbnail?: { url: string };
        small?: { url: string };
      };
    }[];
  };
}

export default function CartClient() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = (session?.user as any)?.strapiToken;
  const userId = (session?.user as any)?.strapiUserId;

  const loadCart = useCallback(async () => {
    if (!userId || !token) return;

    try {
      const res = await fetch(
        `${strapiUrl}/api/cart-items?filters[user][id][$eq]=${userId}&populate[product][populate]=images&sort=addedAt:desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setCartItems(data.data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, token, strapiUrl]);

  useEffect(() => {
    if (session) {
      loadCart();
    }
  }, [session, loadCart]);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);

    try {
      const res = await fetch(`${strapiUrl}/api/cart-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { quantity: newQuantity } }),
      });

      if (res.ok) {
        setCartItems((items) =>
          items.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: number) => {
    setUpdating(itemId);

    try {
      const res = await fetch(`${strapiUrl}/api/cart-items/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setCartItems((items) => items.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getImageUrl = (item: CartItem) => {
    const image = item.product?.images?.[0];
    if (!image) return null;
    const url = image.formats?.small?.url || image.formats?.thumbnail?.url || image.url;
    return url?.startsWith('http') ? url : `${strapiUrl}${url}`;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.product?.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-7 h-7 text-orange-600" />
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        {cartItems.length > 0 && (
          <span className="bg-orange-100 text-orange-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const imageUrl = getImageUrl(item);
              const price = Number(item.product?.price) || 0;
              const lineTotal = price * item.quantity;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border border-gray-200 p-5 flex gap-4 transition-opacity ${
                    updating === item.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Product Image */}
                  <Link
                    href={`/marketplace/${item.product?.id}`}
                    className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.product?.title || 'Product'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/marketplace/${item.product?.id}`}
                      className="font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
                    >
                      {item.product?.title || 'Product'}
                    </Link>
                    <p className="text-lg font-bold text-orange-600 mt-1">
                      ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-orange-600">
                  ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <Link
                href="/account/checkout"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/marketplace"
                className="w-full inline-flex items-center justify-center gap-2 mt-3 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
