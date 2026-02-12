"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/products";

export default function ProductPage() {
  const addItem = useCartStore((state) => state.addItem);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const slides = [
    {
      image: "/products/shaver-1.jpg",
      title: "تقشير احترافي وسريع"
    },
    {
      image: "/products/shaver-2.jpg", 
      title: "سهولة الاستخدام والنظافة"
    },
    {
      image: "/products/shaver-3.jpg",
      title: "نتائج مثالية في كل مرة"
    }
  ];

  const features = [
    {
      title: "تشغيل أوتوماتيكي كامل",
      description: "ضغطة زر واحدة وكل شيء يتم تلقائياً بدون أي مجهود يدوي"
    },
    {
      title: "خامات عالية الجودة",
      description: "هيكل قوي من ABS مع بلاستيك آمن للأطعمة وشفرة ستانلس ستيل متينة"
    },
    {
      title: "سهولة التنظيف",
      description: "أجزاء قابلة للفك والغسل بسهولة لتجربة استخدام مريحة بدون عناء"
    }
  ];

  const handleAddToCart = () => {
    addItem(
      {
        id: "shaver-1",
        name: "ماكينة التقشير الكهربائية الحديثة",
        description: "ماكينة تقشير احترافية للطماطة والفواكه",
        price: 46500,
        image_url: "/products/shaver-1.jpg",
      },
      1,
    );
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white opacity-90"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
            ماكينة التقشير
            <span className="block text-red-600">الكهربائية الحديثة</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            ليش تتعبين إيدج على شغلة بسيطة؟
          </p>
          
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            تقشير الطماطة والعنب والفواكه الصغيرة ياخذ وقت. وويا التكرار يصير تعب يومي.
            هاي المكينة تختصر كل هالتعب!
          </p>

          <div className="mb-12">
            <img 
              src="/products/shaver-1.jpg" 
              alt="أنواع الشفرات الأسطوانية الثلاث المتوفرة مع الجهاز: شفرة التقطيع لشرائح بسمك 2.5 ملم، شفرة الخيوط الرفيعة بسمك 3 ملم، شفرة البشر (الخيوط العريضة) بسمك 5 ملم"
              className="mx-auto rounded-2xl shadow-xl max-w-md w-full"
            />
          </div>

          <button 
            onClick={handleAddToCart}
            className={`px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-xl ${
              isAddedToCart 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isAddedToCart ? 'تمت الإضافة للسلة' : 'أضف للسلة'}
          </button>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-100 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-red-50 rounded-full opacity-30 animate-bounce"></div>
      </section>

      {/* Problem/Solution Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">
                ضغطة زر والباقي يتكشر وحده
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                تشغيل أوتوماتيكي كامل. تحطين الفاكهة تضغطين الزر والمكينة تشتغل بسرعة وبدقة.
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 bg-red-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-red-100 to-pink-50 rounded-3xl p-8 shadow-xl">
                <img 
                  src="/products/shaver-2.jpg" 
                  alt="بوستر ترويجي باللغة العربية يصف الجهاز بـ 'قطاعة الخضروات الحديثة تعمل بالشحن'. تظهر القطاعة باللون الأبيض وهي تقوم بتقطيع البطاطس، وبجانبها أطباق متنوعة لخضروات وفواكه مقطعة"
                  className="rounded-2xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            مميزات المنتج
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl">⚙️</span>
              </div>
              <h3 className="font-bold text-black mb-2">محرك نحاسي قوي</h3>
              <p className="text-gray-600">
                محرك قوي 550 واط، أداء عالي وسرعة ممتازة في الفرم والتقطيع
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl">🔪</span>
              </div>
              <h3 className="font-bold text-black mb-2">3 شفرات حادة</h3>
              <p className="text-gray-600">
                ثلاثة أنواع شفرات: شرائح، مكعبات، أو فرم حسب احتياجك
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="font-bold text-black mb-2">سريعة وسهلة</h3>
              <p className="text-gray-600">
                تختصر الوقت والجهد وتسهل تحضير الطبخ اليومي
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            المواصفات الفنية
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="font-bold text-black mb-6 text-xl">الأداء والقوة</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  محرك نحاسي قوي 550 واط
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  أداء عالي وسرعة ممتازة
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  يقطع بسرعة وبدون ما يضعف الأداء
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  حتى ويا الاستخدام اليومي المستمر
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="font-bold text-black mb-6 text-xl">التصميم والمواد</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  مواد قوية وآمنة للاستخدام
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  مصنوعة من ABS وستانلس ستيل متين
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  تصميم عملي وخفيف
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  حجم مناسب للمطبخ وسهل التخزين
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Demo */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            شاهد كيف تعمل
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
                <img 
                  src="/products/shaver-1.jpg" 
                  alt="أنواع الشفرات الأسطوانية الثلاث المتوفرة مع الجهاز"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-sm md:text-base">ضع الفاكهة</h3>
              <p className="text-gray-600 text-xs md:text-sm">
                ضع الفاكهة داخل الجهاز
              </p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
                <img 
                  src="/products/shaver-2.jpg" 
                  alt="الجهاز بلون تيفاني (أخضر فاتح)"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-sm md:text-base">اضغط تشغيل</h3>
              <p className="text-gray-600 text-xs md:text-sm">
                اضغط على زر التشغيل وحدد الوقت
              </p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
                <img 
                  src="/products/shaver-1.jpg" 
                  alt="نتيجة التقشير"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-sm md:text-base">احصل على النتيجة</h3>
              <p className="text-gray-600 text-xs md:text-sm">
                فاكهة مقشورة وجاهزة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            الفرق واضح
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-600 mb-6">قبل</h3>
              <img 
                src="/products/shaver-3.jpg" 
                alt="تقشير يدوي ياخذ وقت وجهد"
                className="rounded-2xl shadow-lg border-2 border-red-200 w-full"
              />
              <p className="text-lg text-gray-700 mt-4">
                تقشير يدوي ياخذ وقت وجهد
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-6">بعد</h3>
              <img 
                src="/products/shaver-4.jpg" 
                alt="تقشير سريع ونتائج مثالية"
                className="rounded-2xl shadow-lg border-2 border-green-200 w-full"
              />
              <p className="text-lg text-gray-700 mt-4">
                تقشير سريع ونتائج مثالية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            جربيها اليوم
          </h2>
          <p className="text-xl mb-4 text-gray-600">
            اطلبي ماكينة التقشير الآن واستمتعي بالنتائج المثالية
          </p>
          <p className="text-2xl font-bold mb-8 text-black">
            السعر: 46,500 دينار عراقي
          </p>
          
          <button 
            onClick={handleAddToCart}
            className={`px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 ${
              isAddedToCart 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isAddedToCart ? '✓ تمت الإضافة للسلة' : 'أضف للسلة'}
          </button>
        </div>
      </section>
    </div>
  );
}
