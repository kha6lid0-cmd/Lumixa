import { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { UI_STRINGS } from '../data/translations';
import { Language, ToolCategory } from '../types/tools';

interface HeaderProps {
  lang: Language;
  onToggleLanguage: () => void;
  onNavigateCategory: (category: ToolCategory) => void;
  onNavigateHome: () => void;
  onNavigateFaq: () => void;
}

export function Header({
  lang,
  onToggleLanguage,
  onNavigateCategory,
  onNavigateHome,
  onNavigateFaq,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_STRINGS[lang];

  const handleCategoryClick = (cat: ToolCategory) => {
    setMobileMenuOpen(false);
    onNavigateCategory(cat);
  };

  const handleFaqClick = () => {
    setMobileMenuOpen(false);
    onNavigateFaq();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            onNavigateHome();
          }}
          className="text-xl font-bold tracking-tight text-violet-800 hover:text-violet-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600 rounded"
        >
          LUMIXA
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.IMAGE)}
            className="hover:text-violet-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.image}
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.PDF)}
            className="hover:text-violet-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.pdf}
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.TEXT)}
            className="hover:text-violet-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.text}
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.DEVELOPER)}
            className="hover:text-violet-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.developer}
          </button>
          <button
            type="button"
            onClick={handleFaqClick}
            className="hover:text-violet-700 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.faq}
          </button>
        </nav>

        {/* Zone 3: Primary language switch action (+ mobile drawer button on narrow viewports) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label={lang === Language.EN ? 'Switch language to Arabic' : 'تغيير اللغة إلى الإنجليزية'}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 active:scale-[0.99] transition-all duration-150 rounded-lg whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
          >
            <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.nav.switchLangLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-violet-600"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1"
        >
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.IMAGE)}
            className="block w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-800 transition-colors"
          >
            {t.nav.image}
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.PDF)}
            className="block w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-800 transition-colors"
          >
            {t.nav.pdf}
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.TEXT)}
            className="block w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-800 transition-colors"
          >
            {t.nav.text}
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.DEVELOPER)}
            className="block w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-800 transition-colors"
          >
            {t.nav.developer}
          </button>
          <button
            type="button"
            onClick={handleFaqClick}
            className="block w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-800 transition-colors"
          >
            {t.nav.faq}
          </button>
        </nav>
      )}
    </header>
  );
}
