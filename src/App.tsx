/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Clock, History, Search, ShieldCheck, Sparkles, Star, X, Zap } from 'lucide-react';
import { AdSlot } from './components/AdSlot';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { StaticPage } from './components/StaticPage';
import { ToolIcon } from './components/ToolIcon';
import { ToolWorkspace } from './components/ToolWorkspace';
import { TOOLS_CATALOG, UI_STRINGS } from './data/translations';
import { Language, StaticPageId, ToolCategory, ToolId } from './types/tools';

function parseHashRoute(hash: string): {
  toolId: ToolId | null;
  category: ToolCategory;
  pageId: StaticPageId | null;
} {
  const cleaned = hash.replace(/^#\/?/, '');
  if (cleaned.startsWith('page/')) {
    const pageId = cleaned.slice('page/'.length) as StaticPageId;
    if (Object.values(StaticPageId).includes(pageId)) {
      return { toolId: null, category: ToolCategory.ALL, pageId };
    }
  }
  if (cleaned.startsWith('tool/')) {
    const slug = cleaned.slice('tool/'.length) as ToolId;
    const exists = TOOLS_CATALOG.some((t) => t.id === slug);
    if (exists) return { toolId: slug, category: ToolCategory.ALL, pageId: null };
  }
  if (cleaned.startsWith('category/')) {
    const cat = cleaned.slice('category/'.length) as ToolCategory;
    if (Object.values(ToolCategory).includes(cat)) {
      return { toolId: null, category: cat, pageId: null };
    }
  }
  return { toolId: null, category: ToolCategory.ALL, pageId: null };
}

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', content);
}

