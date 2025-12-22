
// 2. src/components/LanguageSwitcher.jsx  ← BEAUTIFUL DROPDOWN
import { t, setLanguage } from '../lib/language';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const current = localStorage.getItem('lang') || 'en';

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200">
        <Globe size={20} className="text-indigo-600" />
        <span className="font-bold text-gray-700">
          {current === 'en' ? 'EN' : 'አማ'}
        </span>
      </button>

      <div className="absolute top-12 right-0 w-40 bg-white rounded-2xl shadow-2xl border border-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50">
        <button
          onClick={() => setLanguage('en')}
          className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition ${current === 'en' ? 'bg-indigo-100 font-bold' : ''}`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('am')}
          className={`w-full px-4 py-3 text-left hover:bg-pink-50 transition font-amharic ${current === 'am' ? 'bg-pink-100 font-bold' : ''}`}
        >
          አማርኛ
        </button>
      </div>
    </div>
  );
}