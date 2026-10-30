import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';
import {
  formatBytes,
  loadImageFromFile,
  triggerBlobDownload,
  yieldToPaint,
} from '../../utils/fileHelpers';
import { createSampleImageFile } from '../../utils/sampleAssets';

interface Props {
  lang: Language;
}

interface QueuedImage {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

type PagePreset = 'a4' | 'letter' | 'fit';
type Orientation = 'portrait' | 'landscape';

export function ImagesToPdfTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<QueuedImage[]>([]);
  const [pagePreset, setPagePreset] = useState<PagePreset>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [marginPt, setMarginPt] = useState<number>(28);

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const addImageFiles = async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    if (!arr.length) return;
    setError(null);

    const valid = arr.filter((f) => ['image/png', 'image/jpeg', 'image/webp'].includes(f.type));
    if (!valid.length) {
      setError(
        isAr
          ? 'يرجى اختيار صور بصيغة PNG أو JPG أو WebP.'
          : 'Please select PNG, JPG, or WebP images.'
      );
      return;
    }

    try {
      const loadedItems: QueuedImage[] = [];
      for (const f of valid) {
        const loaded = await loadImageFromFile(f);
        loadedItems.push({
          id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          file: f,
          previewUrl: loaded.objectUrl,
          width: loaded.width,
          height: loaded.height,
        });
      }
      setImages((prev) => [...prev, ...loadedItems]);
      setPdfBlob(null);
    } catch {
      setError(
        isAr ? 'تعذر قراءة إحدى الصور المختارة.' : 'Could not decode one of the selected images.'
      );
    }
  };

  const moveImage = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setImages(copy);
    setPdfBlob(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
    setPdfBlob(null);
  };

  const imageToPngOrJpegBytes = async (
    item: QueuedImage
  ): Promise<{ bytes: ArrayBuffer; format: 'png' | 'jpg' }> => {
    // Convert via HTML5 Canvas so WebP and color-profile edge cases embed cleanly in pdf-lib
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = item.previewUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = item.width;
    canvas.height = item.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context missing');

    const useJpg = item.file.type === 'image/jpeg';
    if (useJpg) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Blob failed'))),
        useJpg ? 'image/jpeg' : 'image/png',
        useJpg ? 0.92 : undefined
      );
    });

    return {
      bytes: await blob.arrayBuffer(),
      format: useJpg ? 'jpg' : 'png',
    };
  };

  const buildPdf = async () => {
    if (images.length === 0) return;
    setIsBuilding(true);
    setError(null);

    try {
      await yieldToPaint();
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const encoded = await imageToPngOrJpegBytes(item);
        const embedded =
          encoded.format === 'jpg'
            ? await pdfDoc.embedJpg(encoded.bytes)
            : await pdfDoc.embedPng(encoded.bytes);

        if (pagePreset === 'fit') {
          const page = pdfDoc.addPage([item.width, item.height]);
          page.drawImage(embedded, {
            x: 0,
            y: 0,
            width: item.width,
            height: item.height,
          });
        } else {
          const baseDims: [number, number] =
            pagePreset === 'a4' ? [595.28, 841.89] : [612, 792];
          const [pageW, pageH] =
            orientation === 'portrait' ? baseDims : [baseDims[1], baseDims[0]];

          const page = pdfDoc.addPage([pageW, pageH]);
          const availW = Math.max(40, pageW - marginPt * 2);
          const availH = Math.max(40, pageH - marginPt * 2);
          const scale = Math.min(availW / item.width, availH / item.height);
          const drawW = item.width * scale;
          const drawH = item.height * scale;
          const x = (pageW - drawW) / 2;
          const y = (pageH - drawH) / 2;

          page.drawImage(embedded, { x, y, width: drawW, height: drawH });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setPdfBlob(blob);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch {
      setError(
        isAr
          ? 'حدث خطأ أثناء إنشاء ملف PDF. يرجى التحقق من الصور والمحاولة مجدداً.'
          : 'Failed to generate PDF from the selected images. Please verify your files and try again.'
      );
    } finally {
      setIsBuilding(false);
    }
  };

  const uploadAriaLabel =
    images.length === 0
      ? isAr
        ? 'لم يتم اختيار ملف — أضف صور PNG أو JPG أو WebP لتحويلها إلى PDF'
        : 'No file selected — Add PNG, JPG, or WebP images to convert to PDF'
      : images.length === 1
      ? isAr
        ? `الملف ${images[0].file.name} جاهز — إضافة المزيد من الصور`
        : `File ${images[0].file.name} ready — Add additional images`
      : isAr
      ? `${images.length} ملفات صور جاهزة — إضافة المزيد من الصور`
      : `${images.length} image files ready — Add additional images`;

  const processPdfAriaLabel = isBuilding
    ? isAr
      ? `جاري إنشاء ملف PDF من ${images.length} صور`
      : `Generating PDF from ${images.length} images, please wait`
    : images.length === 1
    ? isAr
      ? `الملف ${images[0].file.name} جاهز — إنشاء ملف PDF`
      : `File ${images[0].file.name} ready — Convert image to PDF`
    : isAr
    ? `${images.length} صور جاهزة — إنشاء ملف PDF`
    : `${images.length} files ready — Convert images to PDF`;

  useEffect(() => {
    if (images.length === 0) {
      reportStatus({
        fileStatus: isAr ? 'لم يتم اختيار ملف' : 'No file selected',
        actionStatus: '',
        isBusy: false,
      });
      return;
    }
    const fileSummary =
      images.length === 1
        ? isAr
          ? `الملف ${images[0].file.name} جاهز`
          : `File ${images[0].file.name} ready`
        : isAr
        ? `${images.length} ملفات صور جاهزة`
        : `${images.length} image files ready`;

    reportStatus({
      fileStatus: fileSummary,
      actionStatus: isBuilding
        ? isAr
          ? 'جاري إنشاء ملف PDF'
          : 'Generating PDF document'
        : pdfBlob
        ? isAr
          ? `ملف PDF جاهز للتحميل (${formatBytes(pdfBlob.size)})`
          : `PDF document ready for download (${formatBytes(pdfBlob.size)})`
        : '',
      isBusy: isBuilding,
    });
  }, [images, isBuilding, pdfBlob, isAr, reportStatus]);

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

      {/* PDF Layout Settings */}
      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="pdf-page-size" className="block text-xs font-medium text-slate-700 mb-1.5">
            {isAr ? 'مقاس الصفحة' : 'Page Size'}
          </label>
          <select
            id="pdf-page-size"
            value={pagePreset}
            onChange={(e) => {
              setPagePreset(e.target.value as PagePreset);
              setPdfBlob(null);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
          >
            <option value="a4">{isAr ? 'A4 قياسي' : 'A4 Standard'}</option>
            <option value="letter">US Letter</option>
            <option value="fit">{isAr ? 'مطابق لأبعاد الصورة' : 'Fit to Each Image'}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="pdf-orientation"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            {isAr ? 'اتجاه الصفحة' : 'Orientation'}
          </label>
          <select
            id="pdf-orientation"
            disabled={pagePreset === 'fit'}
            value={orientation}
            onChange={(e) => {
              setOrientation(e.target.value as Orientation);
              setPdfBlob(null);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 disabled:opacity-40 focus:border-violet-600 focus:outline-none"
          >
            <option value="portrait">{isAr ? 'طولي (Portrait)' : 'Portrait'}</option>
            <option value="landscape">{isAr ? 'عرضي (Landscape)' : 'Landscape'}</option>
          </select>
        </div>

        <div>
          <label htmlFor="pdf-margin" className="block text-xs font-medium text-slate-700 mb-1.5">
            {isAr ? 'هوامش الصفحة' : 'Page Margin'}
          </label>
          <select
            id="pdf-margin"
            disabled={pagePreset === 'fit'}
            value={marginPt}
            onChange={(e) => {
              setMarginPt(Number(e.target.value));
              setPdfBlob(null);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 disabled:opacity-40 focus:border-violet-600 focus:outline-none"
          >
            <option value={0}>{isAr ? 'بدون هامش' : 'No Margin (Full Bleed)'}</option>
            <option value={20}>{isAr ? 'هامش صغير' : 'Small Margin'}</option>
            <option value={36}>{isAr ? 'هامش قياسي' : 'Standard Margin'}</option>
          </select>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) addImageFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl bg-white p-7 text-center transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          aria-label={uploadAriaLabel}
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files) addImageFiles(e.target.files);
            e.target.value = '';
          }}
          className="sr-only"
        />
        <Upload className="w-7 h-7 text-violet-700 mx-auto mb-2" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-900">
          {isAr
            ? 'أضف الصور التي تريد تحويلها وجمعها في ملف PDF واحد'
            : 'Add PNG, JPG, or WebP images to combine into a PDF'}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            aria-label={uploadAriaLabel}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
          >
            {isAr ? 'إضافة صور' : 'Add Images'}
          </button>
          <button
            type="button"
            onClick={async () =>
              addImageFiles([await createSampleImageFile('lumixa-page-sample.png')])
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-violet-600" aria-hidden="true" />
            <span>{isAr ? 'إضافة صفحة نموذجية' : 'Add Sample Image'}</span>
          </button>
        </div>
      </div>

      {/* Image Order Queue */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white">
            {images.map((item, idx) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-xs font-mono tabular-nums text-slate-500 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.file.name}</p>
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      {item.width} × {item.height} px · {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveImage(idx, -1)}
                    aria-label={isAr ? 'تحريك لأعلى' : 'Move up'}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => moveImage(idx, 1)}
                    aria-label={isAr ? 'تحريك لأسفل' : 'Move down'}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(item.id)}
                    aria-label={isAr ? 'حذف' : 'Remove'}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isBuilding}
              aria-busy={isBuilding}
              aria-label={processPdfAriaLabel}
              onClick={buildPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>
                {isBuilding
                  ? isAr
                    ? 'جاري إنشاء PDF...'
                    : 'Generating PDF...'
                  : isAr
                  ? `إنشاء ملف PDF (${images.length} صفحات)`
                  : `Convert ${images.length} ${images.length === 1 ? 'Image' : 'Images'} to PDF`}
              </span>
            </button>

            {pdfBlob && (
              <button
                type="button"
                aria-label={
                  isAr
                    ? `الملف lumixa-images.pdf جاهز — تحميل PDF بحجم ${formatBytes(pdfBlob.size)}`
                    : `File lumixa-images.pdf ready — Download PDF (${formatBytes(pdfBlob.size)})`
                }
                onClick={() => triggerBlobDownload(pdfBlob, 'lumixa-images.pdf')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-violet-700 bg-violet-50 hover:bg-violet-100 text-violet-800 text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>
                  {isAr
                    ? `تحميل PDF (${formatBytes(pdfBlob.size)})`
                    : `Download PDF (${formatBytes(pdfBlob.size)})`}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PDF Document Preview */}
      {pdfBlob && pdfUrl && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">
              {isAr ? 'معاينة ملف PDF الجاهز' : 'Generated PDF Preview'}
            </span>
            <span className="font-mono tabular-nums">
              {images.length} {isAr ? 'صفحات' : 'pages'} · {formatBytes(pdfBlob.size)}
            </span>
          </div>
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-[460px] rounded-xl border border-slate-200 bg-slate-100"
          >
            <div className="p-8 text-center text-sm text-slate-600">
              <p>
                {isAr
                  ? 'ملف PDF جاهز للتحميل على جهازك.'
                  : 'Your PDF is ready. Click Download PDF above to view it on your device.'}
              </p>
            </div>
          </object>
        </div>
      )}
    </div>
  );
}
