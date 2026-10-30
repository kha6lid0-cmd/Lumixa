import { useEffect, useRef, useState } from 'react';
import { Download, FileImage, Loader2, Upload } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';
import { triggerBlobDownload } from '../../utils/fileHelpers';

interface Props { lang: Language }
type OutputFormat = 'png' | 'jpeg';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export function PdfToImagesTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [scale, setScale] = useState(1.5);
  const [pages, setPages] = useState<{ page: number; url: string; blob: Blob }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => pages.forEach((item) => URL.revokeObjectURL(item.url)), [pages]);

  const convert = async (file: File) => {
    setBusy(true); setError(''); setPages([]); setFileName(file.name);
    try {
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const output: { page: number; url: string; blob: Blob }[] = [];
      for (let index = 1; index <= pdf.numPages; index += 1) {
        const page = await pdf.getPage(index);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport }).promise;
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Canvas export failed')), `image/${format}`, format === 'jpeg' ? 0.92 : undefined));
        output.push({ page: index, url: URL.createObjectURL(blob), blob });
        page.cleanup();
      }
      setPages(output);
      reportStatus({ fileStatus: isAr ? `تم تحويل ${output.length} صفحة` : `${output.length} pages converted`, actionStatus: isAr ? 'الصور جاهزة للتحميل' : 'Images ready to download', isBusy: false });
    } catch {
      setError(isAr ? 'تعذر قراءة ملف PDF. تأكد أنه غير محمي أو تالف.' : 'Could not read this PDF. Make sure it is not encrypted or corrupted.');
      reportStatus({ fileStatus: isAr ? 'تعذر تحويل ملف PDF' : 'Could not convert PDF', actionStatus: '', isBusy: false });
    } finally { setBusy(false); }
  };

  const downloadPage = (item: { page: number; blob: Blob }) => triggerBlobDownload(item.blob, `lumixa-page-${item.page}.${format === 'jpeg' ? 'jpg' : 'png'}`);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-violet-300 bg-violet-50/50 p-5 text-center">
        <FileImage className="mx-auto h-8 w-8 text-violet-700" aria-hidden="true" />
        <p className="text-sm text-slate-700">{fileName || (isAr ? 'اختر ملف PDF لتحويل صفحاته إلى صور' : 'Choose a PDF to convert its pages into images')}</p>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => e.target.files?.[0] && convert(e.target.files[0])} />
        <button type="button" onClick={() => inputRef.current?.click()} className="mx-auto inline-flex min-h-11 items-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Upload className="h-4 w-4" aria-hidden="true" />{isAr ? 'اختيار ملف PDF' : 'Choose PDF'}</button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">{isAr ? 'صيغة الصور' : 'Image format'}<select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3"><option value="jpeg">JPG</option><option value="png">PNG</option></select></label>
        <label className="text-sm font-medium text-slate-700">{isAr ? 'الدقة' : 'Resolution'}<select value={scale} onChange={(e) => setScale(Number(e.target.value))} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3"><option value={1}>Standard</option><option value={1.5}>High</option><option value={2}>Very high</option></select></label>
      </div>
      {busy && <div className="flex items-center justify-center gap-2 text-sm text-violet-700"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{isAr ? 'جاري تحويل الصفحات...' : 'Converting pages...'}</div>}
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {pages.length > 0 && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{pages.map((item) => <div key={item.page} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><img src={item.url} alt={`${isAr ? 'صفحة' : 'Page'} ${item.page}`} className="max-h-72 w-full rounded bg-white object-contain" /><div className="mt-2 flex items-center justify-between gap-2"><span className="text-xs text-slate-500">{isAr ? `صفحة ${item.page}` : `Page ${item.page}`}</span><button type="button" onClick={() => downloadPage(item)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-100"><Download className="h-3.5 w-3.5" aria-hidden="true" />{isAr ? 'تحميل' : 'Download'}</button></div></div>)}</div>}
    </div>
  );
}
