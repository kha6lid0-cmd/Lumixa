/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { AdSlot } from './components/AdSlot';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ToolIcon } from './components/ToolIcon';
import { ToolWorkspace } from './components/ToolWorkspace';
import { TOOLS_CATALOG, UI_STRINGS } from './data/translations';
import { Language, ToolCategory, ToolId } from './types/tools';

function parseHashRoute(hash: string): { toolId: ToolId | null; category: ToolCategory } {
  const cleaned = hash.replace(/^#\/?/, '');
  if (cleaned.startsWith('tool/')) {
    const slug = cleaned.slice('tool/'.length) as ToolId;
    const exists = TOOLS_CATALOG.some((t) => t.id === slug);
    if (exists) return { toolId: slug, category: ToolCategory.ALL };
  }
  if (cleaned.startsWith('category/')) {
    const cat = cleaned.slice('category/'.length) as ToolCategory;
    if (Object.values(ToolCategory).includes(cat)) {
      return { toolId: null, category: cat };
    }
  }
  return { toolId: null, category: ToolCategory.ALL };
}

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', content);
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('lumixa_lang');
      if (saved === Language.AR || saved === Language.EN) return saved;
    } catch {
      // Ignore storage access errors in strict privacy browsers
    }
    return Language.EN;
  });

  const initialRoute = parseHashRoute(window.location.hash);
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(initialRoute.toolId);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>(initialRoute.category);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const catalogRef = useRef<HTMLElement>(null);
  const t = UI_STRINGS[lang];
  const isAr = lang === Language.AR;

  // Listen to browser hash navigation (Back / Forward / Direct Links)
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashRoute(window.location.hash);
      setActiveToolId(parsed.toolId);
      if (!parsed.toolId) {
        setSelectedCategory(parsed.category);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Synchronize document language, RTL/LTR direction, and SEO metadata
  useEffect(() => {
    const htmlEl = document.documentElement;
    htmlEl.lang = lang;
    htmlEl.dir = lang === Language.AR ? 'rtl' : 'ltr';

    try {
      localStorage.setItem('lumixa_lang', lang);
    } catch {
      // Ignore storage restrictions
    }

    const activeTool = activeToolId
      ? TOOLS_CATALOG.find((item) => item.id === activeToolId)
      : undefined;

    const pageTitle = activeTool ? activeTool[lang].seoTitle : t.siteTitle;
    const pageDesc = activeTool ? activeTool[lang].seoDescription : t.siteMetaDescription;

    document.title = pageTitle;
    setMetaContent('meta[name="description"]', pageDesc);
    setMetaContent('meta[property="og:title"]', pageTitle);
    setMetaContent('meta[property="og:description"]', pageDesc);
    setMetaContent('meta[name="twitter:title"]', pageTitle);
    setMetaContent('meta[name="twitter:description"]', pageDesc);
  }, [lang, activeToolId, t]);

  const navigateHome = () => {
    window.location.hash = '/';
    setActiveToolId(null);
    setSelectedCategory(ToolCategory.ALL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateCategory = (cat: ToolCategory) => {
    setActiveToolId(null);
    setSelectedCategory(cat);
    window.location.hash = cat === ToolCategory.ALL ? '/' : `/category/${cat}`;
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  const navigateToTool = (id: ToolId) => {
    window.location.hash = `/tool/${id}`;
    setActiveToolId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToFaq = () => {
    if (activeToolId) {
      window.location.hash = '/';
      setActiveToolId(null);
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TOOLS_CATALOG.filter((tool) => {
      const matchesCat =
        selectedCategory === ToolCategory.ALL || tool.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;

      const enMatch =
        tool.en.name.toLowerCase().includes(q) ||
        tool.en.shortDescription.toLowerCase().includes(q) ||
        tool.en.keywords.some((k) => k.toLowerCase().includes(q));
      const arMatch =
        tool.ar.name.toLowerCase().includes(q) ||
        tool.ar.shortDescription.toLowerCase().includes(q) ||
        tool.ar.keywords.some((k) => k.toLowerCase().includes(q));

      return enMatch || arMatch;
    });
  }, [selectedCategory, searchQuery]);

  const activeTool = useMemo(
    () => (activeToolId ? TOOLS_CATALOG.find((item) => item.id === activeToolId) ?? null : null),
    [activeToolId]
  );

  const quickTools = useMemo(
    () => [
      ToolId.IMAGE_COMPRESSOR,
      ToolId.PDF_MERGER,
      ToolId.QR_GENERATOR,
      ToolId.JSON_FORMATTER,
    ],
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-900">
      <Header
        lang={lang}
        onToggleLanguage={() => setLang((prev) => (prev === Language.EN ? Language.AR : Language.EN))}
        onNavigateCategory={navigateCategory}
        onNavigateHome={navigateHome}
        onNavigateFaq={navigateToFaq}
      />

      <main className="flex-1">
        {activeTool ? (
          <ToolWorkspace
            tool={activeTool}
            lang={lang}
            onNavigateHome={navigateHome}
            onNavigateCategory={navigateCategory}
            onSelectTool={navigateToTool}
          />
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-violet-50/75 via-white to-[#FAFAFC] border-b border-slate-200/70 pt-14 pb-16 sm:pt-20 sm:pb-22">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <p className="text-xs sm:text-sm font-medium text-violet-800 tracking-normal">
                  {t.hero.kicker}
                </p>

                <h1 className="mt-4 text-[clamp(2.25rem,4.2vw,3.65rem)] font-bold tracking-tight text-slate-950 leading-[1.14]">
                  {t.hero.headline}
                </h1>

                <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  {t.hero.subtitle}
                </p>

                {/* Live Search Bar */}
                <div className="mt-8 max-w-2xl mx-auto">
                  <div className="relative flex items-center">
                    <Search
                      className="w-5 h-5 text-slate-400 absolute start-4 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (selectedCategory !== ToolCategory.ALL && e.target.value.trim()) {
                          setSelectedCategory(ToolCategory.ALL);
                        }
                      }}
                      aria-label={t.hero.searchPlaceholder}
                      placeholder={t.hero.searchPlaceholder}
                      className="w-full h-14 ps-12 pe-12 rounded-2xl border border-slate-300 bg-white text-sm sm:text-base text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 focus:outline-none transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label={t.hero.clearSearch}
                        className="absolute end-3 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  {/* Unboxed Quick Access Links */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
                    <span>{t.hero.popularLabel}</span>
                    {quickTools.map((qId, idx) => {
                      const toolObj = TOOLS_CATALOG.find((item) => item.id === qId);
                      if (!toolObj) return null;
                      return (
                        <span key={qId} className="inline-flex items-center gap-3">
                          <a
                            href={`#/tool/${qId}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToTool(qId);
                            }}
                            className="font-medium text-violet-700 hover:text-violet-900 hover:underline underline-offset-4 transition-colors"
                          >
                            {toolObj[lang].name}
                          </a>
                          {idx < quickTools.length - 1 && (
                            <span className="text-slate-300" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Tool Catalog Directory */}
            <section
              ref={catalogRef}
              id="tools"
              aria-labelledby="catalog-heading"
              className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <h2
                    id="catalog-heading"
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                  >
                    {t.catalog.heading}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-600">{t.catalog.subheading}</p>
                </div>

                <p className="text-xs font-mono tabular-nums text-slate-500 shrink-0">
                  {t.catalog.toolsCount(filteredTools.length)}
                </p>
              </div>

              {/* Interactive Segmented Category Tabs */}
              <div className="mb-8 overflow-x-auto pb-1">
                <div
                  role="tablist"
                  aria-label="Tool Categories"
                  className="inline-flex items-center gap-1 p-1.5 rounded-xl bg-slate-200/70"
                >
                  {(
                    [
                      ToolCategory.ALL,
                      ToolCategory.IMAGE,
                      ToolCategory.PDF,
                      ToolCategory.TEXT,
                      ToolCategory.DEVELOPER,
                    ] as ToolCategory[]
                  ).map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-violet-700 text-white shadow-xs'
                            : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
                        }`}
                      >
                        {t.categories[cat]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Category Context Description */}
              {selectedCategory !== ToolCategory.ALL && (
                <p className="mb-6 text-sm text-slate-600">
                  {t.categoryDescriptions[selectedCategory]}
                </p>
              )}

              {/* Tool Cards Grid */}
              {filteredTools.length === 0 ? (
                <div className="py-16 px-6 rounded-2xl border border-slate-200 bg-white text-center">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {t.catalog.noResultsTitle}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                    {t.catalog.noResultsBody}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(ToolCategory.ALL);
                    }}
                    className="mt-5 px-5 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    {t.catalog.resetFilters}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTools.map((tool) => {
                    const content = tool[lang];
                    return (
                      <a
                        key={tool.id}
                        href={`#/tool/${tool.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToTool(tool.id);
                        }}
                        className="group bg-white border border-slate-200/90 hover:border-violet-500 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-700 group-hover:bg-violet-700 group-hover:text-white transition-colors duration-150 flex items-center justify-center shrink-0">
                              <ToolIcon name={tool.iconName} className="w-5 h-5" />
                            </div>

                            {/* Unboxed Metadata Discipline */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                              <span>{t.categories[tool.category]}</span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate">{content.formatsLabel}</span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                              {content.name}
                            </h3>
                            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                              {content.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-violet-700">
                          <span>{t.catalog.openTool}</span>
                          <ArrowRight
                            className={`w-4 h-4 transition-transform duration-150 ${
                              isAr
                                ? 'rotate-180 group-hover:-translate-x-1'
                                : 'group-hover:translate-x-1'
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Non-Intrusive Reserved Advertisement Space */}
            <div className="px-4 sm:px-6 pb-8">
              <AdSlot lang={lang} slotKey="homeLeaderboard" />
            </div>

            {/* Platform Principles / Local Privacy Proof Section */}
            <section className="py-16 bg-white border-t border-slate-200/80">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 max-w-xl">
                  {t.trustStrip.heading}
                </h2>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {t.trustStrip.items.map((item) => (
                    <div key={item.title} className="space-y-2.5">
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <FAQSection lang={lang} />
          </>
        )}
      </main>

      <Footer
        lang={lang}
        onNavigateCategory={navigateCategory}
        onNavigateHome={navigateHome}
        onNavigateFaq={navigateToFaq}
        onToggleLanguage={() => setLang((prev) => (prev === Language.EN ? Language.AR : Language.EN))}
      />
    </div>
  );
}
