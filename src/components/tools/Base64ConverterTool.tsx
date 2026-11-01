import { useState, useId } from 'react';
import { Copy, Check, Upload, ArrowRightLeft, FileCode, Download } from 'lucide-react';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';

interface Base64ConverterToolProps {
  lang: Language;
}

export function Base64ConverterTool({ lang }: Base64ConverterToolProps) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();

  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [subMode, setSubMode] = useState<'encode' | 'decode'>('encode');
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // File to Base64 state
  const [fileName, setFileName] = useState('');
  const [fileMime, setFileMime] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [fileSize, setFileSize] = useState<number | null>(null);

  const fileInputId = useId();

  const handleEncodeText = (val: string) => {
    setTextInput(val);
    setErrorMsg('');
    if (!val) {
      setTextOutput('');
      return;
    }
    try {
      // Support full UTF-8 Unicode strings
      const bytes = new TextEncoder().encode(val);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64 = btoa(binary);
      setTextOutput(b64);
      reportStatus({
        fileStatus: isAr ? 'تم تشفير النص بنجاح' : 'Text encoded successfully',
        actionStatus: '',
        isBusy: false,
      });
    } catch (err: any) {
      setErrorMsg(isAr ? 'حدث خطأ أثناء تشفير النص' : 'Failed to encode text');
    }
  };

  const handleDecodeText = (val: string) => {
    setTextInput(val);
    setErrorMsg('');
    if (!val) {
      setTextOutput('');
      return;
    }
    try {
      const cleanB64 = val.trim().replace(/^data:[^;]+;base64,/, '');
      const binary = atob(cleanB64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoded = new TextDecoder().decode(bytes);
      setTextOutput(decoded);
      reportStatus({
        fileStatus: isAr ? 'تم فك تشفير النص بنجاح' : 'Text decoded successfully',
        actionStatus: '',
        isBusy: false,
      });
    } catch (err: any) {
      setErrorMsg(isAr ? 'كود Base64 غير صالح أو غير مكتمل' : 'Invalid Base64 string');
      setTextOutput('');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileMime(file.type || 'application/octet-stream');
    setFileSize(file.size);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileBase64(result);
      reportStatus({
        fileStatus: `${isAr ? 'تم تحويل الملف' : 'File converted'}: ${file.name}`,
        actionStatus: '',
        isBusy: false,
      });
    };
    reader.onerror = () => {
      setErrorMsg(isAr ? 'فشل قراءة الملف' : 'Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadFileFromBase64 = () => {
    if (!fileBase64) return;
    const a = document.createElement('a');
    a.href = fileBase64;
    a.download = fileName ? `converted-${fileName}` : 'file.bin';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top mode tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('text');
              setErrorMsg('');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'text'
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isAr ? 'نصوص (Text)' : 'Text Converter'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('file');
              setErrorMsg('');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'file'
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isAr ? 'ملفات وصور (File / Image)' : 'File / Image to Base64'}
          </button>
        </div>

        {mode === 'text' && (
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => {
                setSubMode('encode');
                setTextInput('');
                setTextOutput('');
                setErrorMsg('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                subMode === 'encode'
                  ? 'bg-violet-700 text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {isAr ? 'تشفير (Encode)' : 'Encode'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSubMode('decode');
                setTextInput('');
                setTextOutput('');
                setErrorMsg('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                subMode === 'decode'
                  ? 'bg-violet-700 text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {isAr ? 'فك التشفير (Decode)' : 'Decode'}
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 text-sm rounded-xl bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
          {errorMsg}
        </div>
      )}

      {mode === 'text' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {subMode === 'encode'
                ? isAr
                  ? 'النص الأصلي (UTF-8):'
                  : 'Plain Text (Input):'
                : isAr
                ? 'كود Base64 المراد فكه:'
                : 'Base64 String (Input):'}
            </label>
            <textarea
              rows={8}
              value={textInput}
              onChange={(e) =>
                subMode === 'encode'
                  ? handleEncodeText(e.target.value)
                  : handleDecodeText(e.target.value)
              }
              placeholder={
                subMode === 'encode'
                  ? isAr
                    ? 'اكتب أو الصق النص هنا...'
                    : 'Type or paste plain text here...'
                  : isAr
                  ? 'الصق كود Base64 هنا...'
                  : 'Paste Base64 encoded string here...'
              }
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm font-mono focus:border-violet-500 focus:outline-none dark:text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {subMode === 'encode'
                  ? isAr
                    ? 'النتيجة بتنسيق Base64:'
                    : 'Base64 Result (Output):'
                  : isAr
                  ? 'النص المفكوك:'
                  : 'Decoded Text (Output):'}
              </label>
              {textOutput && (
                <button
                  type="button"
                  onClick={() => handleCopy(textOutput)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ' : 'Copy'}</span>
                </button>
              )}
            </div>
            <textarea
              rows={8}
              readOnly
              value={textOutput}
              placeholder={isAr ? 'ستظهر النتيجة هنا...' : 'Output will appear here...'}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 text-sm font-mono focus:outline-none dark:text-slate-100"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <label
            htmlFor={fileInputId}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 rounded-2xl p-8 cursor-pointer transition-colors text-center bg-slate-50/50 dark:bg-slate-900/40"
          >
            <Upload className="w-10 h-10 text-violet-600 mb-3" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {isAr ? 'اختر ملفاً أو صورة للتحويل إلى Base64' : 'Choose a file or image to convert to Base64'}
            </span>
            <span className="text-xs text-slate-500 mt-1">
              {isAr ? 'PNG, JPG, WebP, SVG, PDF, أو أي ملف آخر' : 'PNG, JPG, WebP, SVG, PDF, or any file'}
            </span>
            <input
              id={fileInputId}
              type="file"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>

          {fileBase64 && (
            <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <strong>{fileName}</strong> ({fileMime}) · {fileSize ? Math.round(fileSize / 1024) : 0} KB
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(fileBase64)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ كود Data URL' : 'Copy Data URL'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadFileFromBase64}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium hover:bg-slate-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تنزيل' : 'Download'}</span>
                  </button>
                </div>
              </div>

              {fileMime.startsWith('image/') && (
                <div className="max-h-48 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 p-2 flex justify-center bg-slate-50 dark:bg-slate-950">
                  <img src={fileBase64} alt={fileName} className="max-h-44 object-contain" />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? 'كود Data URL الكامل:' : 'Full Data URL:'}
                </label>
                <textarea
                  rows={4}
                  readOnly
                  value={fileBase64}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-xs font-mono focus:outline-none dark:text-slate-300"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
