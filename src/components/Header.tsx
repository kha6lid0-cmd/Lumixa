import { useState } from 'react';
import { FileStack, Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { UI_STRINGS } from '../data/translations';
import { Language, ToolCategory } from '../types/tools';

interface HeaderProps {
  lang: Language;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleLanguage: () => void;
  onNavigateCategory: (category: ToolCategory) => void;
  onNavigateHome: () => void;
  onNavigateFaq: () => void;
}

export function Header({
  lang,
  darkMode,
  onToggleDarkMode,
  onToggleLanguage,
  onNavigateCategory,
  onNavigateHome,
  onNavigateFaq,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_STRINGS[lang];
  const isAr = lang === Language.AR;

  const handleCategoryClick = (cat: ToolCategory) => {
    setMobileMenuOpen(false);
    onNavigateCategory(cat);
  };

  const handleFaqClick = () => {
    setMobileMenuOpen(false);
    onNavigateFaq();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 shadow-[0_1px_16px_rgba(30,15,70,0.04)] backdrop-blur-xl transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-[4.25rem] flex items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            onNavigateHome();
          }}
          className="group inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-950 dark:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600 rounded"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-900 text-white shadow-[0_6px_14px_rgba(109,40,217,0.24)] transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105" aria-hidden="true">
            <FileStack className="h-4 w-4" strokeWidth={2.2} />
          </span>
          LUMIXA
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.IMAGE)}
            className="hover:text-violet-700 dark:hover:text-violet-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.image}
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.PDF)}
            className="hover:text-violet-700 dark:hover:text-violet-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.pdf}
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.TEXT)}
            className="hover:text-violet-700 dark:hover:text-violet-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.text}
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick(ToolCategory.DEVELOPER)}
            className="hover:text-violet-700 dark:hover:text-violet-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.developer}
          </button>
          <button
            type="button"
            onClick={handleFaqClick}
            className="hover:text-violet-700 dark:hover:text-violet-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
          >
            {t.nav.faq}
          </button>
        </nav>

        {/* Zone 3: Actions (Theme switch + Language switch + Mobile drawer button) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-violet-600"
            title={darkMode ? (isAr ? 'الوضع النهاري' : 'Light Mode') : (isAr ? 'الوضع الليلي' : 'Dark Mode')}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label={lang === Language.EN ? 'Switch language to Arabic' : 'تغيير اللغة إلى الإنجليزية'}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-700 to-violet-800 hover:from-violet-800 hover:to-violet-900 active:scale-[0.99] transition-all duration-150 rounded-xl whitespace-nowrap shrink-0 shadow-[0_5px_12px_rgba(109,40,217,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
          >
            <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">{t.nav.switchLangLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-violet-600"
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
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1"
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
