import { useEffect, useState } from 'react';
import { Download, Share2, Sparkles, X } from 'lucide-react';
import { Language } from '../types/tools';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallBannerProps { lang: Language }
const DISMISS_KEY = 'lumixa-install-dismissed-at';
const DISMISS_DAYS = 7;

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

function wasDismissedRecently() {
  try {
    const value = Number(localStorage.getItem(DISMISS_KEY));
    return Number.isFinite(value) && Date.now() - value < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch { return false; }
}

export function InstallBanner({ lang }: InstallBannerProps) {
  const isAr = lang === Language.AR;
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const ios = isIos();

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) {
      setInstalled(isStandalone());
      return;
    }
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const handleInstalled = () => { setInstalled(true); setVisible(false); setDeferredPrompt(null); };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    if (ios) setVisible(true);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, [ios]);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* privacy mode */ }
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible || installed || (!ios && !deferredPrompt)) return null;

  return (
    <aside className="lumixa-install-banner" dir={isAr ? 'rtl' : 'ltr'} aria-label={isAr ? 'تثبيت تطبيق LUMIXA' : 'Install LUMIXA app'}>
      <div className="lumixa-install-banner__content">
        <div className="lumixa-install-banner__glow" aria-hidden="true" />
        <div className="lumixa-install-banner__icon" aria-hidden="true"><Sparkles /></div>
        <div className="lumixa-install-banner__copy">
          <div className="lumixa-install-banner__eyebrow">{isAr ? 'تجربة أسرع على الجوال' : 'A faster mobile experience'}</div>
          <h2>{isAr ? 'ثبّت LUMIXA كتطبيق' : 'Install LUMIXA as an app'}</h2>
          {ios ? <p>{isAr ? 'اضغط مشاركة ثم إضافة إلى الشاشة الرئيسية.' : 'Tap Share, then Add to Home Screen.'}</p> : <p>{isAr ? 'افتح أدواتك بسرعة من الشاشة الرئيسية.' : 'Open your tools quickly from your home screen.'}</p>}
          {ios && <div className="lumixa-install-guide"><span className="lumixa-install-guide__step">1</span><Share2 className="h-3.5 w-3.5" aria-hidden="true" /><span>{isAr ? 'مشاركة' : 'Share'}</span><span className="lumixa-install-guide__arrow">→</span><span className="lumixa-install-guide__step">2</span><span>{isAr ? 'إضافة إلى الشاشة الرئيسية' : 'Add to Home Screen'}</span></div>}
        </div>
        <div className="lumixa-install-banner__actions">
          {ios ? <button type="button" className="lumixa-install-banner__primary" onClick={dismiss}>{isAr ? 'فهمت' : 'Got it'}</button> : <button type="button" className="lumixa-install-banner__primary" onClick={install}><Download className="h-4 w-4" aria-hidden="true" />{isAr ? 'تثبيت' : 'Install'}</button>}
          <button type="button" className="lumixa-install-banner__close" onClick={dismiss} aria-label={isAr ? 'إغلاق' : 'Close'}><X className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>
    </aside>
  );
}
