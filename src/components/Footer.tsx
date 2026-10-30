import { UI_STRINGS } from '../data/translations';
import { Language, ToolCategory } from '../types/tools';

interface FooterProps {
  lang: Language;
  onNavigateCategory: (category: ToolCategory) => void;
  onNavigateHome: () => void;
  onNavigateFaq: () => void;
  onToggleLanguage: () => void;
}

export function Footer({
  lang,
  onNavigateCategory,
  onNavigateHome,
  onNavigateFaq,
  onToggleLanguage,
}: FooterProps) {
  const t = UI_STRINGS[lang];

  return (
    <footer className="bg-white border-t border-slate-200/90 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          <div className="md:col-span-5">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
              }}
              className="text-lg font-bold tracking-tight text-violet-800"
            >
              LUMIXA
            </a>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 max-w-sm">
              {t.footer.tagline}
            </p>
            <p className="mt-4 text-xs text-slate-500">{t.footer.freeForeverNote}</p>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-slate-900">{t.footer.categoriesHeading}</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory(ToolCategory.IMAGE)}
                  className="hover:text-violet-700 transition-colors"
                >
                  {t.categories[ToolCategory.IMAGE]}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory(ToolCategory.PDF)}
                  className="hover:text-violet-700 transition-colors"
                >
                  {t.categories[ToolCategory.PDF]}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory(ToolCategory.TEXT)}
                  className="hover:text-violet-700 transition-colors"
                >
                  {t.categories[ToolCategory.TEXT]}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory(ToolCategory.DEVELOPER)}
                  className="hover:text-violet-700 transition-colors"
                >
                  {t.categories[ToolCategory.DEVELOPER]}
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900">{t.footer.resourcesHeading}</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={onNavigateFaq}
                  className="hover:text-violet-700 transition-colors"
                >
                  {t.nav.faq}
                </button>
              </li>
              <li>
                <a
                  href="./sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet-700 transition-colors"
                >
                  {t.footer.sitemapLink}
                </a>
              </li>
              <li>
                <a
                  href="./robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet-700 transition-colors"
                >
                  {t.footer.robotsLink}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onToggleLanguage}
                  className="hover:text-violet-700 transition-colors font-medium text-violet-700"
                >
                  {t.nav.switchLangLabel}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t.footer.copyright}</p>
          <p>LUMIXA · English &amp; العربية</p>
        </div>
      </div>
    </footer>
  );
}
