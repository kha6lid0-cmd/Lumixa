import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Check, CheckCircle2, Copy, Download, Trash2, Upload } from 'lucide-react';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';
import { formatBytes, triggerBlobDownload } from '../../utils/fileHelpers';

interface Props {
  lang: Language;
}

type IndentOption = '2' | '4' | 'tab';

function sortJsonKeysRecursively(val: unknown): unknown {
  if (Array.isArray(val)) {
    return val.map(sortJsonKeysRecursively);
  }
  if (val !== null && typeof val === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(val as Record<string, unknown>).sort()) {
      sorted[key] = sortJsonKeysRecursively((val as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return val;
}

function measureJsonStats(val: unknown, currentDepth = 1): { keys: number; maxDepth: number } {
  if (Array.isArray(val)) {
    let keys = 0;
    let maxDepth = currentDepth;
    for (const item of val) {
      const sub = measureJsonStats(item, currentDepth + 1);
      keys += sub.keys;
      if (sub.maxDepth > maxDepth) maxDepth = sub.maxDepth;
    }
    return { keys, maxDepth };
  }
  if (val !== null && typeof val === 'object') {
    const entries = Object.entries(val as Record<string, unknown>);
    let keys = entries.length;
    let maxDepth = currentDepth;
    for (const [, v] of entries) {
      const sub = measureJsonStats(v, currentDepth + 1);
      keys += sub.keys;
      if (sub.maxDepth > maxDepth) maxDepth = sub.maxDepth;
    }
    return { keys, maxDepth };
  }
  return { keys: 0, maxDepth: currentDepth };
}

function locateJsonError(raw: string, errMessage: string): string {
  const posMatch = errMessage.match(/position\s+(\d+)/i);
  if (!posMatch) return errMessage;
  const pos = parseInt(posMatch[1], 10);
  if (!Number.isFinite(pos) || pos < 0 || pos > raw.length) return errMessage;

  const upToError = raw.slice(0, pos);
  const lines = upToError.split(/\r\n|\r|\n/);
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return `Line ${line}, Column ${column} — ${errMessage}`;
}

const SAMPLE_JSON = `{
  "platform": "LUMIXA",
  "freeForever": true,
  "languages": ["en", "ar"],
  "categories": {
    "image": ["compress", "resize", "convert", "pdf", "qr"],
    "pdf": ["merge", "split"],
    "text": ["word-counter", "formatter"],
    "developer": ["json-validator"]
  }
}`;

export function JsonFormatterTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [indent, setIndent] = useState<IndentOption>('2');
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const validation = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      return {
        isEmpty: true,
        valid: false,
        formatted: '',
        minified: '',
        error: null as string | null,
        stats: { keys: 0, maxDepth: 0, sizeBytes: 0 },
      };
    }

    try {
      const parsed = JSON.parse(trimmed);
      const processed = sortKeys ? sortJsonKeysRecursively(parsed) : parsed;
      const indentChar = indent === 'tab' ? '\t' : Number(indent);
      const formatted = JSON.stringify(processed, null, indentChar);
      const minified = JSON.stringify(processed);
      const { keys, maxDepth } = measureJsonStats(processed);
      const sizeBytes = new TextEncoder().encode(formatted).length;

      return {
        isEmpty: false,
        valid: true,
        formatted,
        minified,
        error: null,
        stats: { keys, maxDepth, sizeBytes },
      };
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : 'Invalid JSON syntax';
      return {
        isEmpty: false,
        valid: false,
        formatted: '',
        minified: '',
        error: locateJsonError(input, rawMsg),
        stats: { keys: 0, maxDepth: 0, sizeBytes: 0 },
      };
    }
  }, [input, indent, sortKeys]);

  const handleCopyOutput = async (textToCopy: string) => {
    if (!textToCopy) return;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleUploadJson = async (file: File | undefined) => {
    if (!file) return;
    const content = await file.text();
    setUploadedFileName(file.name);
    setInput(content);
  };

  const handleDownloadJson = () => {
    if (!validation.valid) return;
    const blob = new Blob([validation.formatted], { type: 'application/json;charset=utf-8' });
    triggerBlobDownload(blob, 'lumixa-formatted.json');
  };

  const jsonUploadAriaLabel = uploadedFileName
    ? isAr
      ? `الملف ${uploadedFileName} جاهز — رفع ملف JSON آخر`
      : `File ${uploadedFileName} ready — Upload a different JSON file`
    : isAr
    ? 'لم يتم اختيار ملف — رفع ملف JSON للفحص والتنسيق'
    : 'No file selected — Upload a JSON file to validate and format';

  useEffect(() => {
    const fileStatus = uploadedFileName
      ? isAr
        ? `الملف ${uploadedFileName} جاهز`
        : `File ${uploadedFileName} ready`
      : validation.isEmpty
      ? isAr
        ? 'لم يتم إدخال بيانات JSON'
        : 'No JSON input provided'
      : isAr
      ? 'بيانات JSON جاهزة في المحرر'
      : 'JSON payload active in editor';

    const actionStatus = validation.isEmpty
      ? ''
      : validation.valid
      ? isAr
        ? 'صيغة JSON صحيحة وجاهزة للتنسيق والنسخ'
        : 'Valid JSON ready to format or copy'
      : isAr
      ? 'يوجد خطأ في صياغة JSON'
      : 'Invalid JSON syntax';

    reportStatus({ fileStatus, actionStatus, isBusy: false });
  }, [uploadedFileName, validation.isEmpty, validation.valid, isAr, reportStatus]);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="json-indent" className="text-xs font-medium text-slate-700">
              {isAr ? 'المسافة البادئة:' : 'Indent:'}
            </label>
            <select
              id="json-indent"
              value={indent}
              onChange={(e) => setIndent(e.target.value as IndentOption)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:border-violet-600 focus:outline-none"
            >
              <option value="2">{isAr ? 'مسافتان (2 Spaces)' : '2 Spaces'}</option>
              <option value="4">{isAr ? '4 مسافات (4 Spaces)' : '4 Spaces'}</option>
              <option value="tab">Tab</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="rounded accent-violet-700"
            />
            <span>{isAr ? 'ترتيب المفاتيح أبجدياً' : 'Sort keys A–Z'}</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json,.txt"
            aria-label={jsonUploadAriaLabel}
            tabIndex={-1}
            onChange={(e) => {
              handleUploadJson(e.target.files?.[0]);
              e.target.value = '';
            }}
            className="sr-only"
          />
          <button
            type="button"
            aria-label={jsonUploadAriaLabel}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isAr ? 'رفع ملف .json' : 'Upload .json'}</span>
          </button>

          <button
            type="button"
            disabled={!validation.valid}
            aria-label={
              validation.valid
                ? isAr
                  ? 'بيانات JSON صحيحة — تنسيق المدخلات'
                  : 'JSON valid and ready — Format input'
                : isAr
                ? 'التنسيق غير متاح — صحح خطأ JSON أولاً'
                : 'Format unavailable — fix JSON syntax error first'
            }
            onClick={() => setInput(validation.formatted)}
            className="px-3 py-1.5 rounded-lg bg-violet-700 hover:bg-violet-800 disabled:opacity-40 text-xs font-semibold text-white transition-colors"
          >
            {isAr ? 'تنسيق (Beautify)' : 'Format Input'}
          </button>

          <button
            type="button"
            disabled={!validation.valid}
            aria-label={
              validation.valid
                ? isAr
                  ? 'بيانات JSON صحيحة — ضغط في سطر واحد'
                  : 'JSON valid and ready — Minify output'
                : isAr
                ? 'الضغط غير متاح — صحح خطأ JSON أولاً'
                : 'Minify unavailable — fix JSON syntax error first'
            }
            onClick={() => setInput(validation.minified)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-medium text-slate-800 transition-colors"
          >
            {isAr ? 'ضغط (Minify)' : 'Minify'}
          </button>

          <button
            type="button"
            disabled={!input}
            onClick={() => {
              setUploadedFileName(null);
              setInput('');
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:text-red-700 hover:bg-red-50 disabled:opacity-40 text-xs font-medium text-slate-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isAr ? 'مسح' : 'Clear'}</span>
          </button>
        </div>
      </div>

      {/* Validation Status Banner */}
      {!validation.isEmpty && (
        <div
          role={validation.valid ? 'status' : 'alert'}
          className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs ${
            validation.valid
              ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
              : 'border-red-200 bg-red-50/80 text-red-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {validation.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span className="font-mono" dir="ltr">
              {validation.valid
                ? isAr
                  ? 'Valid JSON — صيغة JSON صحيحة وسليمة'
                  : 'Valid JSON syntax'
                : validation.error}
            </span>
          </div>

          {validation.valid && (
            <div className="flex items-center gap-2 font-mono tabular-nums text-emerald-800">
              <span>{validation.stats.keys} keys</span>
              <span aria-hidden="true">·</span>
              <span>depth {validation.stats.maxDepth}</span>
              <span aria-hidden="true">·</span>
              <span>{formatBytes(validation.stats.sizeBytes)}</span>
            </div>
          )}
        </div>
      )}

      {/* Dual Pane Input & Formatted Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <label htmlFor="json-raw" className="font-semibold">
              {isAr ? 'مدخلات JSON الخام' : 'Raw JSON Input'}
            </label>
            <button
              type="button"
              onClick={() => setInput(SAMPLE_JSON)}
              className="text-violet-700 hover:underline font-medium"
            >
              {isAr ? 'بيانات نموذجية' : 'Load Sample'}
            </button>
          </div>
          <textarea
            id="json-raw"
            rows={14}
            dir="ltr"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-xs sm:text-sm font-mono leading-relaxed text-slate-900 focus:border-violet-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">
              {isAr ? 'المخرجات المنسقة' : 'Formatted Output'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!validation.valid}
                onClick={() => handleCopyOutput(validation.formatted)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-700 hover:bg-violet-800 disabled:opacity-40 text-white font-semibold transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ' : 'Copy'}</span>
              </button>
              <button
                type="button"
                disabled={!validation.valid}
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>.json</span>
              </button>
            </div>
          </div>

          <pre
            dir="ltr"
            className="w-full h-[338px] overflow-auto rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-4 text-xs sm:text-sm font-mono leading-relaxed"
          >
            {validation.valid
              ? validation.formatted
              : validation.isEmpty
              ? isAr
                ? 'أدخل بيانات JSON في المحرر للتحقق منها وتنسيقها.'
                : 'Paste JSON in the input pane to validate and format.'
              : `${isAr ? 'خطأ في الصياغة:' : 'Syntax Error:'}\n${validation.error}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
