import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Download, Loader2, Minimize2, Upload } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';
import { formatBytes, triggerBlobDownload } from '../../utils/fileHelpers';

interface Props { lang: Language }

export function PdfCompressorTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const compress = async (selected: File) => {
    setFile(selected); setResult(null); setError(''); setBusy(true);
    try {
      const source = await PDFDocument.load(await selected.arrayBuffer(), { ignoreEncryption: false });
      const bytes = await source.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 50 });
      const safeBytes = new Uint8Array(bytes);
      const blob = new Blob([safeBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult(blob);
      reportStatus({ fileStatus: isAr ? `تم تحسين ${selected.name}` : `${selected.name} optimized`, actionStatus: isAr ? 'الملف جاهز للتحميل' : 'Optimized PDF ready', isBusy: false });
    } catch {
      setError(isAr ? 'تعذر ضغط الملف. قد يكون محمياً أو تالفاً.' : 'Could not optimize this PDF. It may be encrypted or corrupted.');
      reportStatus({ fileStatus: isAr ? 'تعذر تحسين ملف PDF' : 'Could not optimize PDF', actionStatus: '', isBusy: false });
    } finally { setBusy(false); }
  };

  const saving = file && result ? file.size - result.size : 0;
  const reduction = file && result && file.size > 0 ? Math.max(0, Math.round((saving / file.size) * 100)) : 0;

  useEffect(() => () => { setResult(null); }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-violet-300 bg-violet-50/50 p-6 text-center">
        <Minimize2 className="h-8 w-8 text-violet-700" aria-hidden="true" />
        <p className="text-sm text-slate-700">{file ? file.name : (isAr ? 'اختر ملف PDF لتحسين حجمه' : 'Choose a PDF to optimize its size')}</p>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => e.target.files?.[0] && compress(e.target.files[0])} />
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Upload className="h-4 w-4" aria-hidden="true" />{isAr ? 'اختيار ملف PDF' : 'Choose PDF'}</button>
      </div>
      {busy && <div className="flex items-center justify-center gap-2 text-sm text-violet-700"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{isAr ? 'جاري تحسين الملف...' : 'Optimizing PDF...'}</div>}
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {file && result && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex flex-wrap items-center gap-3 text-sm text-emerald-900"><span>{formatBytes(file.size)}</span><ArrowDown className="h-4 w-4" aria-hidden="true" /><strong>{formatBytes(result.size)}</strong><span>{reduction > 0 ? `${reduction}% ${isAr ? 'أصغر' : 'smaller'}` : (isAr ? 'تم تحسين بنية الملف' : 'Structure optimized')}</span></div><button type="button" onClick={() => triggerBlobDownload(result, `lumixa-${file.name.replace(/\.pdf$/i, '')}-optimized.pdf`)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"><Download className="h-4 w-4" aria-hidden="true" />{isAr ? 'تحميل الملف المحسن' : 'Download optimized PDF'}</button></div>}
      <p className="text-xs leading-relaxed text-slate-500">{isAr ? 'تعتمد النتيجة على بنية الملف الأصلية. ملفات PDF التي تحتوي على صور كبيرة قد تحتاج إلى ضغط الصور قبل إدراجها في المستند.' : 'Results depend on the original PDF structure. PDFs with large embedded images may need image compression before insertion for a larger reduction.'}</p>
    </div>
  );
}
