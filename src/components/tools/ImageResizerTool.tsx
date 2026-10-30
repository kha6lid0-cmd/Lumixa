import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Download, Lock, Sparkles, Unlock, Upload } from 'lucide-react';
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

export function ImageResizerTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  const [widthInput, setWidthInput] = useState<string>('');
  const [heightInput, setHeightInput] = useState<string>('');
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    };
  }, [sourceUrl, resizedUrl]);

  const handleFileSelection = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError(
        isAr
          ? 'يرجى رفع صورة بصيغة PNG أو JPG أو WebP فقط.'
          : 'Please upload a PNG, JPG, or WebP image file.'
      );
      return;
    }

    try {
      const loaded = await loadImageFromFile(file);
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      setSourceFile(file);
      setSourceUrl(loaded.objectUrl);
      setOrigWidth(loaded.width);
      setOrigHeight(loaded.height);
      setWidthInput(String(loaded.width));
      setHeightInput(String(loaded.height));
    } catch {
      setError(
        isAr ? 'تعذر قراءة الصورة المختارة.' : 'Unable to read the selected image file.'
      );
    }
  };

  const handleWidthChange = (val: string) => {
    setWidthInput(val);
    const num = parseInt(val, 10);
    if (lockAspect && origWidth > 0 && Number.isFinite(num) && num > 0) {
      const nextH = Math.max(1, Math.round((num / origWidth) * origHeight));
      setHeightInput(String(nextH));
    }
  };

  const handleHeightChange = (val: string) => {
    setHeightInput(val);
    const num = parseInt(val, 10);
    if (lockAspect && origHeight > 0 && Number.isFinite(num) && num > 0) {
      const nextW = Math.max(1, Math.round((num / origHeight) * origWidth));
      setWidthInput(String(nextW));
    }
  };

  const applyScalePreset = (factor: number) => {
    if (!origWidth || !origHeight) return;
    const nextW = Math.max(1, Math.round(origWidth * factor));
    const nextH = Math.max(1, Math.round(origHeight * factor));
    setWidthInput(String(nextW));
    setHeightInput(String(nextH));
  };

  const applyDimensionPreset = (w: number, h: number) => {
    setLockAspect(false);
    setWidthInput(String(w));
    setHeightInput(String(h));
  };

  useEffect(() => {
    if (!sourceFile || !sourceUrl) return;
    const w = parseInt(widthInput, 10);
    const h = parseInt(heightInput, 10);

    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1 || w > 8000 || h > 8000) {
      setResizedBlob(null);
      setIsResizing(false);
      if (widthInput !== '' && heightInput !== '') {
        setError(
          isAr
            ? 'يرجى إدخال أبعاد صحيحة بين 1 و 8000 بكسل.'
            : 'Please enter valid dimensions between 1 and 8000 pixels.'
        );
      }
      return;
    }

    setError(null);
    setIsResizing(true);
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsResizing(false);
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      const mime = ['image/png', 'image/jpeg', 'image/webp'].includes(sourceFile.type)
        ? sourceFile.type
        : 'image/png';

      canvas.toBlob(
        (blob) => {
          if (cancelled) return;
          setIsResizing(false);
          if (!blob) return;
          setResizedBlob(blob);
          setResizedUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });
        },
        mime,
        0.92
      );
    };
    img.onerror = () => {
      if (!cancelled) setIsResizing(false);
    };
    img.src = sourceUrl;

    return () => {
      cancelled = true;
    };
  }, [sourceFile, sourceUrl, widthInput, heightInput, isAr]);

  const handleDownload = () => {
    if (!resizedBlob || !sourceFile) return;
    const ext =
      sourceFile.type === 'image/jpeg'
        ? 'jpg'
        : sourceFile.type === 'image/webp'
        ? 'webp'
        : 'png';
    triggerBlobDownload(
      resizedBlob,
      `${stripExtension(sourceFile.name)}-${widthInput}x${heightInput}.${ext}`
    );
  };

  const uploadStateLabel = sourceFile
    ? isAr
      ? `الملف ${sourceFile.name} جاهز`
      : `File ${sourceFile.name} ready`
    : isAr
    ? 'لم يتم اختيار ملف — اختر صورة لتغيير أبعادها'
    : 'No file selected — Choose an image to resize';

  const resizeDownloadLabel = !sourceFile
    ? isAr
      ? 'لم يتم اختيار ملف'
      : 'No file selected'
    : resizedBlob
    ? isAr
      ? `الملف ${sourceFile.name} جاهز — تحميل بالأبعاد ${widthInput}×${heightInput} بكسل`
      : `File ${sourceFile.name} ready — Download resized image (${widthInput} by ${heightInput} pixels)`
    : isAr
    ? `تعذر تغيير أبعاد ${sourceFile.name} — أدخل أبعاداً صحيحة بين 1 و 8000`
    : `Cannot resize ${sourceFile.name} — enter valid dimensions between 1 and 8000 pixels`;

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
      actionStatus: isResizing
        ? isAr
          ? 'جاري تغيير أبعاد الصورة'
          : 'Resizing image'
        : resizedBlob
        ? isAr
          ? `جاهز بالأبعاد ${widthInput}×${heightInput} بكسل`
          : `Ready at ${widthInput} by ${heightInput} pixels`
        : isAr
        ? 'بانتظار أبعاد صالحة'
        : 'Awaiting valid pixel dimensions',
      isBusy: isResizing,
    });
  }, [sourceFile, isResizing, resizedBlob, widthInput, heightInput, isAr, reportStatus]);

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
            {isAr ? 'اختر صورة لتغيير أبعادها' : 'Select an image to resize'}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500">
            {isAr
              ? 'PNG و JPG و WebP · تحكم دقيق بالبكسل أو النسبة المئوية'
              : 'PNG, JPG, and WebP · Exact pixel dimensions or percentage presets'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              aria-label={uploadStateLabel}
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              {isAr ? 'رفع صورة' : 'Choose Image'}
            </button>
            <button
              type="button"
              aria-label={
                isAr
                  ? 'لم يتم اختيار ملف — تجربة صورة نموذجية لتعديل الأبعاد'
                  : 'No file selected — Load sample image to test resizing'
              }
              onClick={async () => handleFileSelection(await createSampleImageFile())}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-violet-600" aria-hidden="true" />
              <span>{isAr ? 'تجربة صورة نموذجية' : 'Try Sample Image'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-5 p-5 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="resize-w" className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? 'العرض (px)' : 'Width (px)'}
                </label>
                <input
                  id="resize-w"
                  type="number"
                  min={1}
                  max={8000}
                  value={widthInput}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-violet-600 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="resize-h" className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? 'الارتفاع (px)' : 'Height (px)'}
                </label>
                <input
                  id="resize-h"
                  type="number"
                  min={1}
                  max={8000}
                  value={heightInput}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-violet-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLockAspect((prev) => !prev)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors ${
                lockAspect
                  ? 'border-violet-200 bg-violet-50 text-violet-800'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <span>
                {isAr ? 'الحفاظ على نسبة العرض للارتفاع' : 'Lock original aspect ratio'}
              </span>
              {lockAspect ? (
                <Lock className="w-4 h-4 text-violet-700" aria-hidden="true" />
              ) : (
                <Unlock className="w-4 h-4 text-slate-400" aria-hidden="true" />
              )}
            </button>

            <div>
              <span className="block text-xs font-medium text-slate-700 mb-2">
                {isAr ? 'تحجيم سريع بالنسبة المئوية' : 'Quick percentage scale'}
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[0.25, 0.5, 0.75, 1].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => applyScalePreset(pct)}
                    className="py-1.5 rounded-lg border border-slate-200 bg-white hover:border-violet-400 text-xs font-mono tabular-nums font-medium text-slate-700 transition-colors"
                  >
                    {pct * 100}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-700 mb-2">
                {isAr ? 'مقاسات قياسية جاهزة' : 'Standard pixel presets'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyDimensionPreset(1920, 1080)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-violet-400 text-xs text-slate-700 font-mono tabular-nums"
                >
                  1920 × 1080
                </button>
                <button
                  type="button"
                  onClick={() => applyDimensionPreset(1080, 1080)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-violet-400 text-xs text-slate-700 font-mono tabular-nums"
                >
                  1080 × 1080
                </button>
                <button
                  type="button"
                  onClick={() => applyDimensionPreset(1200, 630)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-violet-400 text-xs text-slate-700 font-mono tabular-nums"
                >
                  1200 × 630
                </button>
                <button
                  type="button"
                  onClick={() => applyDimensionPreset(800, 600)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-violet-400 text-xs text-slate-700 font-mono tabular-nums"
                >
                  800 × 600
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">{isAr ? 'الأبعاد الأصلية:' : 'Original:'}</span>
                <span className="font-mono tabular-nums text-slate-900">
                  {origWidth} × {origHeight} px
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{isAr ? 'الأبعاد الجديدة:' : 'New dimensions:'}</span>
                <span className="font-mono tabular-nums font-semibold text-violet-700">
                  {widthInput || '—'} × {heightInput || '—'} px
                </span>
              </div>
              {resizedBlob && (
                <div className="flex justify-between">
                  <span className="text-slate-600">{isAr ? 'حجم الملف الناتج:' : 'Output size:'}</span>
                  <span className="font-mono tabular-nums text-slate-900">
                    {formatBytes(resizedBlob.size)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                disabled={!resizedBlob}
                aria-label={resizeDownloadLabel}
                onClick={handleDownload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{isAr ? 'تحميل الصورة المعدلة' : 'Download Resized'}</span>
              </button>
              <button
                type="button"
                aria-label={
                  isAr
                    ? `الملف الحالي ${sourceFile.name} — اختيار صورة أخرى`
                    : `Current file ${sourceFile.name} — Select a new image`
                }
                onClick={() => {
                  setSourceFile(null);
                  setResizedBlob(null);
                }}
                className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {isAr ? 'صورة أخرى' : 'New Image'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-4 flex items-center justify-center min-h-[340px] overflow-hidden">
              {resizedUrl ? (
                <img
                  src={resizedUrl}
                  alt={isAr ? 'معاينة الصورة بعد تعديل الأبعاد' : 'Resized image preview'}
                  referrerPolicy="no-referrer"
                  className="max-h-[420px] w-auto object-contain rounded-lg"
                />
              ) : (
                <span className="text-sm text-slate-500">
                  {isAr ? 'أدخل أبعاداً صالحة لعرض المعاينة' : 'Enter valid dimensions to preview'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
