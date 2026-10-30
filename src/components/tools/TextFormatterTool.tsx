import { useState } from 'react';
import { Check, Copy, RotateCcw, Trash2 } from 'lucide-react';
import { Language } from '../../types/tools';

interface Props {
  lang: Language;
}

function toTitleCase(str: string): string {
  return str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

export function TextFormatterTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const [text, setText] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const applyTransform = (fn: (current: string) => string, label: string) => {
    if (!text) return;
    const next = fn(text);
    if (next !== text) {
      setHistory((prev) => [...prev.slice(-9), text]);
      setText(next);
    }
    setStatusMessage(label);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setText(previous);
    setStatusMessage(isAr ? 'تم التراجع عن آخر تعديل' : 'Reverted last change');
  };

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const messySample = isAr
    ? '   مرحباً    بكم   في   منصة   LUMIXA   للأدوات   الرقمية.  \n\n\n\n   هذا   السطر   يحتوي   على    مسافات    زائدة   وأسطر   فارغة.  \n   welcome to lumixa free digital tools   '
    : '   welcome    to   LUMIXA   digital   tools   platform.  \n\n\n\n   this   paragraph   has    extra    spaces   and   empty   lines.   \n   clean and format your text in one click!   ';

  return (
    <div className="space-y-5">
      {/* Whitespace & Line Cleanup Controls */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-2">
            {isAr ? 'تنظيف المسافات والأسطر' : 'Whitespace & Line Cleanup'}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                applyTransform(
                  (s) =>
                    s
                      .split(/\r?\n/)
                      .map((line) => line.replace(/[ \t]+/g, ' ').trim())
                      .join('\n'),
                  isAr ? 'تمت إزالة المسافات الزائدة' : 'Removed extra spaces'
                )
              }
              className="px-3.5 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              {isAr ? 'إزالة المسافات الزائدة' : 'Remove Extra Spaces'}
            </button>

            <button
              type="button"
              onClick={() =>
                applyTransform(
                  (s) =>
                    s
                      .split(/\r?\n/)
                      .filter((line) => line.trim().length > 0)
                      .join('\n'),
                  isAr ? 'تم حذف الأسطر الفارغة' : 'Removed empty lines'
                )
              }
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:border-violet-400 text-slate-800 text-xs font-medium transition-colors whitespace-nowrap"
            >
              {isAr ? 'إزالة الأسطر الفارغة' : 'Remove Empty Lines'}
            </button>

            <button
              type="button"
              onClick={() =>
                applyTransform(
                  (s) =>
                    s
                      .split(/\r?\n/)
                      .map((line) => line.replace(/[ \t]+/g, ' ').trim())
                      .filter((line) => line.length > 0)
                      .join('\n'),
                  isAr ? 'تم تنظيف النص بالكامل' : 'Cleaned spaces & blank lines'
                )
              }
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:border-violet-400 text-slate-800 text-xs font-medium transition-colors whitespace-nowrap"
            >
              {isAr ? 'تنظيف شامل (مسافات + أسطر)' : 'Clean All (Spaces + Blank Lines)'}
            </button>

            <button
              type="button"
              onClick={() =>
                applyTransform(
                  (s) => Array.from(new Set(s.split(/\r?\n/))).join('\n'),
                  isAr ? 'تمت إزالة الأسطر المكررة' : 'Removed duplicate lines'
                )
              }
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:border-violet-400 text-slate-800 text-xs font-medium transition-colors whitespace-nowrap"
            >
              {isAr ? 'حذف الأسطر المكررة' : 'Remove Duplicate Lines'}
            </button>

            <button
              type="button"
              onClick={() =>
                applyTransform(
                  (s) =>
                    s
                      .split(/\r?\n/)
                      .sort((a, b) => a.localeCompare(b, isAr ? 'ar' : 'en'))
                      .join('\n'),
                  isAr ? 'تم ترتيب الأسطر أبجدياً' : 'Sorted lines A–Z'
                )
              }
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:border-violet-400 text-slate-800 text-xs font-medium transition-colors whitespace-nowrap"
            >
              {isAr ? 'ترتيب الأسطر أبجدياً' : 'Sort Lines A–Z'}
            </button>
          </div>
        </div>

        {/* Capitalization Controls */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-700">
              {isAr
                ? 'حالة الأحرف (تُطبّق على الأحرف اللاتينية/الإنجليزية)'
                : 'Text Capitalization'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                applyTransform((s) => s.toUpperCase(), isAr ? 'أحرف كبيرة UPPERCASE' : 'Converted to UPPERCASE')
              }
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:border-violet-400 text-slate-800 text-xs font-medium transition-colors whitespace-nowrap"
            >
              UPPERCASE
            </button>
            <button
              type="button"
              onClick={() =>
                applyTransform((s) => s.toLowerCase(), isAr ? 'أحرف صغيرة lowercase' : 'Converted to lowercase')
              }
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:border-violet-400 text-slate-800 text-xs font-medium transition-colors whitespace-nowrap"
            >
              lowercase
            </button>
            <button
              type="button"
              onClick={() =>
                applyTransform(toTitleCase, isAr ? 'حرف كبير لكل كلمة Title Case' : 'Converted to Title Case')
              }
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:border-violet-400 text-slate-800 text-xs font-medium transition-colors whitespace-nowrap"
            >
              Title Case
            </button>
            <button
              type="button"
              onClick={() =>
                applyTransform(
                  toSentenceCase,
                  isAr ? 'حرف كبير لبداية الجملة Sentence case' : 'Converted to Sentence case'
                )
              }
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:border-violet-400 text-slate-800 text-xs font-medium transition-colors whitespace-nowrap"
            >
              Sentence case
            </button>
          </div>
        </div>
      </div>

      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => {
              setHistory([]);
              setText(messySample);
              setStatusMessage('');
            }}
            className="font-medium text-violet-700 hover:underline"
          >
            {isAr ? 'تجربة نص غير منسق' : 'Load Messy Sample'}
          </button>
          {statusMessage && (
            <>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">{statusMessage}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={history.length === 0}
            onClick={handleUndo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-medium text-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isAr ? 'تراجع' : 'Undo'}</span>
          </button>

          <button
            type="button"
            disabled={!text}
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-700 hover:bg-violet-800 disabled:opacity-40 text-xs font-semibold text-white transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ النتيجة' : 'Copy Output'}</span>
          </button>

          <button
            type="button"
            disabled={!text}
            onClick={() => {
              setHistory((prev) => [...prev.slice(-9), text]);
              setText('');
              setStatusMessage('');
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-700 disabled:opacity-40 text-xs font-medium text-slate-600 transition-colors"
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
            ? 'الصق النص هنا لإزالة المسافات الزائدة أو الأسطر الفارغة أو تنسيق الأحرف...'
            : 'Paste messy text here to strip extra spaces, delete empty lines, or convert case...'
        }
        className="w-full rounded-xl border border-slate-300 bg-white p-4 text-sm sm:text-base leading-relaxed text-slate-900 focus:border-violet-600 focus:outline-none"
      />
    </div>
  );
}
