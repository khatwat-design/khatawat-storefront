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
      image: "/products/vegetable-cutter-1.jpg",
      title: "تقطيع احترافي وسريع"
    },
    {
      image: "/products/vegetable-cutter-2.jpg", 
      title: "متعددة الاستخدامات"
    },
    {
      image: "/products/vegetable-cutter-3.jpg",
      title: "سهولة التنظيف والتخزين"
    }
  ];

  const features = [
    {
      title: "تخفيف الألم وشد الرقبة",
      description: "يرفع الرقبة تدريجياً ويفك الضغط عنها يساعد على تقليل الصداع والدوخة وشد العضلات"
    },
    {
      title: "مواد ناعمة ومريحة للبشرة",
      description: "قماش شبه مخملي ناعم مع طبقة داخلية من PVC تمنع التسريب وثلاث طبقات للتحكم"
    },
    {
      title: "سهل الاستخدام والتحكم",
      description: "تلبسه حول الرقبة وتنـفخه بالبالون اليدوي المرفق وتوقف عند المستوى المريح"
    }
  ];

  const handleAddToCart = () => {
    addItem(
      {
        id: "vegetable-cutter-1",
        name: "ماكينة تقطيع الخضروات الكهربائية",
        description: "ماكينة سريعة لتقطيع الخضروات والفواكه بسهولة",
        price: 67500,
        image_url: "/products/vegetable-cutter-1.jpg",
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
            ليش تضيعين وقتج
            <span className="block text-red-600">بالتقطيع؟</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            بالطبخ اليومي أكثر شيء مرهق هو تقطيع الخضروات
          </p>
          
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            سجاجين وتعب إيد ووقت يضيع. هاي المكينة تنجز الشغل بسرعة وتخليج تكمّلين طبخج وانت مرتاحة
          </p>

          <div className="mb-12">
            <img 
              src="/products/vegetable-cutter-1.jpg" 
              alt="أنواع شفرات التقطيع الثلاثة المرفقة مع الجهاز: شفرة الشرائح (2.5 ملم)، شفرة الخيوط الرفيعة (3 ملم)، شفرة الخيوط العريضة (5 ملم)"
              className="mx-auto rounded-2xl shadow-xl max-w-md w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl">
              شوفي الحل السريع هسه
            </button>
            <Link 
              href="#features"
              className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-600 hover:text-white transition-all"
            >
              شاهد المميزات
            </Link>
          </div>
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
                تشحن وتشتغل وين ما تكونين
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                ما تحتاج مجهود. تشحنينها وتستخدمينها بالمطبخ، بالرحلات، أو بأي مكان تحبين.
                سهولة حقيقية بدون قيود.
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
                  src="/products/vegetable-cutter-2.jpg" 
                  alt="بوستر ترويجي باللغة العربية يصف الجهاز بأنه 'قطاعة الخضروات الحديثة تعمل بالشحن'، ويظهر الجهاز وهو يقطع البطاطس مع نماذج لأطباق خضروات وفواكه مقطعة"
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
                <span className="text-xl">🔋</span>
              </div>
              <h3 className="font-bold text-black mb-2">شفرة ستانلس ستيل</h3>
              <p className="text-gray-600">
                شفرة ستانلس ستيل قوية بس دقيقة تتعامل مع الطماطة والعنب بهدوء
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl">🔄</span>
              </div>
              <h3 className="font-bold text-black mb-2">بدون عصر أو تشويه</h3>
              <p className="text-gray-600">
                تقطيع ناعم بدون عصر ولا تشويه للشكل
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl">⏱️</span>
              </div>
              <h3 className="font-bold text-black mb-2">نتائج سريعة</h3>
              <p className="text-gray-600">
                نتيجة نظيفة بثواني بدل الدقائق
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Steps */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            طريقة الاستخدام
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3">
                <img 
                  src="/products/vegetable-cutter-3.jpg" 
                  alt="صورة للمنتج باللون الأخضر الفاتح (الباستيل)، تظهر التصميم العصري للجهاز مع زر التشغيل في الأسفل"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-xs md:text-sm">ضع الخضروات</h3>
              <p className="text-gray-600 text-xs">
                ضع الخضروات داخل الجهاز
              </p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3">
                <img 
                  src="/products/vegetable-cutter-4.jpg" 
                  alt="علبة التغليف الخارجية (الكرتونة) للمنتج مع كتابة 'Kitchen 4 in 1 Grater'، وتوضح أبعاد الجهاز (28 سم ارتفاع، 17.9 سم عرض، 15 سم عمق)"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-xs md:text-sm">اضغط تشغيل</h3>
              <p className="text-gray-600 text-xs">
                اضغط على زر التشغيل
              </p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3">
                <img 
                  src="/products/vegetable-cutter-5.jpg" 
                  alt="صورة للمنتج باللون الأبيض، مما يوضح توفر الجهاز بألوان مختلفة"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-xs md:text-sm">انتظر</h3>
              <p className="text-gray-600 text-xs">
                الجهاز يقطع بسرعة
              </p>
            </div>
            
            <div className="text-center">
              <div className="aspect-square w-full max-w-xs mx-auto bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3">
                <img 
                  src="/products/vegetable-cutter-6.jpg" 
                  alt="لقطة قريبة للجهاز أثناء تقطيع الجزر إلى خيوط رفيعة، مع نص صيني يشير إلى نوع الشفرة المستخدمة"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-black mb-1 md:mb-2 text-xs md:text-sm">جاهز</h3>
              <p className="text-gray-600 text-xs">
                خضروات مقطوعة وجاهزة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            المواصفات الفنية
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="font-bold text-black mb-6 text-xl">القوة والأداء</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  محرك نحاسي قوي 550 واط
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  يشتغل بثبات وكفاءة
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

      {/* Cleaning Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            حتى التنظيف مو متعب
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">القطع تنفصل بسهولة</h3>
              <p className="text-lg opacity-90 mb-6">
                تنغسل وترجع مكانها بثواني. يعني راحة بالاستخدام وبعد الاستعمال.
              </p>
              
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
                <h4 className="font-bold text-white mb-4">مميزات التنظيف:</h4>
                <ul className="space-y-2 opacity-90">
                  <li>✓ أجزاء قابلة للفك</li>
                  <li>✓ غسيل سريع بالماء</li>
                  <li>✓ تجفيف فوري</li>
                  <li>✓ تركيب سهل</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-8xl mb-6">🧼</div>
              <p className="text-xl opacity-90">
                راحة من أول استخدام
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            جودة تدوم اطلبيها هسة
          </h2>
          <p className="text-xl mb-4 text-gray-600">
            اطلبي ماكينة التقطيع الآن واستمتعي بالطبخ السريع
          </p>
          <p className="text-2xl font-bold mb-8 text-black">
            السعر: 67,500 دينار عراقي
          </p>
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
      </section>
    </div>
  );
}
