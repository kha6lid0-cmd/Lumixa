export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function triggerDataUrlDownload(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export function stripExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.slice(0, lastDot) : filename;
}

export function yieldToPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function loadImageFromFile(file: File): Promise<{
  img: HTMLImageElement;
  objectUrl: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        img,
        objectUrl,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('UNREADABLE_IMAGE'));
    };
    img.src = objectUrl;
  });
}

export interface ParsedPageRange {
  label: string;
  /** Zero-based page indices for pdf-lib */
  pageIndices: number[];
}

export function parsePageRanges(
  input: string,
  totalPages: number,
  isArabic: boolean
): { ranges: ParsedPageRange[]; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      ranges: [],
      error: isArabic
        ? 'يرجى إدخال نطاق صفحات (مثال: 1-3, 5).'
        : 'Please enter at least one page or range (e.g., 1-3, 5).',
    };
  }

  // Normalize Arabic commas and digits if entered
  const normalized = trimmed
    .replace(/،/g, ',')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

  const segments = normalized
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return {
      ranges: [],
      error: isArabic ? 'صيغة النطاق غير صالحة.' : 'Invalid page range syntax.',
    };
  }

  const ranges: ParsedPageRange[] = [];

  for (const seg of segments) {
    if (/^\d+$/.test(seg)) {
      const pageNum = parseInt(seg, 10);
      if (pageNum < 1 || pageNum > totalPages) {
        return {
          ranges: [],
          error: isArabic
            ? `الصفحة ${pageNum} خارج نطاق المستند (1 إلى ${totalPages}).`
            : `Page ${pageNum} is outside the document range (1 to ${totalPages}).`,
        };
      }
      ranges.push({
        label: `p${pageNum}`,
        pageIndices: [pageNum - 1],
      });
    } else if (/^\d+\s*-\s*\d+$/.test(seg)) {
      const [startStr, endStr] = seg.split('-').map((p) => p.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (start < 1 || end < 1 || start > totalPages || end > totalPages) {
        return {
          ranges: [],
          error: isArabic
            ? `النطاق ${start}-${end} يتجاوز صفحات المستند (1 إلى ${totalPages}).`
            : `Range ${start}-${end} exceeds document length (1 to ${totalPages}).`,
        };
      }
      if (start > end) {
        return {
          ranges: [],
          error: isArabic
            ? `بداية النطاق (${start}) أكبر من نهايته (${end}).`
            : `Range start (${start}) cannot be greater than end (${end}).`,
        };
      }
      const indices: number[] = [];
      for (let p = start; p <= end; p++) {
        indices.push(p - 1);
      }
      ranges.push({
        label: `p${start}-${end}`,
        pageIndices: indices,
      });
    } else {
      return {
        ranges: [],
        error: isArabic
          ? `التعبير "${seg}" غير مفهوم. استخدم أرقاماً وفواصل مثل: 1-3, 5`
          : `Unrecognized segment "${seg}". Use numbers and hyphens like: 1-3, 5`,
      };
    }
  }

  return { ranges, error: null };
}
