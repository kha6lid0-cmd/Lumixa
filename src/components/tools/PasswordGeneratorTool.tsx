import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Copy, RefreshCw, ShieldCheck } from 'lucide-react';
import { useWorkspaceA11y } from '../../context/WorkspaceA11yContext';
import { Language } from '../../types/tools';

interface Props { lang: Language }

function secureRandom(max: number): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const values = new Uint32Array(1);
    const limit = Math.floor(0xffffffff / max) * max;
    do { crypto.getRandomValues(values); } while (values[0] >= limit);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function makePassword(length: number, pools: string[]): string {
  const pool = pools.join('');
  if (!pool) return '';
  const chars = pools.map((item) => item[secureRandom(item.length)]);
  while (chars.length < length) chars.push(pool[secureRandom(pool.length)]);
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = secureRandom(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('').slice(0, length);
}

export function PasswordGeneratorTool({ lang }: Props) {
  const isAr = lang === Language.AR;
  const { reportStatus } = useWorkspaceA11y();
  const [length, setLength] = useState(20);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const pools = useMemo(() => [
    includeUpper ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : '',
    includeLower ? 'abcdefghijkmnopqrstuvwxyz' : '',
    includeNumbers ? '23456789' : '',
    includeSymbols ? '!@#$%^&*()-_=+[]{}:,.?' : '',
  ].filter(Boolean), [includeUpper, includeLower, includeNumbers, includeSymbols]);

  const generate = useCallback(() => {
    if (!pools.length) return;
    setPassword(makePassword(length, pools));
    setCopied(false);
  }, [length, pools]);

  useEffect(() => { generate(); }, [generate]);

  const copyPassword = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    reportStatus({
      fileStatus: isAr ? 'تم إنشاء كلمة مرور قوية محلياً' : 'Strong password generated locally',
      actionStatus: isAr ? 'تم نسخ كلمة المرور' : 'Password copied',
      isBusy: false,
    });
    window.setTimeout(() => setCopied(false), 1800);
  };

  const strength = password.length >= 18 && pools.length >= 3 ? (isAr ? 'قوية جداً' : 'Very strong') : password.length >= 12 ? (isAr ? 'قوية' : 'Strong') : (isAr ? 'متوسطة' : 'Moderate');

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" aria-hidden="true" />
        <p>{isAr ? 'تتم العملية بالكامل على جهازك. لا يتم حفظ كلمة المرور أو إرسالها إلى أي خادم.' : 'Everything runs on your device. The password is not saved or sent to any server.'}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="password-length" className="text-sm font-semibold text-slate-800">{isAr ? 'طول كلمة المرور' : 'Password length'}</label>
          <span className="font-mono text-sm font-bold text-violet-700">{length}</span>
        </div>
        <input id="password-length" type="range" min="8" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="mt-3 w-full accent-violet-700" />
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            [includeUpper, setIncludeUpper, isAr ? 'أحرف كبيرة' : 'Uppercase letters'],
            [includeLower, setIncludeLower, isAr ? 'أحرف صغيرة' : 'Lowercase letters'],
            [includeNumbers, setIncludeNumbers, isAr ? 'أرقام' : 'Numbers'],
            [includeSymbols, setIncludeSymbols, isAr ? 'رموز' : 'Symbols'],
          ].map(([checked, setter, label]) => (
            <label key={String(label)} className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
              <input type="checkbox" checked={Boolean(checked)} onChange={(e) => (setter as (value: boolean) => void)(e.target.checked)} className="h-4 w-4 accent-violet-700" />
              <span>{String(label)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <label htmlFor="generated-password" className="text-xs font-semibold uppercase tracking-wide text-slate-500">{isAr ? 'كلمة المرور الناتجة' : 'Generated password'}</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input id="generated-password" readOnly value={password} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 font-mono text-sm text-slate-900" aria-label={isAr ? 'كلمة المرور الناتجة' : 'Generated password'} />
          <button type="button" onClick={copyPassword} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>{isAr ? `القوة: ${strength}` : `Strength: ${strength}`}</span>
          <button type="button" onClick={generate} className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-violet-700 hover:text-violet-900">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {isAr ? 'توليد جديد' : 'Generate new'}
          </button>
        </div>
      </div>
    </div>
  );
}
