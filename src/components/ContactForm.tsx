import { ArrowRight, CheckCircle2, Github, MessageSquareText, Send, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Language } from '../types/tools';

interface ContactFormProps {
  lang: Language;
}

export function ContactForm({ lang }: ContactFormProps) {
  const isAr = lang === Language.AR;
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'message', string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const issueTitle = useMemo(
    () =>
      isAr
        ? 'اقتراح أو مشكلة جديدة في LUMIXA'
        : 'New suggestion or issue for LUMIXA',
    [isAr]
  );

  const validate = () => {
    const nextErrors: Partial<Record<'name' | 'email' | 'message', string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = isAr ? 'يرجى إدخال الاسم.' : 'Please enter your name.';
    }

    if (!form.email.trim()) {
      nextErrors.email = isAr ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = isAr ? 'صيغة البريد الإلكتروني غير صحيحة.' : 'Please enter a valid email address.';
    }

    if (!form.message.trim()) {
      nextErrors.message = isAr ? 'يرجى كتابة الرسالة.' : 'Please enter your message.';
    } else if (form.message.trim().length < 12) {
      nextErrors.message = isAr ? 'الرسالة قصيرة جداً، أضف مزيداً من التفاصيل.' : 'Message is too short. Please add more detail.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    const body = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      '',
      'Message:',
      form.message.trim(),
    ].join('\n');

    const url = new URL('https://github.com/kha6lid0-cmd/Lumixa/issues/new');
    url.searchParams.set('title', issueTitle);
    url.searchParams.set('body', body);

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  const updateField = (field: 'name' | 'email' | 'message', value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsSubmitted(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700">
          <MessageSquareText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isAr ? 'تواصل معنا' : 'Contact LUMIXA'}
          </h2>
          <p className="text-sm text-slate-600">
            {isAr
              ? 'استخدم النموذج أدناه للبلاغ عن مشكلة أو طلب ميزة أو اقتراح تطوير.'
              : 'Use the form below to report a bug, request a feature, or share a product improvement.'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5 md:col-span-1">
          <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
            {isAr ? 'الاسم' : 'Name'}
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              id="contact-name"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
              placeholder={isAr ? 'اسمك الكامل' : 'Your full name'}
            />
          </div>
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-1.5 md:col-span-1">
          <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">
            {isAr ? 'البريد الإلكتروني' : 'Email'}
          </label>
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" aria-hidden="true">
              <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
              <path d="m5 7 7 6 7-6" />
            </svg>
            <input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
              placeholder={isAr ? 'example@email.com' : 'example@email.com'}
            />
          </div>
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div className="mt-5 space-y-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">
          {isAr ? 'الرسالة' : 'Message'}
        </label>
        <textarea
          id="contact-message"
          rows={6}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-violet-500"
          placeholder={
            isAr
              ? 'اكتب تفاصيل المشكلة أو الفكرة أو طلب الميزة ...'
              : 'Describe the issue, feature request, or suggestion ...'
          }
        />
        {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isAr ? 'إرسال إلى GitHub Issues' : 'Submit to GitHub Issues'}
        </button>

        <a
          href="https://github.com/kha6lid0-cmd/Lumixa/issues"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-500 hover:text-violet-700"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          {isAr ? 'فتح قائمة المشكلات' : 'Open issues list'}
        </a>
      </div>

      {isSubmitted && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">
              {isAr ? 'تم تجهيز الرسالة بنجاح.' : 'Your message is ready to be sent.'}
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              {isAr
                ? 'تم فتح صفحة GitHub Issues في علامة تبويب جديدة.'
                : 'A GitHub Issues tab has been opened for you.'}
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {isAr
          ? 'لا نطلب ملفات خاصة أو كلمات مرور عند الإبلاغ عن المشكلة. استخدم وصفاً واضحاً وبيانات الجهاز/المتصفح عند الإمكان.'
          : 'We do not ask for private files or passwords when reporting a problem. Include browser and device details when possible.'}
      </p>
    </form>
  );
}
