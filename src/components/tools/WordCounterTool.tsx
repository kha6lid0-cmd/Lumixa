import { useMemo, useState } from 'react';
import { Check, Copy, Trash2 } from 'lucide-react';
import { Language } from '../../types/tools';

interface Props {
  lang: Language;
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'that',
  'with',
  'this',
  'from',
  'are',
  'was',
  'were',
  'have',
  'has',
  'not',
  'but',
  'you',
  'your',
  'من',
  'في',
  'على',
  'إلى',
  'عن',
  'مع',
  'هذا',
  'هذه',
  'التي',
  'الذي',
  'ان',
  'أن',
  'أو',
  'ما',
  'لا',
]);

export function WordCounterTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const words = wordsArray.length;
    const characters = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;

    const sentences = trimmed
      ? trimmed
          .split(/[.!?؟]+/)
          .map((s) => s.trim())
          .filter(Boolean).length
      : 0;

    const paragraphs = trimmed
      ? trimmed
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean).length
      : 0;

    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const readingMinutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));

    // Top keyword frequency
    const freqMap = new Map<string, number>();
    for (const raw of wordsArray) {
      const cleaned = raw
        .toLowerCase()
        .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
      if (cleaned.length >= 3 && !STOP_WORDS.has(cleaned)) {
        freqMap.set(cleaned, (freqMap.get(cleaned) ?? 0) + 1);
      }
    }
    const topWords = Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      words,
      characters,
      charsNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingMinutes,
      topWords,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const sampleText = isAr
    ? 'منصة LUMIXA توفر مجموعة متكاملة من الأدوات الرقمية المجانية لمعالجة الصور وملفات PDF والنصوص مباشرة داخل متصفحك. تبقى جميع ملفاتك آمنة على جهازك الشخصي دون الحاجة لإنشاء حساب أو اشتراك مدفوع.'
    : 'LUMIXA provides a complete collection of free browser-side digital utilities for image optimization, PDF merging and splitting, text cleaning, and JSON validation. Every file stays private on your own device without sign-ups or subscriptions.';

  return (
    <div className="space-y-6">
      {/* Live Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: isAr ? 'الكلمات' : 'Words', value: stats.words },
          { label: isAr ? 'الحروف' : 'Characters', value: stats.characters },
          { label: isAr ? 'بدون مسافات' : 'No Spaces', value: stats.charsNoSpaces },
          { label: isAr ? 'الجمل' : 'Sentences', value: stats.sentences },
          { label: isAr ? 'الفقرات' : 'Paragraphs', value: stats.paragraphs },
          {
            label: isAr ? 'وقت القراءة' : 'Reading Time',
            value:
              stats.words === 0
                ? '0m'
                : isAr
                ? `${stats.readingMinutes} د`
                : `~${stats.readingMinutes}m`,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-start"
          >
            <p className="text-xs text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Textarea Toolbar & Input */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setText(sampleText)}
              className="font-medium text-violet-700 hover:underline"
            >
              {isAr ? 'إدراج نص تجريبي' : 'Insert Sample Text'}
            </button>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-500 font-mono tabular-nums">
              {stats.lines} {isAr ? 'أسطر' : stats.lines === 1 ? 'line' : 'lines'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!text}
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-medium text-slate-700 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'نسخ النص' : 'Copy'}</span>
            </button>

            <button
              type="button"
              disabled={!text}
              onClick={() => setText('')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-700 disabled:opacity-40 text-xs font-medium text-slate-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAr ? 'مسح' : 'Clear'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isAr
              ? 'اكتب أو الصق النص هنا لحساب الكلمات والحروف والجمل فوراً...'
              : 'Type or paste your text here for instant word, character, and reading time analysis...'
          }
          className="w-full rounded-xl border border-slate-300 bg-white p-4 text-sm sm:text-base leading-relaxed text-slate-900 focus:border-violet-600 focus:outline-none"
        />
      </div>

      {/* Top Keyword Density */}
      {stats.topWords.length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-xs font-semibold text-slate-700 mb-3">
            {isAr ? 'الكلمات الأكثر تكراراً' : 'Most Frequent Keywords'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {stats.topWords.map(([word, count]) => (
              <div
                key={word}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2 text-xs"
              >
                <span className="font-medium text-slate-800 truncate" dir="auto">
                  {word}
                </span>
                <span className="font-mono tabular-nums font-semibold text-violet-700">
                  {count}×
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
