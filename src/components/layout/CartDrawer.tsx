'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/lib/store';
import { useStore } from '@/components/store-context';
import Image from 'next/image';
import Link from 'next/link';

const formatPrice = (amount: number, currency: string) =>
  `${amount.toLocaleString('en-US')} ${currency}`;

export default function CartDrawer() {
  const { items, isCartOpen, toggleCart, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const store = useStore();
  const { domainQuery } = store;

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggleCart}>
        <div className="fixed inset-0 bg-black/40 transition-opacity" />

        <div className="fixed inset-0 overflow-hidden" dir="rtl">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col bg-white shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                    <Dialog.Title className="text-xl font-bold text-black">سلة التسوق</Dialog.Title>
                    <button type="button" className="p-2 -m-2 text-gray-500 hover:text-black transition" onClick={toggleCart} aria-label="إغلاق">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Items */}
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    {items.length === 0 ? (
                      <p className="text-center text-gray-500 text-base py-12">السلة فارغة</p>
                    ) : (
                      <ul className="divide-y divide-gray-100 space-y-4">
                        {items.map((item) => (
                          <li key={item.id} className="flex gap-4 py-4 first:pt-0">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50 relative">
                              {(item as { images?: string[] }).images?.[0] ? (
                                <Image src={(item as { images?: string[] }).images![0]} alt={item.name} fill className="object-cover" />
                              ) : item.image_url ? (
                                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                              ) : null}
                            </div>
                            <div className="flex flex-1 flex-col min-w-0">
                              <div className="flex justify-between gap-2">
                                <h3 className="font-medium text-black text-sm truncate">{item.name}</h3>
                                <p className="text-sm font-semibold text-black flex-shrink-0">{formatPrice(item.price * item.quantity, store.currency)}</p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-gray-200 rounded-md">
                                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-600 hover:text-black hover:bg-gray-50">
                                    <MinusIcon className="h-4 w-4" />
                                  </button>
                                  <span className="px-3 text-sm font-medium text-black min-w-[2rem] text-center">{item.quantity}</span>
                                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-600 hover:text-black hover:bg-gray-50">
                                    <PlusIcon className="h-4 w-4" />
                                  </button>
                                </div>
                                <button type="button" onClick={() => removeItem(item.id)} className="text-sm font-medium text-red-600 hover:text-red-700">
                                  إزالة
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Footer - Stretched Black Checkout */}
                  {items.length > 0 && (
                    <div className="border-t border-gray-200 px-6 py-6 bg-white">
                      <div className="flex justify-between text-base font-semibold text-black mb-4">
                        <span>المجموع:</span>
                        <span>{formatPrice(getCartTotal(), store.currency)}</span>
                      </div>
                      <Link
                        href={`/checkout${domainQuery}`}
                        onClick={toggleCart}
                        className="block w-full py-4 px-6 text-center text-base font-bold text-white bg-black hover:bg-gray-900 transition rounded-md"
                      >
                        إتمام الطلب (Checkout)
                      </Link>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