function setLinkHref(selector: string, href: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('href', href);
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

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lumixa_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('lumixa_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('lumixa_theme', 'light');
      }
    } catch {
      // Ignore storage errors
    }
  }, [darkMode]);

  const initialRoute = parseHashRoute(window.location.hash);
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(initialRoute.toolId);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>(initialRoute.category);
  const [activePageId, setActivePageId] = useState<StaticPageId | null>(initialRoute.pageId);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Favorites & Recently Used Tools
  const [favorites, setFavorites] = useState<ToolId[]>(() => {
    try {
      const saved = localStorage.getItem('lumixa_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentTools, setRecentTools] = useState<ToolId[]>(() => {
    try {
      const saved = localStorage.getItem('lumixa_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: ToolId, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('lumixa_favorites', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const trackRecentTool = (id: ToolId) => {
    setRecentTools((prev) => {
      const filtered = prev.filter((item) => item !== id);
      const next = [id, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('lumixa_recents', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const catalogRef = useRef<HTMLElement>(null);
  const t = UI_STRINGS[lang];
  const isAr = lang === Language.AR;

  // Listen to browser hash navigation (Back / Forward / Direct Links)
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashRoute(window.location.hash);
      setActiveToolId(parsed.toolId);
      setActivePageId(parsed.pageId);
      if (!parsed.toolId && !parsed.pageId) {
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
    const activePage = activePageId ? UI_STRINGS[lang].pages[activePageId] : undefined;

    const pageTitle = activeTool ? activeTool[lang].seoTitle : activePage ? activePage.title : t.siteTitle;
    const pageDesc = activeTool
      ? activeTool[lang].seoDescription
      : activePage
      ? activePage.description
      : t.siteMetaDescription;
    const publicUrl = 'https://lumixa-99t.pages.dev';
    const canonicalUrl = activeTool
      ? `${publicUrl}/tools/${activeTool.id}/`
      : activePageId
      ? `${publicUrl}/#/${`page/${activePageId}`}`
      : `${publicUrl}/`;

    document.title = pageTitle;
    setMetaContent('meta[name="description"]', pageDesc);
    setMetaContent('meta[property="og:title"]', pageTitle);
    setMetaContent('meta[property="og:description"]', pageDesc);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', pageTitle);
    setMetaContent('meta[name="twitter:description"]', pageDesc);
    setLinkHref('link[rel="canonical"]', canonicalUrl);
  }, [lang, activeToolId, activePageId, t]);

  const navigateHome = () => {
    window.location.hash = '/';
    setActiveToolId(null);
    setActivePageId(null);
    setSelectedCategory(ToolCategory.ALL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateCategory = (cat: ToolCategory) => {
    setActiveToolId(null);
    setActivePageId(null);
    setSelectedCategory(cat);
    window.location.hash = cat === ToolCategory.ALL ? '/' : `/category/${cat}`;
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  const navigateToTool = (id: ToolId) => {
    setActivePageId(null);
    trackRecentTool(id);
    window.location.hash = `/tool/${id}`;
    setActiveToolId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPage = (pageId: StaticPageId) => {
    setActiveToolId(null);
    setActivePageId(pageId);
    window.location.hash = `/page/${pageId}`;
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
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        lang={lang}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onToggleLanguage={() => setLang((prev) => (prev === Language.EN ? Language.AR : Language.EN))}
        onNavigateCategory={navigateCategory}
        onNavigateHome={navigateHome}
        onNavigateFaq={navigateToFaq}
      />

      <main className="flex-1">
        {activePageId ? (
          <StaticPage pageId={activePageId} lang={lang} onNavigateHome={navigateHome} />
        ) : activeTool ? (
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
            <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800/80 bg-[radial-gradient(circle_at_80%_10%,rgba(196,181,253,0.34),transparent_34%),linear-gradient(180deg,#f7f4ff_0%,#ffffff_58%,#fafafc_100%)] dark:bg-[radial-gradient(circle_at_80%_10%,rgba(91,33,182,0.25),transparent_40%),linear-gradient(180deg,#0f0c1b_0%,#09090b_60%,#09090b_100%)] pt-12 pb-14 sm:pt-18 sm:pb-20">
              <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
                <div className="text-center lg:text-start">
                <p className="text-xs sm:text-sm font-medium text-violet-800 dark:text-violet-400 tracking-normal">
                  {t.hero.kicker}
                </p>

                <h1 className="mt-4 text-[clamp(2.25rem,4.2vw,3.65rem)] font-bold tracking-[-0.04em] text-slate-950 dark:text-white leading-[1.1]">
                  {t.hero.headline}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg lg:me-auto">
                  {t.hero.subtitle}
                </p>

                {/* Live Search Bar */}
                <div className="mx-auto mt-8 max-w-2xl lg:me-auto">
                  <div className="relative flex items-center rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-[0_14px_36px_rgba(30,15,70,0.10)] ring-1 ring-slate-200/90 dark:ring-slate-800 transition-shadow focus-within:shadow-[0_18px_42px_rgba(109,40,217,0.15)] focus-within:ring-violet-400">
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
                      className="h-14 w-full rounded-2xl border-0 bg-transparent ps-12 pe-12 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 sm:text-base"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label={t.hero.clearSearch}
                        className="absolute end-3 p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  {/* Unboxed Quick Access Links */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 lg:justify-start">
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
                            className="font-medium text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 hover:underline underline-offset-4 transition-colors"
                          >
                            {toolObj[lang].name}
                          </a>
                          {idx < quickTools.length - 1 && (
                            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>

                </div>

                <div className="relative hidden min-h-[300px] lg:block" aria-label="LUMIXA tool highlights">
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-200/70 via-white/70 to-indigo-100/70 dark:from-violet-950/40 dark:via-slate-900/40 dark:to-indigo-950/40 blur-2xl" aria-hidden="true" />
                  <div className="relative mx-auto max-w-sm rounded-[2rem] border border-white/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-[0_24px_60px_rgba(30,15,70,0.14)] backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" aria-hidden="true" /> LUMIXA</div>
                      <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">100% Free</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[quickTools[0], quickTools[1], quickTools[2]].map((qId, index) => {
                        const item = TOOLS_CATALOG.find((tool) => tool.id === qId);
                        if (!item) return null;
                        return <div key={qId} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 p-3 shadow-sm">
                          <span className={`grid h-10 w-10 place-items-center rounded-xl ${index === 0 ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300' : index === 1 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'}`}><ToolIcon name={item.iconName} className="h-4 w-4" /></span>
                          <span className="min-w-0 flex-1"><strong className="block truncate text-sm text-slate-900 dark:text-white">{item[lang].name}</strong><span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{item[lang].formatsLabel}</span></span>
                          {index === 0 ? <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />}
                        </div>;
                      })}
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 px-3 py-2.5 text-xs font-semibold text-violet-800 dark:text-violet-300"><ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" /> {isAr ? 'تعمل مباشرة داخل متصفحك' : 'Works directly in your browser'}</div>
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

              {/* Favorites & Recently Used Tools Quick Bar */}
              {(favorites.length > 0 || recentTools.length > 0) && !searchQuery && selectedCategory === ToolCategory.ALL && (
                <div className="mb-8 space-y-4">
                  {favorites.length > 0 && (
                    <div className="p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-amber-800 dark:text-amber-400">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{isAr ? 'الأدوات المفضلة لديك' : 'Your Favorite Tools'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {favorites.map((favId) => {
                          const favTool = TOOLS_CATALOG.find((t) => t.id === favId);
                          if (!favTool) return null;
                          return (
                            <a
                              key={favId}
                              href={`#/tool/${favId}`}
                              onClick={(e) => {
                                e.preventDefault();
                                navigateToTool(favId);
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-amber-400 transition-colors shadow-xs"
                            >
                              <ToolIcon name={favTool.iconName} className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span>{favTool[lang].name}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {recentTools.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <History className="w-3.5 h-3.5" />
                        {isAr ? 'استُخدمت مؤخراً:' : 'Recently used:'}
                      </span>
                      {recentTools.map((rId) => {
                        const rTool = TOOLS_CATALOG.find((t) => t.id === rId);
                        if (!rTool) return null;
                        return (
                          <a
                            key={rId}
                            href={`#/tool/${rId}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToTool(rId);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/50 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                          >
                            {rTool[lang].name}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Segmented Category Tabs */}
              <div className="mb-8 overflow-x-auto pb-1">
                <div
                  role="tablist"
                  aria-label="Tool Categories"
                  className="inline-flex items-center gap-1 p-1.5 rounded-xl bg-slate-200/70 dark:bg-slate-800"
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
                            : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
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
                <div className="py-16 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t.catalog.noResultsTitle}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
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
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                        className="group flex flex-col justify-between gap-6 rounded-[1.35rem] border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 p-6 shadow-[0_6px_20px_rgba(30,15,70,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-[0_16px_34px_rgba(76,29,149,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 text-violet-700 dark:text-violet-300 transition-all duration-200 group-hover:from-violet-700 group-hover:to-violet-800 group-hover:text-white">
                              <ToolIcon name={tool.iconName} className="w-5 h-5" />
                            </div>

                            {/* Unboxed Metadata Discipline */}
                            <div className="flex max-w-[65%] items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400">
                              <span>{t.categories[tool.category]}</span>
                              <span aria-hidden="true">·</span>
                              <button
                                type="button"
                                onClick={(e) => toggleFavorite(tool.id, e)}
                                title={favorites.includes(tool.id) ? (isAr ? 'إزالة من المفضلة' : 'Remove favorite') : (isAr ? 'إضافة إلى المفضلة' : 'Add to favorites')}
                                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition-colors"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    favorites.includes(tool.id) ? 'fill-amber-400 text-amber-500' : ''
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
                              {content.name}
                            </h3>
                            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                              {content.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold text-violet-700 dark:text-violet-400">
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
            <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white max-w-xl">
                  {t.trustStrip.heading}
                </h2>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {t.trustStrip.items.map((item) => (
                    <div key={item.title} className="space-y-2.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Search-friendly educational content */}
            <section className="border-t border-slate-200/80 dark:border-slate-800/80 bg-[#FAFAFC] dark:bg-slate-950 py-16 transition-colors" aria-labelledby="learn-heading">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="max-w-3xl">
                  <h2 id="learn-heading" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    {isAr ? 'أدوات رقمية مجانية تعمل من متصفحك' : 'Free online tools that work in your browser'}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                    {isAr
                      ? 'تساعدك LUMIXA على ضغط الصور وملفات PDF، تحويل الصيغ، دمج المستندات، إنشاء رموز QR، وتنسيق النصوص والبيانات بسرعة. لا تحتاج الأدوات الأساسية إلى حساب، وتتم معالجة الملفات محلياً في متصفحك كلما كان ذلك ممكناً؛ لذلك تبقى ملفاتك على جهازك أثناء الاستخدام.'
                      : 'LUMIXA helps you compress images and PDFs, convert file formats, merge documents, create QR codes, and clean text or JSON in a few clicks. The core tools do not require an account, and supported files are processed locally in your browser whenever possible so they stay on your device.'}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                    {isAr
                      ? 'للحصول على أفضل نتيجة، اختر الأداة التي تصف المهمة مباشرة ثم راجع المعاينة قبل تنزيل الملف. يمكنك البدء من أدوات ضغط PDF أو تحويل HEIC والصور، أو استخدام عداد الكلمات ومولد كلمات المرور للأعمال اليومية.'
                      : 'For the best result, choose the tool that matches your task and review the preview before downloading. Start with PDF compression, image and HEIC conversion, or use the word counter and password generator for everyday work.'}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-violet-700 dark:text-violet-400">
                  {[
                    [ToolId.PDF_COMPRESSOR, isAr ? 'ضغط ملفات PDF' : 'Compress PDF files'],
                    [ToolId.PDF_TO_IMAGES, isAr ? 'تحويل PDF إلى صور' : 'Convert PDF to images'],
                    [ToolId.IMAGE_COMPRESSOR, isAr ? 'ضغط الصور' : 'Compress images'],
                    [ToolId.PASSWORD_GENERATOR, isAr ? 'مولد كلمات المرور' : 'Password generator'],
                    [ToolId.BASE64_CONVERTER, isAr ? 'محول Base64' : 'Base64 converter'],
                  ].map(([id, label]) => (
                    <a key={id} href={`#/tool/${id}`} onClick={(event) => { event.preventDefault(); navigateToTool(id as ToolId); }} className="underline decoration-violet-200 dark:decoration-violet-800 underline-offset-4 hover:text-violet-900 dark:hover:text-violet-300 hover:decoration-violet-500">
                      {label}
                    </a>
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
        onNavigatePage={navigateToPage}
        onToggleLanguage={() => setLang((prev) => (prev === Language.EN ? Language.AR : Language.EN))}
      />
    </div>
  );
}
