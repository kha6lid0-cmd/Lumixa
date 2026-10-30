import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Download, Scissors, Sparkles, Upload } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';
import {
  formatBytes,
  parsePageRanges,
  stripExtension,
  triggerBlobDownload,
  yieldToPaint,
} from '../../utils/fileHelpers';
import { createSamplePdfFile } from '../../utils/sampleAssets';

interface Props {
  lang: Language;
}

interface SplitOutputFile {
  filename: string;
  pageCount: number;
  blob: Blob;
  previewUrl: string;
}

export function PdfSplitterTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>('1-2');
  const [splitMode, setSplitMode] = useState<'combine' | 'separate'>('combine');

  const [outputs, setOutputs] = useState<SplitOutputFile[]>([]);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      outputs.forEach((o) => URL.revokeObjectURL(o.previewUrl));
    };
  }, [outputs]);

  const loadPdf = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError(
        isAr ? 'يرجى اختيار ملف PDF صالح.' : 'Please choose a valid PDF document (.pdf).'
      );
      return;
    }

    setIsLoadingPdf(true);
    try {
      await yieldToPaint();
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();
      outputs.forEach((o) => URL.revokeObjectURL(o.previewUrl));
      setOutputs([]);
      setSourceFile(file);
      setTotalPages(count);
      setRangeInput(count >= 2 ? `1-${Math.min(2, count)}` : '1');
    } catch {
      setError(
        isAr
          ? 'تعذر فتح ملف PDF. قد يكون محمياً بكلمة مرور أو تالفاً.'
          : 'Unable to open this PDF. It may be password-protected or corrupted.'
      );
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const togglePageInInput = (pageNumber: number) => {
    const parsed = parsePageRanges(rangeInput, totalPages, isAr);
    const selectedSet = new Set<number>();
    if (!parsed.error) {
      parsed.ranges.forEach((r) => r.pageIndices.forEach((idx) => selectedSet.add(idx + 1)));
    }
    if (selectedSet.has(pageNumber)) {
      selectedSet.delete(pageNumber);
    } else {
      selectedSet.add(pageNumber);
    }
    const sorted = Array.from(selectedSet).sort((a, b) => a - b);
    setRangeInput(sorted.join(', '));
  };

  const handleSplit = async () => {
    if (!sourceFile) return;
    const { ranges, error: rangeErr } = parsePageRanges(rangeInput, totalPages, isAr);
    if (rangeErr) {
      setError(rangeErr);
      return;
    }

    setIsSplitting(true);
    setError(null);

    try {
      await yieldToPaint();
      const srcBytes = await sourceFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(srcBytes);
      const baseName = stripExtension(sourceFile.name);
      const generated: SplitOutputFile[] = [];

      if (splitMode === 'combine') {
        const outDoc = await PDFDocument.create();
        const allIndices: number[] = [];
        ranges.forEach((r) => r.pageIndices.forEach((idx) => allIndices.push(idx)));

        const copied = await outDoc.copyPages(srcDoc, allIndices);
        copied.forEach((p) => outDoc.addPage(p));

        const outBytes = await outDoc.save();
        const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        generated.push({
          filename: `${baseName}-extracted.pdf`,
          pageCount: allIndices.length,
          blob,
          previewUrl: URL.createObjectURL(blob),
        });
      } else {
        for (const r of ranges) {
          const outDoc = await PDFDocument.create();
          const copied = await outDoc.copyPages(srcDoc, r.pageIndices);
          copied.forEach((p) => outDoc.addPage(p));
          const outBytes = await outDoc.save();
          const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
          generated.push({
            filename: `${baseName}-${r.label}.pdf`,
            pageCount: r.pageIndices.length,
            blob,
            previewUrl: URL.createObjectURL(blob),
          });
        }
      }

      outputs.forEach((old) => URL.revokeObjectURL(old.previewUrl));
      setOutputs(generated);
    } catch {
      setError(
        isAr
          ? 'حدث خطأ أثناء تقسيم ملف PDF.'
          : 'An unexpected error occurred while splitting the PDF.'
      );
    } finally {
      setIsSplitting(false);
    }
  };

  const activePagesSet = (() => {
    const s = new Set<number>();
    if (!totalPages) return s;
    const res = parsePageRanges(rangeInput, totalPages, isAr);
    if (!res.error) {
      res.ranges.forEach((r) => r.pageIndices.forEach((idx) => s.add(idx + 1)));
    }
    return s;
  })();

  const uploadSplitAriaLabel = sourceFile
    ? isAr
      ? `الملف ${sourceFile.name} جاهز (${totalPages} صفحات)`
      : `File ${sourceFile.name} ready (${totalPages} pages)`
    : isAr
    ? 'لم يتم اختيار ملف — اختر ملف PDF لتقسيمه'
    : 'No file selected — Choose a PDF file to split';

  const splitActionAriaLabel = !sourceFile
    ? isAr
      ? 'لم يتم اختيار ملف'
      : 'No file selected'
    : isSplitting
    ? isAr
      ? `جاري استخراج الصفحات من ${sourceFile.name}`
      : `Extracting pages from ${sourceFile.name}, please wait`
    : isAr
    ? `الملف ${sourceFile.name} جاهز — استخراج الصفحات (${rangeInput})`
    : `File ${sourceFile.name} ready — Split pages (${rangeInput})`;

  useEffect(() => {
    if (!sourceFile) {
      reportStatus({
        fileStatus: isAr ? 'لم يتم اختيار ملف' : 'No file selected',
        actionStatus: isLoadingPdf
          ? isAr
            ? 'جاري قراءة ملف PDF'
            : 'Reading PDF document'
          : '',
        isBusy: isLoadingPdf,
      });
      return;
    }
    reportStatus({
      fileStatus: isAr
        ? `الملف ${sourceFile.name} جاهز (${totalPages} صفحات)`
        : `File ${sourceFile.name} ready (${totalPages} pages)`,
      actionStatus: isSplitting
        ? isAr
          ? 'جاري تقسيم ملف PDF'
          : 'Splitting PDF pages'
        : isLoadingPdf
        ? isAr
          ? 'جاري قراءة ملف PDF'
          : 'Reading PDF document'
        : outputs.length > 0
        ? isAr
          ? `تم استخراج ${outputs.length} ملف جاهز للتحميل`
          : `${outputs.length} extracted PDF ${outputs.length === 1 ? 'file' : 'files'} ready`
        : '',
      isBusy: isSplitting || isLoadingPdf,
    });
  }, [sourceFile, totalPages, isSplitting, isLoadingPdf, outputs.length, isAr, reportStatus]);

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50/80 text-sm text-red-800"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {!sourceFile ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            loadPdf(e.dataTransfer.files?.[0]);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl bg-slate-50/60 p-8 sm:p-12 text-center transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            aria-label={uploadSplitAriaLabel}
            tabIndex={-1}
            onChange={(e) => loadPdf(e.target.files?.[0])}
            className="sr-only"
          />
          <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            {isAr
              ? 'اختر ملف PDF لتقسيمه أو استخراج صفحات منه'
              : 'Select a PDF document to extract or split pages'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {isAr
              ? 'تحديد نطاق الصفحات بسهولة · معاينة وتحميل فوري'
              : 'Flexible page range syntax (e.g., 1-3, 5) · Instant local preview'}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              aria-label={uploadSplitAriaLabel}
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              {isAr ? 'رفع ملف PDF' : 'Choose PDF File'}
            </button>
            <button
              type="button"
              aria-label={
                isAr
                  ? 'لم يتم اختيار ملف — تجربة ملف PDF نموذجي من 5 صفحات'
                  : 'No file selected — Load 5-page sample PDF to test splitting'
              }
              onClick={async () =>
                loadPdf(await createSamplePdfFile('Quarterly Report', 5, 'sample-5-page-report.pdf'))
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-violet-600" aria-hidden="true" />
              <span>{isAr ? 'تجربة ملف من 5 صفحات' : 'Try 5-Page Sample PDF'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">{sourceFile.name}</p>
                <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                  {totalPages} {isAr ? 'صفحات إجمالية' : 'total pages'} ·{' '}
                  {formatBytes(sourceFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSourceFile(null);
                  setOutputs([]);
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                {isAr ? 'تغيير الملف' : 'Change PDF'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="range-input" className="block text-xs font-medium text-slate-700 mb-1.5">
                  {isAr
                    ? `نطاق الصفحات (من 1 إلى ${totalPages})`
                    : `Page ranges (1 to ${totalPages}, e.g. 1-3, 5)`}
                </label>
                <input
                  id="range-input"
                  type="text"
                  dir="ltr"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="1-3, 5"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-violet-600 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="split-mode" className="block text-xs font-medium text-slate-700 mb-1.5">
                  {isAr ? 'طريقة الإخراج' : 'Output Mode'}
                </label>
                <select
                  id="split-mode"
                  value={splitMode}
                  onChange={(e) => setSplitMode(e.target.value as 'combine' | 'separate')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                >
                  <option value="combine">
                    {isAr
                      ? 'جمع الصفحات المحددة في ملف PDF واحد'
                      : 'Combine selected pages into one PDF'}
                  </option>
                  <option value="separate">
                    {isAr
                      ? 'فصل كل نطاق في ملف PDF مستقل'
                      : 'Save each range as a separate PDF'}
                  </option>
                </select>
              </div>
            </div>

            {/* Interactive Page Selector Grid (up to 60 pages for fast visual clicking) */}
            {totalPages <= 60 && (
              <div>
                <span className="block text-xs font-medium text-slate-600 mb-2">
                  {isAr
                    ? 'أو انقر على أرقام الصفحات لتحديدها مباشرة:'
                    : 'Or click page numbers to toggle selection:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                    const selected = activePagesSet.has(pageNum);
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => togglePageInInput(pageNum)}
                        className={`w-9 h-9 rounded-lg text-xs font-mono tabular-nums font-semibold transition-colors ${
                          selected
                            ? 'bg-violet-700 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-violet-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <button
                type="button"
                disabled={isSplitting}
                aria-busy={isSplitting}
                aria-label={splitActionAriaLabel}
                onClick={handleSplit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <Scissors className="w-4 h-4" aria-hidden="true" />
                <span>
                  {isSplitting
                    ? isAr
                      ? 'جاري الاستخراج...'
                      : 'Extracting Pages...'
                    : isAr
                    ? 'استخراج وتقسيم PDF'
                    : 'Split / Extract Pages'}
                </span>
              </button>
            </div>
          </div>

          {outputs.length > 0 && (
            <div className="space-y-4">
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white">
                {outputs.map((out) => (
                  <div
                    key={out.filename}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 font-mono">
                        {out.filename}
                      </p>
                      <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                        {out.pageCount} {isAr ? 'صفحات' : out.pageCount === 1 ? 'page' : 'pages'} ·{' '}
                        {formatBytes(out.blob.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={
                        isAr
                          ? `الملف ${out.filename} جاهز (${out.pageCount} صفحات) — تحميل PDF`
                          : `File ${out.filename} ready (${out.pageCount} pages) — Download PDF`
                      }
                      onClick={() => triggerBlobDownload(out.blob, out.filename)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>{isAr ? 'تحميل الملف' : 'Download PDF'}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Embedded Preview of first output */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600">
                  {isAr ? `معاينة: ${outputs[0].filename}` : `Preview: ${outputs[0].filename}`}
                </p>
                <object
                  data={outputs[0].previewUrl}
                  type="application/pdf"
                  className="w-full h-[440px] rounded-xl border border-slate-200 bg-slate-100"
                >
                  <div className="p-8 text-center text-sm text-slate-600">
                    {isAr
                      ? 'تم استخراج الصفحات بنجاح وهي جاهزة للتحميل.'
                      : 'Pages extracted successfully. Click Download PDF above to view.'}
                  </div>
                </object>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
