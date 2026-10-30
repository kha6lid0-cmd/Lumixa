import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Download, RefreshCw, Sparkles, Trash2, Upload } from 'lucide-react';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';
import {
  formatBytes,
  loadImageFromFile,
  stripExtension,
  triggerBlobDownload,
  yieldToPaint,
} from '../../utils/fileHelpers';
import { createSampleImageFile } from '../../utils/sampleAssets';

interface Props {
  lang: Language;
}

type TargetMime = 'image/webp' | 'image/jpeg' | 'image/png';

interface ConvertedItem {
  id: string;
  originalFile: File;
  width: number;
  height: number;
  outputBlob: Blob | null;
  previewUrl: string;
}

export function ImageConverterTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [targetMime, setTargetMime] = useState<TargetMime>('image/webp');
  const [quality, setQuality] = useState<number>(88);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertSingleFile = async (
    file: File,
    mime: TargetMime,
    q: number,
    bg: string
  ): Promise<{ blob: Blob; width: number; height: number; previewUrl: string }> => {
    const loaded = await loadImageFromFile(file);
    const canvas = document.createElement('canvas');
    canvas.width = loaded.width;
    canvas.height = loaded.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(loaded.objectUrl);
      throw new Error('Canvas unavailable');
    }

    if (mime === 'image/jpeg') {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, loaded.width, loaded.height);
    }

    ctx.drawImage(loaded.img, 0, 0);
    URL.revokeObjectURL(loaded.objectUrl);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Conversion failed'))),
        mime,
        mime === 'image/png' ? undefined : q / 100
      );
    });

    return {
      blob,
      width: loaded.width,
      height: loaded.height,
      previewUrl: URL.createObjectURL(blob),
    };
  };

  const addFiles = async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    if (arr.length === 0) return;
    setError(null);

    const valid = arr.filter((f) => ['image/png', 'image/jpeg', 'image/webp'].includes(f.type));
    if (valid.length === 0) {
      setError(
        isAr
          ? 'يرجى رفع ملفات صور مدعومة (PNG أو JPG أو WebP).'
          : 'Please select supported image files (PNG, JPG, or WebP).'
      );
      return;
    }

    setIsConverting(true);
    try {
      await yieldToPaint();
      const nextItems: ConvertedItem[] = [];
      for (const file of valid) {
        const res = await convertSingleFile(file, targetMime, quality, bgColor);
        nextItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          originalFile: file,
          width: res.width,
          height: res.height,
          outputBlob: res.blob,
          previewUrl: res.previewUrl,
        });
      }
      setItems((prev) => [...prev, ...nextItems]);
    } catch {
      setError(
        isAr ? 'حدث خطأ أثناء تحويل إحدى الصور.' : 'An error occurred while converting an image.'
      );
    } finally {
      setIsConverting(false);
    }
  };

  // Re-convert existing items when target settings change
  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;
    setIsConverting(true);

    (async () => {
      try {
        await yieldToPaint();
        const updated: ConvertedItem[] = [];
        for (const item of items) {
          const res = await convertSingleFile(item.originalFile, targetMime, quality, bgColor);
          updated.push({
            ...item,
            outputBlob: res.blob,
            previewUrl: res.previewUrl,
          });
        }
        if (!cancelled) {
          setItems((prev) => {
            prev.forEach((old) => URL.revokeObjectURL(old.previewUrl));
            return updated;
          });
        } else {
          updated.forEach((u) => URL.revokeObjectURL(u.previewUrl));
        }
      } finally {
        if (!cancelled) setIsConverting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMime, quality, bgColor]);

  const extLabel =
    targetMime === 'image/webp' ? 'webp' : targetMime === 'image/jpeg' ? 'jpg' : 'png';

  const handleDownloadItem = (item: ConvertedItem) => {
    if (!item.outputBlob) return;
    triggerBlobDownload(item.outputBlob, `${stripExtension(item.originalFile.name)}.${extLabel}`);
  };

  const handleClearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
  };

  const uploadAriaLabel =
    items.length === 0
      ? isAr
        ? 'لم يتم اختيار ملف — اختر صور PNG أو JPG أو WebP للتحويل'
        : 'No file selected — Select PNG, JPG, or WebP images to convert'
      : items.length === 1
      ? isAr
        ? `الملف ${items[0].originalFile.name} جاهز — إضافة المزيد من الصور`
        : `File ${items[0].originalFile.name} ready — Select additional images`
      : isAr
      ? `${items.length} ملفات جاهزة — إضافة المزيد من الصور`
      : `${items.length} files ready — Select additional images`;

  useEffect(() => {
    if (items.length === 0) {
      reportStatus({
        fileStatus: isAr ? 'لم يتم اختيار ملف' : 'No file selected',
        actionStatus: isConverting
          ? isAr
            ? `جاري التحويل إلى ${extLabel.toUpperCase()}`
            : `Converting to ${extLabel.toUpperCase()}`
          : '',
        isBusy: isConverting,
      });
      return;
    }
    const fileSummary =
      items.length === 1
        ? isAr
          ? `الملف ${items[0].originalFile.name} جاهز`
          : `File ${items[0].originalFile.name} ready`
        : isAr
        ? `${items.length} ملفات جاهزة`
        : `${items.length} files ready`;

    reportStatus({
      fileStatus: fileSummary,
      actionStatus: isConverting
        ? isAr
          ? `جاري التحويل إلى ${extLabel.toUpperCase()}`
          : `Converting to ${extLabel.toUpperCase()}`
        : isAr
        ? `تم التحويل إلى ${extLabel.toUpperCase()}`
        : `Converted to ${extLabel.toUpperCase()}`,
      isBusy: isConverting,
    });
  }, [items, isConverting, extLabel, isAr, reportStatus]);

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

      {/* Format Settings Bar */}
      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="conv-target" className="block text-xs font-medium text-slate-700 mb-1.5">
            {isAr ? 'تحويل إلى صيغة' : 'Convert to format'}
          </label>
          <select
            id="conv-target"
            value={targetMime}
            onChange={(e) => setTargetMime(e.target.value as TargetMime)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-violet-600 focus:outline-none"
          >
            <option value="image/webp">WebP (.webp)</option>
            <option value="image/jpeg">JPG (.jpg)</option>
            <option value="image/png">PNG (.png)</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
            <label htmlFor="conv-quality">{isAr ? 'الجودة' : 'Output quality'}</label>
            <span className="font-mono tabular-nums text-violet-700">
              {targetMime === 'image/png' ? (isAr ? 'كاملة' : 'Lossless') : `${quality}%`}
            </span>
          </div>
          <input
            id="conv-quality"
            type="range"
            min={20}
            max={100}
            value={quality}
            disabled={targetMime === 'image/png'}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-violet-700 disabled:opacity-40"
          />
        </div>

        <div>
          <label htmlFor="conv-bg" className="block text-xs font-medium text-slate-700 mb-1.5">
            {isAr ? 'خلفية الشفافية (عند JPG)' : 'Transparency fill (for JPG)'}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="conv-bg"
              type="color"
              value={bgColor}
              disabled={targetMime !== 'image/jpeg'}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-9 w-12 rounded border border-slate-300 bg-white p-0.5 disabled:opacity-40"
            />
            <span className="text-xs font-mono text-slate-600 uppercase">{bgColor}</span>
          </div>
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
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
            if (e.target.files) addFiles(e.target.files);
            e.target.value = '';
          }}
          className="sr-only"
        />
        <Upload className="w-7 h-7 text-violet-700 mx-auto mb-2.5" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-900">
          {isAr
            ? 'أضف صورة أو عدة صور لتحويل صيغتها دفعة واحدة'
            : 'Drop one or multiple PNG, JPG, or WebP images here'}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            aria-label={uploadAriaLabel}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold transition-colors whitespace-nowrap"
          >
            {isAr ? 'اختيار صور' : 'Select Images'}
          </button>
          <button
            type="button"
            onClick={async () => addFiles([await createSampleImageFile()])}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-violet-600" aria-hidden="true" />
            <span>{isAr ? 'إضافة صورة نموذجية' : 'Add Sample Image'}</span>
          </button>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:text-red-700 hover:border-red-200 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>{isAr ? 'مسح الكل' : 'Clear All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Converted Files List */}
      {items.length > 0 && (
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={item.previewUrl}
                  alt={item.originalFile.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {stripExtension(item.originalFile.name)}.{extLabel}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
                    <span>
                      {item.width}×{item.height}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{formatBytes(item.originalFile.size)}</span>
                    <span aria-hidden="true">→</span>
                    <span className="font-semibold text-violet-700">
                      {item.outputBlob ? formatBytes(item.outputBlob.size) : '...'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={isConverting || !item.outputBlob}
                  aria-busy={isConverting}
                  aria-label={
                    isConverting
                      ? isAr
                        ? `جاري تحويل الملف ${item.originalFile.name}`
                        : `Converting file ${item.originalFile.name}, please wait`
                      : isAr
                      ? `الملف ${stripExtension(item.originalFile.name)}.${extLabel} جاهز — تحميل`
                      : `File ${stripExtension(item.originalFile.name)}.${extLabel} ready — Download ${extLabel.toUpperCase()}`
                  }
                  onClick={() => handleDownloadItem(item)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  {isConverting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {isAr ? `تحميل ${extLabel.toUpperCase()}` : `Download ${extLabel.toUpperCase()}`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(item.previewUrl);
                    setItems((prev) => prev.filter((x) => x.id !== item.id));
                  }}
                  aria-label={isAr ? 'حذف' : 'Remove'}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
