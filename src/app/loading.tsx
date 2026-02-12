export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" dir="rtl">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-gray-200" />
          <div
            className="absolute inset-0 h-12 w-12 rounded-full border-2 border-transparent border-t-black animate-spin"
            aria-hidden
          />
        </div>
        <p className="text-sm text-gray-500 font-medium">جاري التحميل...</p>
      </div>
    </div>
  );
}
