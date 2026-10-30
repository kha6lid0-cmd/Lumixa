import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Download, Image as ImageIcon, Sparkles, Upload } from 'lucide-react';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';
import {
  formatBytes,
  loadImageFromFile,
  stripExtension,
  triggerBlobDownload,
} from '../../utils/fileHelpers';
import { createSampleImageFile } from '../../utils/sampleAssets';

interface Props {
  lang: Language;
}

type OutputMime = 'image/webp' | 'image/jpeg' | 'image/png';

export function ImageCompressorTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const [quality, setQuality] = useState<number>(78);
  const [maxWidth, setMaxWidth] = useState<number>(0); // 0 = keep original width
  const [outputMime, setOutputMime] = useState<OutputMime>('image/webp');

  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [outputDims, setOutputDims] = useState<{ width: number; height: number } | null>(null);
  const [previewMode, setPreviewMode] = useState<'compressed' | 'original'>('compressed');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [sourceUrl, compressedUrl]);

  const handleFileSelection = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError(
        isAr
          ? 'يرجى اختيار ملف صورة صالح بصيغة PNG أو JPG أو WebP.'
          : 'Please choose a supported image file (PNG, JPG, or WebP).'
      );
      return;
    }

    try {
      const loaded = await loadImageFromFile(file);
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      setSourceFile(file);
      setSourceUrl(loaded.objectUrl);
      setDimensions({ width: loaded.width, height: loaded.height });
      // Default JPEG to JPEG, PNG/WebP to WebP for maximum compression with transparency support
      setOutputMime(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp');
    } catch {
      setError(
        isAr
          ? 'تعذر قراءة ملف الصورة. يرجى تجربة صورة أخرى غير تالفة.'
          : 'Could not decode this image file. Please try another valid image.'
      );
    }
  };

  useEffect(() => {
    if (!sourceFile || !sourceUrl || !dimensions) return;

    let cancelled = false;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;

      let targetW = dimensions.width;
      let targetH = dimensions.height;
      if (maxWidth > 0 && targetW > maxWidth) {
        const ratio = maxWidth / targetW;
        targetW = Math.round(maxWidth);
        targetH = Math.max(1, Math.round(targetH * ratio));
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      if (outputMime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (cancelled) return;
          setIsProcessing(false);
          if (!blob) {
            setError(
              isAr ? 'حدث خطأ أثناء ضغط الصورة.' : 'An error occurred while compressing the image.'
            );
            return;
          }
          setCompressedBlob(blob);
          setOutputDims({ width: targetW, height: targetH });
          setCompressedUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });
        },
        outputMime,
        outputMime === 'image/png' ? undefined : quality / 100
      );
    };
    img.src = sourceUrl;

    return () => {
      cancelled = true;
    };
  }, [sourceFile, sourceUrl, dimensions, quality, maxWidth, outputMime, isAr]);

  const handleLoadSample = async () => {
    const sample = await createSampleImageFile();
    await handleFileSelection(sample);
  };

  const handleDownload = () => {
    if (!compressedBlob || !sourceFile) return;
    const ext = outputMime === 'image/webp' ? 'webp' : outputMime === 'image/jpeg' ? 'jpg' : 'png';
    const outName = `${stripExtension(sourceFile.name)}-compressed.${ext}`;
    triggerBlobDownload(compressedBlob, outName);
  };

  const savedRatio =
    sourceFile && compressedBlob
      ? Math.round(((sourceFile.size - compressedBlob.size) / sourceFile.size) * 100)
      : 0;

  const uploadStateLabel = sourceFile
    ? isAr
      ? `الملف ${sourceFile.name} جاهز`
      : `File ${sourceFile.name} ready`
    : isAr
    ? 'لم يتم اختيار ملف — اختر صورة PNG أو JPG أو WebP للضغط'
    : 'No file selected — Select a PNG, JPG, or WebP image to compress';

  const processButtonAriaLabel = !sourceFile
    ? isAr
      ? 'لم يتم اختيار ملف للضغط'
      : 'No file selected to compress'
    : isProcessing
    ? isAr
      ? `جاري ضغط الملف ${sourceFile.name}`
      : `Compressing file ${sourceFile.name}, please wait`
    : compressedBlob
    ? isAr
      ? `الملف ${sourceFile.name} جاهز — تحميل الصورة المضغوطة (${formatBytes(compressedBlob.size)})`
      : `File ${sourceFile.name} ready — Download compressed image (${formatBytes(compressedBlob.size)})`
    : isAr
    ? `الملف ${sourceFile.name} قيد التحضير`
    : `Preparing file ${sourceFile.name}`;

  useEffect(() => {
    if (!sourceFile) {
      reportStatus({
        fileStatus: isAr ? 'لم يتم اختيار ملف' : 'No file selected',
        actionStatus: '',
        isBusy: false,
      });
      return;
    }
    reportStatus({
      fileStatus: isAr ? `الملف ${sourceFile.name} جاهز` : `File ${sourceFile.name} ready`,
      actionStatus: isProcessing
        ? isAr
          ? 'جاري ضغط الصورة'
          : 'Compressing image'
        : compressedBlob
        ? isAr
          ? `جاهز للتحميل بحجم ${formatBytes(compressedBlob.size)}`
          : `Compressed output ready (${formatBytes(compressedBlob.size)})`
        : '',
      isBusy: isProcessing,
    });
  }, [sourceFile, isProcessing, compressedBlob, isAr, reportStatus]);

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
            handleFileSelection(e.dataTransfer.files?.[0]);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl bg-slate-50/60 p-8 sm:p-12 text-center transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            aria-label={uploadStateLabel}
            tabIndex={-1}
            onChange={(e) => handleFileSelection(e.target.files?.[0])}
            className="sr-only"
          />
          <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {isAr ? 'اسحب الصورة إلى هنا أو اختر ملفاً' : 'Drop an image here or select a file'}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            {isAr
              ? 'يدعم PNG و JPG و WebP · معالجة فورية داخل المتصفح'
              : 'Supports PNG, JPG, and WebP · Instant local browser compression'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              aria-label={uploadStateLabel}
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              {isAr ? 'اختيار صورة' : 'Select Image'}
            </button>
            <button
              type="button"
              aria-label={
                isAr
                  ? 'لم يتم اختيار ملف — تحميل صورة نموذجية للتجربة'
                  : 'No file selected — Load sample image to test compression'
              }
              onClick={handleLoadSample}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-violet-600" aria-hidden="true" />
              <span>{isAr ? 'تجربة صورة نموذجية' : 'Try Sample Image'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5 p-5 rounded-xl border border-slate-200 bg-slate-50/60">
            <div>
              <div className="flex items-center justify-between text-sm font-medium text-slate-800 mb-2">
                <label htmlFor="quality-slider">
                  {isAr ? 'مستوى الجودة' : 'Compression Quality'}
                </label>
                <span className="font-mono tabular-nums text-violet-700 font-semibold">
                  {outputMime === 'image/png' ? (isAr ? 'بدون فقدان' : 'Lossless') : `${quality}%`}
                </span>
              </div>
              <input
                id="quality-slider"
                type="range"
                min={10}
                max={95}
                value={quality}
                disabled={outputMime === 'image/png'}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-violet-700 disabled:opacity-40"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{isAr ? 'حجم أصغر' : 'Smaller file'}</span>
                <span>{isAr ? 'دقة أعلى' : 'Higher fidelity'}</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="output-format"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                {isAr ? 'صيغة الإخراج' : 'Output Format'}
              </label>
              <select
                id="output-format"
                value={outputMime}
                onChange={(e) => setOutputMime(e.target.value as OutputMime)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
              >
                <option value="image/webp">
                  {isAr ? 'WebP (أفضل ضغط مع دعم الشفافية)' : 'WebP (Best compression + transparency)'}
                </option>
                <option value="image/jpeg">
                  {isAr ? 'JPG (متوافق مع كافة البرامج)' : 'JPG (Universal photo compatibility)'}
                </option>
                <option value="image/png">
                  {isAr ? 'PNG (بدون فقدان جودة)' : 'PNG (Lossless archival)'}
                </option>
              </select>
              {outputMime === 'image/png' && (
                <p className="mt-2 text-xs text-slate-600">
                  {isAr
                    ? 'ملاحظة: صيغة PNG غير قابلة للضغط الفاقد. اختر WebP لتوفير يصل إلى 75% من الحجم.'
                    : 'Note: PNG encoding is lossless. Switch to WebP for significant file size reduction.'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="max-width" className="block text-sm font-medium text-slate-800 mb-1.5">
                {isAr ? 'الحد الأقصى للعرض (اختياري)' : 'Max Width Limit (Optional)'}
              </label>
              <select
                id="max-width"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
              >
                <option value={0}>
                  {isAr
                    ? `الأبعاد الأصلية (${dimensions?.width} × ${dimensions?.height})`
                    : `Keep original (${dimensions?.width} × ${dimensions?.height} px)`}
                </option>
                <option value={1920}>1920 px (Full HD)</option>
                <option value={1280}>1280 px (Web Standard)</option>
                <option value={800}>800 px (Compact / Email)</option>
              </select>
            </div>

            {/* Size Comparison Summary */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{isAr ? 'الحجم الأصلي:' : 'Original size:'}</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {formatBytes(sourceFile.size)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{isAr ? 'الحجم بعد الضغط:' : 'Compressed size:'}</span>
                <span className="font-mono tabular-nums font-semibold text-violet-700">
                  {isProcessing || !compressedBlob ? '...' : formatBytes(compressedBlob.size)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{isAr ? 'نسبة التوفير:' : 'Size change:'}</span>
                <span
                  className={`font-mono tabular-nums font-semibold ${
                    savedRatio > 0 ? 'text-emerald-700' : 'text-slate-600'
                  }`}
                >
                  {savedRatio > 0
                    ? isAr
                      ? `توفير ${savedRatio}%`
                      : `-${savedRatio}% saved`
                    : isAr
                    ? 'حجم مماثل (جرب WebP)'
                    : 'No reduction (try WebP)'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                disabled={!compressedBlob || isProcessing}
                aria-busy={isProcessing}
                aria-label={processButtonAriaLabel}
                onClick={handleDownload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{isAr ? 'تحميل الصورة المضغوطة' : 'Download Image'}</span>
              </button>
              <button
                type="button"
                aria-label={
                  isAr
                    ? `الملف الحالي ${sourceFile.name} — اختيار صورة جديدة`
                    : `Current file ${sourceFile.name} — Choose a different file`
                }
                onClick={() => {
                  setSourceFile(null);
                  setCompressedBlob(null);
                }}
                className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {isAr ? 'صورة جديدة' : 'Change File'}
              </button>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ImageIcon className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span className="truncate max-w-[220px] font-medium text-slate-700">
                  {sourceFile.name}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {outputDims?.width ?? dimensions?.width} × {outputDims?.height ?? dimensions?.height} px
                </span>
              </div>

              <div className="inline-flex p-1 rounded-lg bg-slate-100">
                <button
                  type="button"
                  onClick={() => setPreviewMode('compressed')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    previewMode === 'compressed'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'بعد الضغط' : 'Compressed'}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('original')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    previewMode === 'original'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'الأصلية' : 'Original'}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-4 flex items-center justify-center min-h-[320px] overflow-hidden">
              {(previewMode === 'compressed' ? compressedUrl : sourceUrl) ? (
                <img
                  src={previewMode === 'compressed' ? compressedUrl : sourceUrl}
                  alt={isAr ? 'معاينة الصورة' : 'Image compression preview'}
                  referrerPolicy="no-referrer"
                  className="max-h-[420px] w-auto object-contain rounded-lg"
                />
              ) : (
                <span className="text-sm text-slate-500">
                  {isAr ? 'جاري تحضير المعاينة...' : 'Preparing preview...'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
