import { useState, useEffect } from 'react';
import { Copy, Check, Clock, Play, RotateCcw } from 'lucide-react';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';

interface TimestampConverterToolProps {
  lang: Language;
}

export function TimestampConverterTool({ lang }: TimestampConverterToolProps) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [isLive, setIsLive] = useState(true);

  // Mode 1: Timestamp to Date
  const [inputTs, setInputTs] = useState<string>('');
  const [tsUnit, setTsUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [parsedUtc, setParsedUtc] = useState<string>('');
  const [parsedLocal, setParsedLocal] = useState<string>('');
  const [relativeTime, setRelativeTime] = useState<string>('');

  // Mode 2: Date to Timestamp
  const [dateInput, setDateInput] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [outSec, setOutSec] = useState<number | null>(null);
  const [outMs, setOutMs] = useState<number | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  // Live timer for current epoch
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Handle parsing timestamp to human-readable date
  const handleParseTimestamp = (val: string, unit = tsUnit) => {
    setInputTs(val);
    if (!val.trim()) {
      setParsedUtc('');
      setParsedLocal('');
      setRelativeTime('');
      return;
    }

    const num = Number(val.trim());
    if (isNaN(num)) {
      setParsedUtc(isAr ? 'قيمة غير صالحة' : 'Invalid timestamp');
      setParsedLocal('');
      setRelativeTime('');
      return;
    }

    const ms = unit === 'seconds' ? num * 1000 : num;
    const d = new Date(ms);

    if (isNaN(d.getTime())) {
      setParsedUtc(isAr ? 'تاريخ غير صالح' : 'Invalid date');
      setParsedLocal('');
      setRelativeTime('');
      return;
    }

    setParsedUtc(d.toUTCString());
    setParsedLocal(d.toLocaleString(isAr ? 'ar-EG' : 'en-US', { dateStyle: 'full', timeStyle: 'long' }));

    // Calculate relative time
    const diffSec = Math.floor((Date.now() - ms) / 1000);
    if (diffSec === 0) {
      setRelativeTime(isAr ? 'الآن' : 'just now');
    } else if (diffSec > 0) {
      const minutes = Math.floor(diffSec / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (days > 0) setRelativeTime(isAr ? `منذ ${days} يوم` : `${days} days ago`);
      else if (hours > 0) setRelativeTime(isAr ? `منذ ${hours} ساعة` : `${hours} hours ago`);
      else if (minutes > 0) setRelativeTime(isAr ? `منذ ${minutes} دقيقة` : `${minutes} minutes ago`);
      else setRelativeTime(isAr ? `منذ ${diffSec} ثانية` : `${diffSec} seconds ago`);
    } else {
      const futureSec = Math.abs(diffSec);
      const minutes = Math.floor(futureSec / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (days > 0) setRelativeTime(isAr ? `بعد ${days} يوم` : `in ${days} days`);
      else if (hours > 0) setRelativeTime(isAr ? `بعد ${hours} ساعة` : `in ${hours} hours`);
      else if (minutes > 0) setRelativeTime(isAr ? `بعد ${minutes} دقيقة` : `in ${minutes} minutes`);
      else setRelativeTime(isAr ? `بعد ${futureSec} ثانية` : `in ${futureSec} seconds`);
    }

    reportStatus({
      fileStatus: isAr ? 'تم تحويل الطابع الزمني' : 'Timestamp converted',
      actionStatus: '',
      isBusy: false,
    });
  };

  // Convert Date to timestamp
  const handleDateToTimestamp = (dateStr: string) => {
    setDateInput(dateStr);
    if (!dateStr) {
      setOutSec(null);
      setOutMs(null);
      return;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      setOutSec(Math.floor(d.getTime() / 1000));
      setOutMs(d.getTime());
    } else {
      setOutSec(null);
      setOutMs(null);
    }
  };

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Current Epoch Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/60">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-violet-700 dark:text-violet-400" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isAr ? 'الطابع الزمني الحالي (Unix Epoch):' : 'The current Unix epoch timestamp is:'}
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-violet-800 dark:text-violet-300">
              {currentTimestamp}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleCopy(currentTimestamp.toString(), 'current')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 text-xs font-semibold text-violet-700 dark:text-violet-300 shadow-xs"
          >
            {copied === 'current' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied === 'current' ? (isAr ? 'تم!' : 'Copied!') : isAr ? 'نسخ' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setInputTs(currentTimestamp.toString());
              handleParseTimestamp(currentTimestamp.toString());
            }}
            className="px-3 py-1.5 rounded-lg bg-violet-700 text-white text-xs font-semibold hover:bg-violet-800"
          >
            {isAr ? 'تحويل الحالي' : 'Convert Current'}
          </button>
        </div>
      </div>

      {/* Converter 1: Timestamp -> Date */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {isAr ? '1. تحويل طابع زمني (Timestamp) إلى تاريخ ووقت' : '1. Convert Epoch to Human-Readable Date'}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={inputTs}
            onChange={(e) => handleParseTimestamp(e.target.value)}
            placeholder={isAr ? 'أدخل Timestamp (مثال: 1710000000)' : 'Enter timestamp (e.g. 1710000000)'}
            className="flex-1 min-w-[200px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-sm font-mono focus:border-violet-500 focus:outline-none dark:text-slate-100"
          />

          <select
            value={tsUnit}
            onChange={(e) => {
              const u = e.target.value as 'seconds' | 'milliseconds';
              setTsUnit(u);
              handleParseTimestamp(inputTs, u);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs font-medium dark:text-slate-200"
          >
            <option value="seconds">{isAr ? 'بالثواني (Seconds)' : 'Seconds (s)'}</option>
            <option value="milliseconds">{isAr ? 'بالميلي ثانية (Milliseconds)' : 'Milliseconds (ms)'}</option>
          </select>
        </div>

        {parsedUtc && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="block text-slate-400 font-medium">UTC:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 break-words">{parsedUtc}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">{isAr ? 'التوقيت المحلي:' : 'Local Time:'}</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 break-words">{parsedLocal}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">{isAr ? 'الوقت النسبي:' : 'Relative Time:'}</span>
              <span className="font-semibold text-violet-700 dark:text-violet-400">{relativeTime}</span>
            </div>
          </div>
        )}
      </div>

      {/* Converter 2: Date -> Timestamp */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {isAr ? '2. تحويل تاريخ محدد إلى طابع زمني (Timestamp)' : '2. Convert Date & Time to Epoch Timestamp'}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => handleDateToTimestamp(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-sm dark:text-slate-100"
          />
          <button
            type="button"
            onClick={() => handleDateToTimestamp(new Date().toISOString().slice(0, 16))}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
          >
            {isAr ? 'الوقت الحالي' : 'Set to Now'}
          </button>
        </div>

        {outSec !== null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-slate-400">{isAr ? 'ثواني (Seconds):' : 'Epoch (Seconds):'}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{outSec}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(outSec.toString(), 'sec')}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {copied === 'sec' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-slate-400">{isAr ? 'ميلي ثانية (Milliseconds):' : 'Epoch (Milliseconds):'}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{outMs}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(outMs!.toString(), 'ms')}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {copied === 'ms' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
