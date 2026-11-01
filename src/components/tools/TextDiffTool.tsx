import { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, Columns2, Rows2 } from 'lucide-react';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';

interface TextDiffToolProps {
  lang: Language;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  leftLineNum?: number;
  rightLineNum?: number;
}

export function TextDiffTool({ lang }: TextDiffToolProps) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simple line-by-line diff computation (LCS based)
  const diffLines = useMemo<DiffLine[]>(() => {
    if (!text1 && !text2) return [];

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    // LCS Table
    const m = lines1.length;
    const n = lines2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    const normalize = (s: string) => (ignoreWhitespace ? s.trim() : s);

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (normalize(lines1[i]) === normalize(lines2[j])) {
          dp[i + 1][j + 1] = dp[i][j] + 1;
        } else {
          dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    // Backtrack to find diff
    const result: DiffLine[] = [];
    let i = m;
    let j = n;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && normalize(lines1[i - 1]) === normalize(lines2[j - 1])) {
        result.unshift({
          type: 'unchanged',
          content: lines1[i - 1],
          leftLineNum: i,
          rightLineNum: j,
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({
          type: 'added',
          content: lines2[j - 1],
          rightLineNum: j,
        });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        result.unshift({
          type: 'removed',
          content: lines1[i - 1],
          leftLineNum: i,
        });
        i--;
      }
    }

    return result;
  }, [text1, text2, ignoreWhitespace]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const line of diffLines) {
      if (line.type === 'added') added++;
      if (line.type === 'removed') removed++;
    }
    return { added, removed };
  }, [diffLines]);

  const handleClear = () => {
    setText1('');
    setText2('');
    reportStatus({
      fileStatus: isAr ? 'تم مسح النصوص' : 'Texts cleared',
      actionStatus: '',
      isBusy: false,
    });
  };

  const handleLoadSample = () => {
    setText1(
      isAr
        ? 'منصة لوميكسا تقدم أدوات مجانية.\nالمعالجة تتم في الخادم.\nتدعم العربية والإنجليزية.'
        : 'LUMIXA provides free digital tools.\nProcessing happens on server.\nSupports English and Arabic.'
    );
    setText2(
      isAr
        ? 'منصة لوميكسا تقدم أدوات مجانية وسريعة.\nالمعالجة تتم محلياً في المتصفح بخصوصية تامة.\nتدعم العربية والإنجليزية.\nلا حاجة للتسجيل.'
        : 'LUMIXA provides fast and free digital tools.\nProcessing happens locally in browser with privacy.\nSupports English and Arabic.\nNo registration required.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'جنباً إلى جنب' : 'Side-by-Side'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'unified'
                  ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Rows2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'عرض مدمج' : 'Unified'}</span>
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer ms-2">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <span>{isAr ? 'تجاهل المسافات الفارغة' : 'Ignore Whitespace'}</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {(diffLines.length > 0) && (
            <div className="flex items-center gap-2 text-xs font-mono me-2">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">+{stats.added}</span>
              <span className="text-rose-700 dark:text-rose-400 font-semibold">-{stats.removed}</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
          >
            {isAr ? 'تجربة نص تجريبي' : 'Load Sample'}
          </button>
          {(text1 || text2) && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'مسح' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{isAr ? 'النص الأصلي (قبل):' : 'Original Text (Before):'}</span>
            <span className="text-slate-400 font-mono">{text1.split('\n').length} {isAr ? 'أسطر' : 'lines'}</span>
          </div>
          <textarea
            rows={8}
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder={isAr ? 'الصق النص الأصلي هنا...' : 'Paste original text here...'}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm font-mono focus:border-violet-500 focus:outline-none dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{isAr ? 'النص المعدل (بعد):' : 'Modified Text (After):'}</span>
            <span className="text-slate-400 font-mono">{text2.split('\n').length} {isAr ? 'أسطر' : 'lines'}</span>
          </div>
          <textarea
            rows={8}
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder={isAr ? 'الصق النص المعدل هنا...' : 'Paste modified text here...'}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm font-mono focus:border-violet-500 focus:outline-none dark:text-slate-100"
          />
        </div>
      </div>

      {/* Diff Result View */}
      {diffLines.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {isAr ? 'نتيجة المقارنة وإبراز الفروقات:' : 'Comparison & Difference Highlights:'}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto text-xs font-mono">
            {diffLines.map((line, idx) => {
              const isAdded = line.type === 'added';
              const isRemoved = line.type === 'removed';

              const bgClass = isAdded
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                : isRemoved
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                : 'text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900';

              const sign = isAdded ? '+' : isRemoved ? '-' : ' ';

              return (
                <div key={idx} className={`flex items-start py-0.5 px-3 border-b border-slate-100 dark:border-slate-800/60 ${bgClass}`}>
                  <span className="w-10 shrink-0 text-slate-400 select-none text-end pe-2">
                    {line.leftLineNum || ''}
                  </span>
                  <span className="w-10 shrink-0 text-slate-400 select-none text-end pe-2">
                    {line.rightLineNum || ''}
                  </span>
                  <span className="w-6 shrink-0 font-bold select-none text-center">
                    {sign}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap break-all">
                    {line.content || ' '}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
