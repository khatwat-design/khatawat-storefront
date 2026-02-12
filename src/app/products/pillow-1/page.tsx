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
      image: "/products/pillow-1.jpg",
      title: "وسادة الراحة المثالية"
    },
    {
      image: "/products/pillow-2.jpg", 
      title: "تصميم ناعم ومريح"
    },
    {
      image: "/products/pillow-3.jpg",
      title: "سهولة الاستخدام والنقل"
    }
  ];

  const features = [
    {
      title: "رفع الرقبة وتفك الضغط",
      description: "تصميم هندسي يدعم الرقبة بشكل مثالي ويزيل الضغط عن الفقرات"
    },
    {
      title: "نفخ هوائي متحكم",
      description: "نظام نفخ سهل بالهواء مع تحكم كامل في مستوى الراحة المطلوب"
    },
    {
      title: "قماش ناعم ومريح",
      description: "مصنوعة من أجود الخامات الناعمة مع طبقة داخلية مانعة للتسريب"
    }
  ];

  const handleAddToCart = () => {
    addItem(
      {
        id: "pillow-1",
        name: "وسادة الرقبة القابلة للنفخ",
        description: "وسادة مريحة للسفر والنوم، قابلة للنفخ والتعديل",
        price: 29500,
        image_url: "/products/pillow-1.jpg",
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
            وسادة الرقبة
            <span className="block text-red-600">القابلة للنفخ</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            إذا تحس بثقل في الرقبة شد بأكتاف صداع متكرر فغالباً المشكلة من الضغط المتراكم على الفقرات العنقية
          </p>
          
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            هذي الوسادة مصممة حتى ترفع الرقبة وتفك الضغط بدون ألم
          </p>

          <div className="mb-12">
            <img 
              src="/products/pillow-1.jpg" 
              alt="تُظهر الجهاز بشكل كامل ومنفخ، يتكون من 3 طبقات باللون الكحلي مع خرطوم النفخ والمضخة اليدوية وصمام الأمان الأزرق وخلفية الصورة بيضاء"
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
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">
                راحة تدريجية لفقرات الرقبة
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                الوسادة تنفخ بالهواء حسب راحتك. تكف بالضبط يم النقطة التي تحس بيها بالارتياح.
                ماكو أي شد مفاجئ ولا ضغط قوي.
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
                  src="/products/pillow-2.jpg" 
                  alt="صورة ترويجية تحتوي على 4 مربعات تشرح المميزات: إمكانية تعديل القياس حسب حجم الرقبة، جودة القماش والملمس المريح، المضخة اليدوية الكبيرة للنفخ السريع، متانة الملحقات"
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
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="font-bold text-black mb-2">تعمل بالكهرباء</h3>
              <p className="text-gray-600">
                تشحن وتستخدم بسهولة بدون أي مجهود وتناسب الاستخدام في أي مكان
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl">🔧</span>
              </div>
              <h3 className="font-bold text-black mb-2">محرك نحاسي قوي</h3>
              <p className="text-gray-600">
                محرك قوي 550 واط، أداء عالي وسرعة ممتازة في الفرم والتقطيع
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl">⏱️</span>
              </div>
              <h3 className="font-bold text-black mb-2">سريعة وسهلة الاستخدام</h3>
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
              <h3 className="font-bold text-black mb-6 text-xl">المواد والتصميم</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  مواد قوية وآمنة
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  مصنوعة من بلاستيك ABS مع ستانلس ستيل متين
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  تصميم ذكي وعملي
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  حجم مناسب للمطبخ وسهل التخزين
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="font-bold text-black mb-6 text-xl">الأداء</h3>
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
                  ثلاثة أنواع شفرات
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  تحكم كامل بشكل التقطيع
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            جربها اليوم وارتاح
          </h2>
          <p className="text-xl mb-4 opacity-90">
            اطلب وسادة الراحة الآن واستمتع بالراحة الفورية
          </p>
          <p className="text-2xl font-bold mb-8">
            السعر: 29,500 دينار عراقي
          </p>
          
          <button 
            onClick={handleAddToCart}
            className={`px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 ${
              isAddedToCart 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-white text-red-600 hover:bg-gray-100'
            }`}
          >
            {isAddedToCart ? '✓ تمت الإضافة للسلة' : 'أضف للسلة'}
          </button>
        </div>
      </section>

      {/* Usage Tips */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            طريقة الاستخدام
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
                <img 
                  src="/products/pillow-3.jpg" 
                  alt="لقطة جانبية للجهاز تركز على شكل الطبقات الثلاث وهي ممتلئة بالهواء"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-sm md:text-base">للسفر والدوام</h3>
              <p className="text-gray-600 text-xs md:text-sm">
                وزنها خفيف وتفرغ الهواء وتدخل بالجنطة
              </p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
                <img 
                  src="/products/pillow-4.jpg" 
                  alt="صورة ترويجية تحتوي على 4 مربعات تشرح المميزات"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-sm md:text-base">للمكتب والبيت</h3>
              <p className="text-gray-600 text-xs md:text-sm">
                تستخدمها بالطريق الطويل بالدوام او حتى وانت كاعد بالبيت
              </p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
                <img 
                  src="/products/pillow-5.jpg" 
                  alt="صورة تظهر الجهاز وهو مفرغ من الهواء ومنبسط"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-sm md:text-base">مناسبة للجميع</h3>
              <p className="text-gray-600 text-xs md:text-sm">
                كبار العمر موظفين طلاب أي شخص يعاني من وجع رقبة
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
