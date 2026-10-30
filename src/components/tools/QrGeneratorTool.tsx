import { useEffect, useState } from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';
import { triggerBlobDownload, triggerDataUrlDownload } from '../../utils/fileHelpers';

interface Props {
  lang: Language;
}

type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

function getRelativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function QrGeneratorTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();

  const [content, setContent] = useState<string>('https://lumixa.github.io');
  const [size, setSize] = useState<number>(512);
  const [ecLevel, setEcLevel] = useState<ErrorCorrection>('M');
  const [margin, setMargin] = useState<number>(2);
  const [fgColor, setFgColor] = useState<string>('#2E1065');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fgLum = getRelativeLuminance(fgColor);
  const bgLum = getRelativeLuminance(bgColor);
  const contrastRatio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  const lowContrast = contrastRatio < 3.5 || fgLum >= bgLum;

  useEffect(() => {
    const trimmed = content.trim();
    if (!trimmed) {
      setPngDataUrl('');
      setSvgMarkup('');
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const opts = {
          errorCorrectionLevel: ecLevel,
          margin,
          width: size,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        };
        const [dataUrl, svgStr] = await Promise.all([
          QRCode.toDataURL(trimmed, opts),
          QRCode.toString(trimmed, { ...opts, type: 'svg' }),
        ]);
        if (!cancelled) {
          setPngDataUrl(dataUrl);
          setSvgMarkup(svgStr);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError(
            isAr
              ? 'النص المدخل طويل جداً ليتم تضمينه في رمز QR واحد. يرجى اختصاره.'
              : 'The entered text exceeds maximum QR code capacity. Please shorten the input.'
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [content, size, ecLevel, margin, fgColor, bgColor, isAr]);

  const handleDownloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    triggerBlobDownload(blob, 'lumixa-qrcode.svg');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="qr-input" className="text-sm font-medium text-slate-800">
              {isAr ? 'الرابط أو النص' : 'URL or Text Content'}
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setContent('https://lumixa.github.io')}
                className="text-violet-700 hover:underline"
              >
                {isAr ? 'مثال رابط' : 'Sample URL'}
              </button>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setContent('WIFI:T:WPA;S:LumixaGuest;P:Welcome2026;;')}
                className="text-violet-700 hover:underline"
              >
                {isAr ? 'شبكة Wi-Fi' : 'Wi-Fi Format'}
              </button>
            </div>
          </div>
          <textarea
            id="qr-input"
            rows={3}
            dir="auto"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isAr ? 'أدخل رابط موقع أو نصاً هنا...' : 'Enter website URL, plain text, or Wi-Fi config...'
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div>
            <label htmlFor="qr-size" className="block text-xs font-medium text-slate-700 mb-1.5">
              {isAr ? 'الدقة (بكسل)' : 'Resolution'}
            </label>
            <select
              id="qr-size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-violet-600 focus:outline-none"
            >
              <option value={256}>256 × 256 px</option>
              <option value={512}>512 × 512 px</option>
              <option value={1024}>1024 × 1024 px</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-ec" className="block text-xs font-medium text-slate-700 mb-1.5">
              {isAr ? 'تصحيح الخطأ' : 'Error Correction'}
            </label>
            <select
              id="qr-ec"
              value={ecLevel}
              onChange={(e) => setEcLevel(e.target.value as ErrorCorrection)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
            >
              <option value="L">{isAr ? 'منخفض (7%)' : 'Low (7%)'}</option>
              <option value="M">{isAr ? 'متوسط (15%)' : 'Medium (15%)'}</option>
              <option value="Q">{isAr ? 'عالي (25%)' : 'Quartile (25%)'}</option>
              <option value="H">{isAr ? 'أقصى دقة (30%)' : 'High (30%)'}</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-margin" className="block text-xs font-medium text-slate-700 mb-1.5">
              {isAr ? 'الهامش المحيط' : 'Quiet Margin'}
            </label>
            <select
              id="qr-margin"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-violet-600 focus:outline-none"
            >
              <option value={1}>1 block</option>
              <option value={2}>2 blocks</option>
              <option value={4}>4 blocks</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div>
            <label htmlFor="qr-fg" className="block text-xs font-medium text-slate-700 mb-1.5">
              {isAr ? 'لون الرمز' : 'Foreground Color'}
            </label>
            <div className="flex items-center gap-2.5">
              <input
                id="qr-fg"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-9 w-12 rounded border border-slate-300 bg-white p-0.5"
              />
              <span className="text-xs font-mono text-slate-700 uppercase">{fgColor}</span>
            </div>
          </div>

          <div>
            <label htmlFor="qr-bg" className="block text-xs font-medium text-slate-700 mb-1.5">
              {isAr ? 'لون الخلفية' : 'Background Color'}
            </label>
            <div className="flex items-center gap-2.5">
              <input
                id="qr-bg"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-12 rounded border border-slate-300 bg-white p-0.5"
              />
              <span className="text-xs font-mono text-slate-700 uppercase">{bgColor}</span>
            </div>
          </div>
        </div>

        {lowContrast && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              {isAr
                ? 'تنبيه: التباين ضعيف أو لون الرمز أفتح من الخلفية، مما قد يصعّب قراءته بكاميرا الهاتف.'
                : 'Contrast note: Keep the foreground darker than the background with strong contrast so phone cameras scan reliably.'}
            </span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-800">
            {error}
          </div>
        )}
      </div>

      {/* Preview & Download Column */}
      <div className="lg:col-span-5 p-6 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col items-center text-center">
        <div className="w-56 h-56 rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-center">
          {pngDataUrl ? (
            <img
              src={pngDataUrl}
              alt={isAr ? 'رمز QR المولد' : 'Generated QR Code'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xs text-slate-400">
              {isAr ? 'أدخل نصاً لتوليد الرمز' : 'Enter text to generate QR'}
            </span>
          )}
        </div>

        <p className="mt-3 text-xs text-slate-500 font-mono tabular-nums">
          {size} × {size} px · EC {ecLevel}
        </p>

        <div className="mt-5 w-full grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={!pngDataUrl}
            aria-label={
              pngDataUrl
                ? isAr
                  ? `رمز QR جاهز — تحميل بصيغة PNG (${size}×${size} بكسل)`
                  : `QR code ready — Download PNG (${size} by ${size} pixels)`
                : isAr
                ? 'تحميل PNG غير متاح — أدخل نصاً أولاً'
                : 'Download PNG unavailable — enter text or URL first'
            }
            onClick={() => {
              reportStatus({
                fileStatus: isAr ? `تم تحميل رمز QR بصيغة PNG` : `QR code PNG downloaded`,
                actionStatus: '',
                isBusy: false,
              });
              triggerDataUrlDownload(pngDataUrl, `lumixa-qr-${size}px.png`);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-800 disabled:opacity-40 text-white text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{isAr ? 'تحميل PNG' : 'Download PNG'}</span>
          </button>
          <button
            type="button"
            disabled={!svgMarkup}
            aria-label={
              svgMarkup
                ? isAr
                  ? 'رمز QR جاهز — تحميل بصيغة SVG المتجهية'
                  : 'QR code ready — Download vector SVG'
                : isAr
                ? 'تحميل SVG غير متاح — أدخل نصاً أولاً'
                : 'Download SVG unavailable — enter text or URL first'
            }
            onClick={() => {
              reportStatus({
                fileStatus: isAr ? `تم تحميل رمز QR بصيغة SVG` : `QR code SVG downloaded`,
                actionStatus: '',
                isBusy: false,
              });
              handleDownloadSvg();
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{isAr ? 'تحميل SVG' : 'Download SVG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
