'use client';

import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/lib/store';
import { useStore } from '@/components/store-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { submitCheckoutOrder, validateCoupon } from '@/lib/api';

const governorates = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'كربلاء', 'واسط', 'بابل',
  'ديالى', 'الأنبار', 'ميسان', 'الديوانية', 'ذي قار', 'المثنى', 'كركوك',
  'صلاح الدين', 'دهوك', 'السليمانية'
];

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-400 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const store = useStore();
  const { domainQuery, domain } = store;
  const router = useRouter();
  const justSubmittedSuccess = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    governorate: 'بغداد',
    city_details: '',
  });

  const subtotal = getCartTotal();
  const shipping = store.shippingCost;
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  useEffect(() => {
    if (items.length === 0 && !justSubmittedSuccess.current) {
      router.push(domainQuery ? `/${domainQuery}` : '/');
    }
  }, [items, router, domainQuery]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const res = await validateCoupon(couponCode.trim(), subtotal, domain ?? undefined);
      if (res.valid && res.discount !== undefined) {
        setCouponDiscount(res.discount);
        setCouponApplied(true);
      } else {
        setCouponError(res.message || 'الكود غير صالح');
        setCouponDiscount(0);
        setCouponApplied(false);
      }
    } catch {
      setCouponError('حدث خطأ أثناء التحقق');
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fullAddress = `${formData.governorate} - ${formData.city_details}`;
      const payload = {
        customer_first_name: formData.first_name,
        customer_last_name: formData.last_name,
        phone: formData.phone,
        address: fullAddress,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        ...(couponApplied && couponCode.trim() ? { coupon_code: couponCode.trim() } : {}),
      };

      await submitCheckoutOrder(payload, domain ?? undefined);
      justSubmittedSuccess.current = true;
      router.replace(domainQuery ? `/thank-you${domainQuery}` : '/thank-you');
      clearCart();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  const formatPrice = (amount: number) => `${amount.toLocaleString('en-US')} ${store.currency}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-black mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Order Summary */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-black mb-6">ملخص الطلب</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100">
                    <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {(item as { images?: string[] }).images?.[0] || item.image_url ? (
                        <Image
                          src={(item as { images?: string[] }).images?.[0] || item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black text-sm truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                      <p className="font-semibold text-black text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {shipping > 0 && (
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>الشحن</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="كود الخصم"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponApplied(false);
                      setCouponError('');
                    }}
                    disabled={couponApplied}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode.trim()}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {couponApplied ? '✓ مطبّق' : 'تطبيق'}
                  </button>
                </div>
                {couponError && <p className="text-sm text-red-600">{couponError}</p>}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>الخصم</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-black pt-2">
                  <span>الإجمالي</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-lg font-bold text-black mb-6">بيانات الشحن</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
                    <input
                      required
                      type="text"
                      className={inputClass}
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اللقب</label>
                    <input
                      required
                      type="text"
                      className={inputClass}
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    required
                    type="tel"
                    placeholder="07xxxxxxxxx"
                    className={inputClass}
                    style={{ direction: 'ltr', textAlign: 'right' }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة</label>
                  <select
                    className={inputClass}
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  >
                    {governorates.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان بالتفصيل (المنطقة، الشارع)</label>
                  <textarea
                    required
                    rows={3}
                    className={inputClass}
                    value={formData.city_details}
                    onChange={(e) => setFormData({ ...formData, city_details: e.target.value })}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 px-6 text-lg font-bold text-white bg-black hover:bg-gray-900 disabled:bg-gray-700 disabled:cursor-not-allowed transition rounded-xl mt-6 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      جاري الإرسال...
                    </>
                  ) : (
                    'تأكيد الطلب (Confirm Order)'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
