import { useState } from 'react';
import { Copy, Check, Sparkles, RotateCcw } from 'lucide-react';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';

interface ArabicTextCleanerToolProps {
  lang: Language;
}

export function ArabicTextCleanerTool({ lang }: ArabicTextCleanerToolProps) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Tashkeel / Harakat regex pattern
  const TASHKEEL_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
  // Tatweel / Kashida regex pattern
  const TATWEEL_REGEX = /\u0640/g;

  const handleRemoveTashkeel = () => {
    const cleaned = (output || input).replace(TASHKEEL_REGEX, '');
    setOutput(cleaned);
    reportStatus({
      fileStatus: isAr ? 'تم حذف التشكيل' : 'Diacritics removed',
      actionStatus: '',
      isBusy: false,
    });
  };

  const handleRemoveTatweel = () => {
    const cleaned = (output || input).replace(TATWEEL_REGEX, '');
    setOutput(cleaned);
    reportStatus({
      fileStatus: isAr ? 'تم حذف التطويل (الكشيدة)' : 'Tatweel removed',
      actionStatus: '',
      isBusy: false,
    });
  };

  const handleNormalizeAlef = () => {
    // Replace أ, إ, آ, ٱ with ا
    const cleaned = (output || input).replace(/[أإآٱ]/g, 'ا');
    setOutput(cleaned);
    reportStatus({
      fileStatus: isAr ? 'تم توحيد الألفات' : 'Alefs normalized',
      actionStatus: '',
      isBusy: false,
    });
  };

  const handleNormalizeYaa = () => {
    // Replace ى with ي
    const cleaned = (output || input).replace(/ى/g, 'ي');
    setOutput(cleaned);
    reportStatus({
      fileStatus: isAr ? 'تم تحويل الألف المقصورة (ى) إلى ياء (ي)' : 'Yaa normalized',
      actionStatus: '',
      isBusy: false,
    });
  };

  const handleNormalizeTaMarbuta = () => {
    // Replace ة with ه
    const cleaned = (output || input).replace(/ة/g, 'ه');
    setOutput(cleaned);
    reportStatus({
      fileStatus: isAr ? 'تم تحويل التاء المربوطة (ة) إلى هاء (ه)' : 'Ta-Marbuta normalized',
      actionStatus: '',
      isBusy: false,
    });
  };

  const handleCleanAll = () => {
    let text = input;
    // Remove Tashkeel
    text = text.replace(TASHKEEL_REGEX, '');
    // Remove Tatweel
    text = text.replace(TATWEEL_REGEX, '');
    // Normalize Alef
    text = text.replace(/[أإآٱ]/g, 'ا');
    // Normalize multiple spaces
    text = text.replace(/[ \t]+/g, ' ');
    setOutput(text);
    reportStatus({
      fileStatus: isAr ? 'تم التنظيف الشامل للنص' : 'Comprehensive clean applied',
      actionStatus: '',
      isBusy: false,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    const sample = 'مَنَصَّةُ لُومِيكْسَا — أَدَوَاتٌ رَقَمِيَّةٌ مَجَّانِيَّةٌ تَــعْـمَـلُ بِـسُـرْعَـةٍ وَأَمَـانٍ دَاخِـلَ مُتَصَفِّحِكَ!';
    setInput(sample);
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCleanAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'تنظيف شامل بضغطة زر' : 'Full Clean in One-Click'}</span>
          </button>
          <button
            type="button"
            onClick={handleRemoveTashkeel}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
          >
            {isAr ? 'حذف التشكيل (الحركات)' : 'Remove Diacritics'}
          </button>
          <button
            type="button"
            onClick={handleRemoveTatweel}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
          >
            {isAr ? 'حذف الكشيدة (التطويل)' : 'Remove Tatweel'}
          </button>
          <button
            type="button"
            onClick={handleNormalizeAlef}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
          >
            {isAr ? 'توحيد الألف (أ إ آ ← ا)' : 'Normalize Alef'}
          </button>
          <button
            type="button"
            onClick={handleNormalizeYaa}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
          >
            {isAr ? 'توحيد الياء (ى ← ي)' : 'Normalize Yaa'}
          </button>
          <button
            type="button"
            onClick={handleNormalizeTaMarbuta}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
          >
            {isAr ? 'تحويل (ة ← ه)' : 'Ta-Marbuta to Haa'}
          </button>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="text-xs text-violet-700 hover:underline font-medium"
        >
          {isAr ? 'تجربة نص مشكل' : 'Try sample text'}
        </button>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{isAr ? 'النص العربي المدخل:' : 'Input Arabic Text:'}</span>
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput('');
                  setOutput('');
                }}
                className="text-slate-400 hover:text-rose-600 inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isAr ? 'مسح' : 'Clear'}</span>
              </button>
            )}
          </div>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAr ? 'اكتب أو الصق النص العربي هنا...' : 'Paste Arabic text here...'}
            dir="rtl"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-base leading-relaxed focus:border-violet-500 focus:outline-none dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{isAr ? 'النص بعد المعالجة والتنظيف:' : 'Cleaned Text Output:'}</span>
            {(output || input) && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ' : 'Copy'}</span>
              </button>
            )}
          </div>
          <textarea
            rows={10}
            readOnly
            value={output || input}
            placeholder={isAr ? 'ستظهر النتيجة المنظفة هنا...' : 'Cleaned output will appear here...'}
            dir="rtl"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-base leading-relaxed focus:outline-none dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}
