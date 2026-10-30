import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { UI_STRINGS } from '../data/translations';
import { Language } from '../types/tools';

interface FAQSectionProps {
  lang: Language;
}

export function FAQSection({ lang }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = UI_STRINGS[lang].faq;

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 sm:py-20 border-t border-slate-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {t.heading}
          </h2>
          <p className="mt-3 text-base text-slate-600">{t.subheading}</p>
        </div>

        <div
          className="divide-y divide-slate-200/90 border border-slate-200/90 rounded-2xl bg-white"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          {t.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="p-5 sm:p-6"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 rounded"
                >
                  <span itemProp="name" className="text-base font-semibold text-slate-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-violet-700' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                    className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600"
                  >
                    <p itemProp="text">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
