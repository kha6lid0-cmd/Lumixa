import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronDown, ChevronRight, Home } from 'lucide-react';
import { TOOLS_CATALOG, UI_STRINGS } from '../data/translations';
import { Language, ToolCategory, ToolDefinition, ToolId } from '../types/tools';
import { ToolIcon } from './ToolIcon';
import { Tooltip } from './Tooltip';

export interface BreadcrumbProps {
  tool: ToolDefinition;
  lang: Language;
  onNavigateHome: () => void;
  onNavigateCategory: (category: ToolCategory) => void;
  onSelectTool: (id: ToolId) => void;
}

export function Breadcrumb({
  tool,
  lang,
  onNavigateHome,
  onNavigateCategory,
  onSelectTool,
}: BreadcrumbProps) {
  const isAr = lang === Language.AR;
  const t = UI_STRINGS[lang];
  const content = tool[lang];
  const categoryLabel = t.categories[tool.category];

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close tool switcher menu on outside click or Escape key
  useEffect(() => {
    if (!switcherOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSwitcherOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSwitcherOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [switcherOpen]);

  const categoryTools = TOOLS_CATALOG.filter((item) => item.category === tool.category);
  const switcherTools = categoryTools.length > 1 ? categoryTools : TOOLS_CATALOG;

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <nav
        aria-label={isAr ? 'مسار التنقل' : 'Breadcrumb'}
        className="max-w-6xl mx-auto px-4 sm:px-6 h-9 sm:h-11 flex items-center justify-between gap-3"
      >
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-600 min-w-0"
        >
          {/* 1. Home */}
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center shrink-0"
          >
            <Tooltip content={t.workspace.homeBreadcrumb} align="start">
              <a
                itemProp="item"
                href="#/"
                onClick={(e) => {
                  e.preventDefault();
                  setSwitcherOpen(false);
                  onNavigateHome();
                }}
                className="inline-flex items-center gap-1.5 px-2 py-1 -ms-2 rounded-md text-slate-600 hover:text-violet-700 hover:bg-violet-50/80 transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                <Home className="w-3.5 h-3.5 text-violet-700 shrink-0" aria-hidden="true" />
                <span itemProp="name">{t.workspace.homeBreadcrumb}</span>
              </a>
            </Tooltip>
            <meta itemProp="position" content="1" />
          </li>

          <li aria-hidden="true" className="text-slate-400 shrink-0">
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </li>

          {/* 2. Category */}
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center min-w-0 shrink"
          >
            <Tooltip content={categoryLabel} align="center">
              <a
                itemProp="item"
                href={`#/category/${tool.category}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSwitcherOpen(false);
                  onNavigateCategory(tool.category);
                }}
                className="px-2 py-1 rounded-md text-slate-600 hover:text-violet-700 hover:bg-violet-50/80 transition-colors duration-150 truncate max-w-[110px] sm:max-w-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                <span itemProp="name">{categoryLabel}</span>
              </a>
            </Tooltip>
            <meta itemProp="position" content="2" />
          </li>

          <li aria-hidden="true" className="text-slate-400 shrink-0">
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </li>

          {/* 3. Tool Name + Quick Tool Switcher */}
          <li
            ref={dropdownRef}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            aria-current="page"
            className="relative inline-flex items-center min-w-0"
          >
            <div className="inline-flex items-center rounded-md bg-violet-50/80 border border-violet-200/70 min-w-0">
              <Tooltip content={content.name} align="end" disabled={switcherOpen}>
                <a
                  itemProp="item"
                  href={`#/tool/${tool.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSwitcherOpen(false);
                    onSelectTool(tool.id);
                  }}
                  className="px-2 py-0.5 text-violet-900 font-semibold truncate max-w-[135px] sm:max-w-[260px] hover:text-violet-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded-s-md"
                >
                  <span itemProp="name">{content.name}</span>
                </a>
              </Tooltip>

              <button
                type="button"
                onClick={() => setSwitcherOpen((prev) => !prev)}
                aria-expanded={switcherOpen}
                aria-haspopup="menu"
                aria-label={isAr ? 'تبديل الأداة السريع' : 'Switch tool'}
                className="px-1.5 py-1 border-s border-violet-200/70 text-violet-700 hover:bg-violet-100/80 transition-colors rounded-e-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 shrink-0"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    switcherOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
            <meta itemProp="position" content="3" />

            {/* Sibling Tool Switcher Menu */}
            {switcherOpen && (
              <div
                role="menu"
                aria-label={categoryLabel}
                className="absolute top-full start-0 mt-1.5 w-64 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 z-50"
              >
                <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-100">
                  {categoryTools.length > 1 ? categoryLabel : t.categories[ToolCategory.ALL]}
                </div>
                {switcherTools.map((sibling) => {
                  const isCurrent = sibling.id === tool.id;
                  return (
                    <button
                      key={sibling.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setSwitcherOpen(false);
                        onSelectTool(sibling.id);
                      }}
                      className={`w-full px-3 py-2 flex items-center justify-between gap-2.5 text-start text-xs transition-colors ${
                        isCurrent
                          ? 'bg-violet-50 text-violet-800 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-violet-700'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 min-w-0">
                        <ToolIcon
                          name={sibling.iconName}
                          className="w-3.5 h-3.5 text-violet-700 shrink-0"
                        />
                        <span className="truncate">{sibling[lang].name}</span>
                      </span>
                      {isCurrent && (
                        <Check className="w-3.5 h-3.5 text-violet-700 shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </li>
        </ol>

        {/* Secondary Back-to-Directory Link on Tablet/Desktop */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            setSwitcherOpen(false);
            onNavigateHome();
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-violet-700 hover:text-violet-900 hover:bg-violet-50/80 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
          <span>{t.workspace.backToAll}</span>
        </a>
      </nav>
    </div>
  );
}
