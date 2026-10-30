import { SITE_CONFIG } from '../config/siteConfig';
import { UI_STRINGS } from '../data/translations';
import { Language } from '../types/tools';

interface AdSlotProps {
  lang: Language;
  slotKey: keyof typeof SITE_CONFIG.adSlots;
  className?: string;
}

/**
 * Clean, CLS-safe reserved space for future advertising providers.
 * Displays zero fake ads, loads zero external ad scripts, and makes zero AdSense claims.
 */
export function AdSlot({ lang, slotKey, className = '' }: AdSlotProps) {
  if (!SITE_CONFIG.reserveAdSpaces) return null;

  const slot = SITE_CONFIG.adSlots[slotKey];
  const t = UI_STRINGS[lang].ads;

  return (
    <aside
      aria-label={t.reservedLabel}
      data-ad-slot={slot.slotId}
      className={`w-full max-w-4xl mx-auto ${className}`}
    >
      <div className="min-h-[90px] px-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>{t.reservedLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{slot.dimensionsLabel}</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">{t.nonIntrusiveNote}</p>
      </div>
    </aside>
  );
}
