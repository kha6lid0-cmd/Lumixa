import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Download,
  Files,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';
import { formatBytes, triggerBlobDownload, yieldToPaint } from '../../utils/fileHelpers';
import { createSamplePdfFile } from '../../utils/sampleAssets';

interface Props {
  lang: Language;
}

interface PdfQueueItem {
  id: string;
  file: File;
  pageCount: number;
}

export function PdfMergerTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [queue, setQueue] = useState<PdfQueueItem[]>([]);
  const [outputFilename, setOutputFilename] = useState<string>('lumixa-merged.pdf');
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [mergedUrl, setMergedUrl] = useState<string>('');
  const [mergedPageCount, setMergedPageCount] = useState<number>(0);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    };
  }, [mergedUrl]);

  const addPdfFiles = async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    if (!arr.length) return;
    setError(null);
    setIsLoadingFiles(true);

    try {
      await yieldToPaint();
      const nextItems: PdfQueueItem[] = [];
      for (const file of arr) {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
          setError(
            isAr
              ? `الملف "${file.name}" ليس بصيغة PDF.`
              : `File "${file.name}" is not a valid PDF document.`
          );
          continue;
        }

        try {
          const buf = await file.arrayBuffer();
          const doc = await PDFDocument.load(buf);
          nextItems.push({
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            file,
            pageCount: doc.getPageCount(),
          });
        } catch {
          setError(
            isAr
              ? `تعذر قراءة الملف "${file.name}". قد يكون محمياً بكلمة مرور أو تالفاً.`
              : `Could not read "${file.name}". It may be password-protected or corrupted.`
          );
        }
      }

      if (nextItems.length > 0) {
        setQueue((prev) => [...prev, ...nextItems]);
        setMergedBlob(null);
      }
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleLoadSamples = async () => {
    const [docA, docB] = await Promise.all([
      createSamplePdfFile('Executive Overview', 2, 'part-1-overview.pdf'),
      createSamplePdfFile('Technical Appendix', 3, 'part-2-appendix.pdf'),
    ]);
    await addPdfFiles([docA, docB]);
  };

  const moveItem = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= queue.length) return;
    const copy = [...queue];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setQueue(copy);
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (queue.length < 2) {
      setError(
        isAr
          ? 'يرجى إضافة ملفين PDF على الأقل لإتمام عملية الدمج.'
          : 'Please add at least two PDF files to merge them together.'
      );
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      await yieldToPaint();
      const mergedPdf = await PDFDocument.create();

      for (const item of queue) {
        const bytes = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((p) => mergedPdf.addPage(p));
      }

      const outBytes = await mergedPdf.save();
      const blob = new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setMergedBlob(blob);
      setMergedPageCount(mergedPdf.getPageCount());
      setMergedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch {
      setError(
        isAr
          ? 'حدث خطأ أثناء دمج ملفات PDF. تأكد أن جميع الملفات غير مشفرة.'
          : 'An error occurred while merging the PDFs. Ensure none of the files are encrypted.'
      );
    } finally {
      setIsMerging(false);
    }
  };

  const totalQueuedPages = queue.reduce((sum, item) => sum + item.pageCount, 0);

  const uploadPdfAriaLabel =
    queue.length === 0
      ? isAr
        ? 'لم يتم اختيار ملف — اختر ملفين PDF أو أكثر للدمج'
        : 'No file selected — Select two or more PDF files to merge'
      : queue.length === 1
      ? isAr
        ? `الملف ${queue[0].file.name} محدد — أضف ملف PDF آخر على الأقل للدمج`
        : `File ${queue[0].file.name} selected — Add at least one more PDF file to merge`
      : isAr
      ? `${queue.length} ملفات PDF جاهزة (${totalQueuedPages} صفحات) — إضافة ملفات أخرى`
      : `${queue.length} PDF files ready (${totalQueuedPages} pages) — Add additional PDF files`;

  const mergeProcessAriaLabel = isMerging
    ? isAr
      ? `جاري دمج ${queue.length} ملفات PDF`
      : `Merging ${queue.length} PDF files, please wait`
    : queue.length < 2
    ? isAr
      ? `دمج ملفات PDF غير متاح — يلزم ملفان على الأقل (المحدد حالياً ${queue.length})`
      : `Merge PDFs unavailable — select at least 2 PDF files (currently ${queue.length} selected)`
    : isAr
    ? `${queue.length} ملفات PDF جاهزة — دمج في ${outputFilename}`
    : `${queue.length} PDF files ready — Merge into ${outputFilename}`;

  useEffect(() => {
    if (queue.length === 0) {
      reportStatus({
        fileStatus: isAr ? 'لم يتم اختيار ملف' : 'No file selected',
        actionStatus: isLoadingFiles
          ? isAr
            ? 'جاري قراءة ملفات PDF'
            : 'Reading PDF files'
          : '',
        isBusy: isLoadingFiles,
      });
      return;
    }
    const fileSummary =
      queue.length === 1
        ? isAr
          ? `تم اختيار الملف ${queue[0].file.name} — أضف ملفاً ثانياً للدمج`
          : `File ${queue[0].file.name} selected — add one more PDF to merge`
        : isAr
        ? `${queue.length} ملفات PDF جاهزة`
        : `${queue.length} PDF files ready`;

    reportStatus({
      fileStatus: fileSummary,
      actionStatus: isMerging
        ? isAr
          ? 'جاري دمج ملفات PDF'
          : 'Merging PDF files'
        : isLoadingFiles
        ? isAr
          ? 'جاري قراءة ملفات PDF'
          : 'Reading PDF files'
        : mergedBlob
        ? isAr
          ? `الملف المدمج جاهز للتحميل (${mergedPageCount} صفحات)`
          : `Merged PDF ready for download (${mergedPageCount} pages)`
        : '',
      isBusy: isMerging || isLoadingFiles,
    });
  }, [queue, isMerging, isLoadingFiles, mergedBlob, mergedPageCount, isAr, reportStatus]);

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

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) addPdfFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl bg-slate-50/60 p-8 text-center transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="application/pdf,.pdf"
          aria-label={uploadPdfAriaLabel}
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files) addPdfFiles(e.target.files);
            e.target.value = '';
          }}
          className="sr-only"
        />
        <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          {isAr
            ? 'اختر ملفين PDF أو أكثر لدمجها في مستند واحد'
            : 'Drop two or more PDF files here to combine them'}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {isAr
            ? 'ترتيب مرن للملفات · معاينة فورية · بدون رفع للخادم'
            : 'Reorder files freely · Instant preview · 100% local processing'}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            aria-label={uploadPdfAriaLabel}
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
          >
            {isAr ? 'إضافة ملفات PDF' : 'Add PDF Files'}
          </button>
          <button
            type="button"
            onClick={handleLoadSamples}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-violet-600" aria-hidden="true" />
            <span>{isAr ? 'تجربة ملفين نموذجيين' : 'Load 2 Sample PDFs'}</span>
          </button>
        </div>
      </div>

      {queue.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">
              {isAr ? 'قائمة الملفات وترتيب الدمج' : 'Document Merge Order'}
            </span>
            <span className="font-mono tabular-nums">
              {queue.length} {isAr ? 'ملفات' : 'files'} · {totalQueuedPages}{' '}
              {isAr ? 'صفحات إجمالية' : 'total pages'}
            </span>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white">
            {queue.map((item, idx) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-xs font-mono tabular-nums font-semibold text-violet-700 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.file.name}</p>
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      {item.pageCount} {isAr ? 'صفحات' : item.pageCount === 1 ? 'page' : 'pages'} ·{' '}
                      {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, -1)}
                    aria-label={isAr ? 'لأعلى' : 'Move up'}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === queue.length - 1}
                    onClick={() => moveItem(idx, 1)}
                    aria-label={isAr ? 'لأسفل' : 'Move down'}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQueue((prev) => prev.filter((q) => q.id !== item.id));
                      setMergedBlob(null);
                    }}
                    aria-label={isAr ? 'حذف' : 'Remove'}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 pt-2">
            <div className="sm:max-w-xs w-full">
              <label htmlFor="merged-name" className="block text-xs font-medium text-slate-700 mb-1">
                {isAr ? 'اسم الملف المدمج' : 'Output filename'}
              </label>
              <input
                id="merged-name"
                type="text"
                dir="ltr"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={isMerging || queue.length < 2}
                aria-busy={isMerging}
                aria-label={mergeProcessAriaLabel}
                onClick={handleMerge}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <Files className="w-4 h-4" aria-hidden="true" />
                <span>
                  {isMerging
                    ? isAr
                      ? 'جاري الدمج...'
                      : 'Merging...'
                    : isAr
                    ? 'دمج ملفات PDF'
                    : 'Merge PDFs'}
                </span>
              </button>

              {mergedBlob && (
                <button
                  type="button"
                  aria-label={
                    isAr
                      ? `الملف ${outputFilename || 'lumixa-merged.pdf'} جاهز — تحميل (${formatBytes(mergedBlob.size)})`
                      : `File ${outputFilename || 'lumixa-merged.pdf'} ready — Download merged PDF (${formatBytes(mergedBlob.size)})`
                  }
                  onClick={() => {
                    const cleanName = outputFilename.trim().endsWith('.pdf')
                      ? outputFilename.trim()
                      : `${outputFilename.trim() || 'lumixa-merged'}.pdf`;
                    triggerBlobDownload(mergedBlob, cleanName);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-violet-700 bg-violet-50 hover:bg-violet-100 text-violet-800 text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {isAr
                      ? `تحميل الملف (${formatBytes(mergedBlob.size)})`
                      : `Download (${formatBytes(mergedBlob.size)})`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {mergedBlob && mergedUrl && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">
              {isAr ? 'معاينة المستند المدمج' : 'Merged Document Preview'}
            </span>
            <span className="font-mono tabular-nums">
              {mergedPageCount} {isAr ? 'صفحات' : 'pages'} · {formatBytes(mergedBlob.size)}
            </span>
          </div>
          <object
            data={mergedUrl}
            type="application/pdf"
            className="w-full h-[460px] rounded-xl border border-slate-200 bg-slate-100"
          >
            <div className="p-8 text-center text-sm text-slate-600">
              {isAr
                ? 'تم دمج ملف PDF بنجاح وهو جاهز للتحميل.'
                : 'Merged PDF generated successfully. Use the Download button above to save it.'}
            </div>
          </object>
        </div>
      )}
    </div>
  );
}
