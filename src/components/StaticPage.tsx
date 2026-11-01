import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { Language, StaticPageId } from '../types/tools';

interface StaticPageProps {
  pageId: StaticPageId;
  lang: Language;
  onNavigateHome: () => void;
}

interface PageCopy {
  title: string;
  description: string;
  intro: string;
  sections: { heading: string; body: string }[];
  back: string;
  contactCta?: string;
}

const GITHUB_ISSUES_URL = 'https://github.com/kha6lid0-cmd/Lumixa/issues';
const GITHUB_REPO_URL = 'https://github.com/kha6lid0-cmd/Lumixa';

const PAGE_COPY: Record<Language, Record<StaticPageId, PageCopy>> = {
  [Language.EN]: {
    [StaticPageId.PRIVACY_POLICY]: {
      title: 'Privacy Policy',
      description: 'How LUMIXA handles your information and protects your files.',
      intro:
        'LUMIXA is designed around browser-side processing. Our core tools work on your device so you can use them without creating an account or uploading your files to our servers.',
      sections: [
        {
          heading: 'Files and tool processing',
          body:
            'Images, PDFs, text, JSON, and QR code data are processed locally in your browser. LUMIXA does not receive or store the files you select for the tools. Closing the page or clearing browser data removes temporary processing data created by the browser.',
        },
        {
          heading: 'Information stored in your browser',
          body:
            'LUMIXA stores your language preference in localStorage so the interface can remember English or Arabic on your next visit. This preference stays on your device and is not sent to LUMIXA.',
        },
        {
          heading: 'Hosting and third-party services',
          body:
            'The website is hosted by Cloudflare Pages and the source code is published in a public GitHub repository. The page also loads web fonts from Google Fonts. These services may process standard technical request information according to their own policies. LUMIXA does not currently require registration, payment, or an account.',
        },
        {
          heading: 'Advertising and future changes',
          body:
            'Reserved advertising spaces may be used in the future. If advertising, analytics, or other external services are added, this policy will be updated before those services are introduced.',
        },
        {
          heading: 'Questions about privacy',
          body:
            'For privacy questions or concerns, contact the project maintainers through the LUMIXA GitHub Issues page linked on the Contact Us page.',
        },
      ],
      back: 'Back to LUMIXA',
    },
    [StaticPageId.TERMS_OF_USE]: {
      title: 'Terms of Use',
      description: 'The terms that apply when you use the free LUMIXA tools.',
      intro:
        'By using LUMIXA, you agree to use the website responsibly and in accordance with applicable laws. These terms are intended to keep the service clear, safe, and free to use.',
      sections: [
        {
          heading: 'Free browser-based service',
          body:
            'LUMIXA provides browser-based utilities for general productivity. The tools are offered free of charge, without registration, subscriptions, or guaranteed service levels.',
        },
        {
          heading: 'Your files and responsibility',
          body:
            'You are responsible for the files and content you process. Keep your own backups of important documents. Do not use LUMIXA to process content that you do not have the right to use or that violates applicable law.',
        },
        {
          heading: 'No warranty',
          body:
            'The tools are provided on an “as is” and “as available” basis. We work to keep results accurate, but we cannot guarantee uninterrupted availability or that every file and browser combination will produce a perfect result.',
        },
        {
          heading: 'Acceptable use',
          body:
            'Do not attempt to disrupt the website, bypass security controls, misuse automated requests, or use the service for unlawful, harmful, or abusive activity.',
        },
        {
          heading: 'Updates to these terms',
          body:
            'LUMIXA may update these terms when the platform changes. The latest version will remain available on this page.',
        },
      ],
      back: 'Back to LUMIXA',
    },
    [StaticPageId.ABOUT_US]: {
      title: 'About Us',
      description: 'Learn what LUMIXA is and why it was built.',
      intro:
        'LUMIXA is a free, bilingual collection of practical digital tools for everyday work. It is built to be fast, simple, and privacy-first, with processing that happens directly in your browser whenever possible.',
      sections: [
        {
          heading: 'What LUMIXA offers',
          body:
            'The platform includes image compression, resizing and conversion, images-to-PDF, QR generation, PDF merging and splitting, text cleanup, word counting, and JSON formatting and validation.',
        },
        {
          heading: 'Built for English and Arabic',
          body:
            'Every main experience supports English and Arabic, including LTR and RTL layouts. The responsive interface is designed for iPhone, Android, tablets, and desktop browsers.',
        },
        {
          heading: 'Privacy by design',
          body:
            'LUMIXA avoids mandatory accounts and processes supported files locally in the browser. This keeps common tasks quick while reducing the need to send personal files to a remote service.',
        },
        {
          heading: 'Open development',
          body:
            'The project is published on GitHub so its source, improvements, and issue discussions can be reviewed openly. Suggestions and bug reports are welcome.',
        },
      ],
      back: 'Back to LUMIXA',
      contactCta: 'Suggest an improvement',
    },
    [StaticPageId.CONTACT_US]: {
      title: 'Contact Us',
      description: 'Get help, report an issue, or suggest an improvement to LUMIXA.',
      intro:
        'The best way to contact the LUMIXA project is through GitHub Issues. You can report a broken tool, request a new feature, or suggest an improvement without sharing private files or secrets.',
      sections: [
        {
          heading: 'Report a problem',
          body:
            'Include the tool name, your device and browser, the steps that caused the problem, and the exact error message if one appears. Do not upload private documents, API keys, passwords, or personal information to an issue.',
        },
        {
          heading: 'Request a feature',
          body:
            'Describe the task you want LUMIXA to support, the input and output formats you need, and whether the feature should work entirely in the browser.',
        },
        {
          heading: 'Project repository',
          body:
            'You can review the source code, follow updates, and open a discussion from the public LUMIXA repository.',
        },
      ],
      back: 'Back to LUMIXA',
      contactCta: 'Open GitHub Issues',
    },
  },
  [Language.AR]: {
    [StaticPageId.PRIVACY_POLICY]: {
      title: 'سياسة الخصوصية',
      description: 'كيف تتعامل LUMIXA مع معلوماتك وتحافظ على خصوصية ملفاتك.',
      intro:
        'صُممت LUMIXA لتعمل بالمعالجة المحلية داخل المتصفح. تعمل الأدوات الأساسية على جهازك دون الحاجة إلى إنشاء حساب أو رفع ملفاتك إلى خوادمنا.',
      sections: [
        {
          heading: 'الملفات ومعالجة الأدوات',
          body:
            'تتم معالجة الصور وملفات PDF والنصوص وبيانات JSON ورموز QR محلياً داخل متصفحك. لا تستقبل LUMIXA الملفات التي تختارها للأدوات ولا تخزنها على خوادمها. يؤدي إغلاق الصفحة أو مسح بيانات المتصفح إلى إزالة بيانات المعالجة المؤقتة التي أنشأها المتصفح.',
        },
        {
          heading: 'المعلومات المخزنة في متصفحك',
          body:
            'تخزن LUMIXA تفضيل اللغة في localStorage حتى تتذكر الواجهة اختيار العربية أو الإنجليزية في زيارتك القادمة. يبقى هذا التفضيل على جهازك ولا يتم إرساله إلى LUMIXA.',
        },
        {
          heading: 'الاستضافة والخدمات الخارجية',
          body:
            'تتم استضافة الموقع عبر Cloudflare Pages، كما أن مصدر المشروع منشور في مستودع GitHub عام، ويتم تحميل الخطوط من Google Fonts. قد تعالج هذه الخدمات معلومات تقنية قياسية وفق سياساتها الخاصة. لا تتطلب LUMIXA حالياً التسجيل أو الدفع أو إنشاء حساب.',
        },
        {
          heading: 'الإعلانات والتغييرات المستقبلية',
          body:
            'قد يتم استخدام المساحات الإعلانية المحجوزة مستقبلاً. إذا تمت إضافة إعلانات أو تحليلات أو خدمات خارجية أخرى، فسيتم تحديث هذه السياسة قبل تشغيلها.',
        },
        {
          heading: 'الاستفسارات المتعلقة بالخصوصية',
          body:
            'للاستفسارات أو الملاحظات حول الخصوصية، تواصل مع مشرفي المشروع عبر صفحة GitHub Issues الموجودة في صفحة اتصل بنا.',
        },
      ],
      back: 'العودة إلى LUMIXA',
    },
    [StaticPageId.TERMS_OF_USE]: {
      title: 'شروط الاستخدام',
      description: 'الشروط المطبقة عند استخدام أدوات LUMIXA المجانية.',
      intro:
        'باستخدامك LUMIXA، فإنك توافق على استخدام الموقع بمسؤولية ووفق القوانين المعمول بها. تهدف هذه الشروط إلى إبقاء الخدمة واضحة وآمنة ومجانية.',
      sections: [
        {
          heading: 'خدمة مجانية تعمل عبر المتصفح',
          body:
            'توفر LUMIXA أدوات متصفح للإنتاجية العامة. الأدوات مجانية دون تسجيل أو اشتراكات أو ضمان لمستوى توفر محدد.',
        },
        {
          heading: 'مسؤوليتك عن الملفات',
          body:
            'أنت مسؤول عن الملفات والمحتوى الذي تعالجه. احتفظ بنسخ احتياطية من مستنداتك المهمة، ولا تستخدم LUMIXA لمعالجة محتوى لا تملك حق استخدامه أو يخالف القوانين المعمول بها.',
        },
        {
          heading: 'بدون ضمان',
          body:
            'تقدم الأدوات كما هي وحسب التوفر. نعمل على إبقاء النتائج دقيقة، لكن لا نضمن التشغيل دون انقطاع أو الحصول على نتيجة مثالية لكل ملف ومتصفح.',
        },
        {
          heading: 'الاستخدام المقبول',
          body:
            'يُمنع تعطيل الموقع أو تجاوز ضوابط الأمان أو إساءة استخدام الطلبات الآلية أو استخدام الخدمة في نشاط غير قانوني أو ضار أو مسيء.',
        },
        {
          heading: 'تحديث الشروط',
          body:
            'قد يتم تحديث هذه الشروط عند تغيير المنصة، وستبقى أحدث نسخة متاحة في هذه الصفحة.',
        },
      ],
      back: 'العودة إلى LUMIXA',
    },
    [StaticPageId.ABOUT_US]: {
      title: 'من نحن',
      description: 'تعرّف على LUMIXA والهدف من إنشائها.',
      intro:
        'LUMIXA منصة مجانية ثنائية اللغة تضم أدوات رقمية عملية للاستخدام اليومي. صُممت لتكون سريعة وبسيطة وتركز على الخصوصية، مع تنفيذ المعالجة داخل المتصفح كلما أمكن.',
      sections: [
        {
          heading: 'ماذا تقدم LUMIXA؟',
          body:
            'تضم المنصة ضغط الصور وتغيير أبعادها وتحويل صيغها، تحويل الصور إلى PDF، إنشاء رموز QR، دمج وتقسيم ملفات PDF، تنظيف النصوص، عد الكلمات، وتنسيق JSON والتحقق منه.',
        },
        {
          heading: 'مصممة للعربية والإنجليزية',
          body:
            'تدعم التجربة الأساسية العربية والإنجليزية مع اتجاهي RTL وLTR. كما صُممت الواجهة المتجاوبة لهواتف iPhone وAndroid والأجهزة اللوحية والحواسيب.',
        },
        {
          heading: 'الخصوصية من البداية',
          body:
            'لا تفرض LUMIXA إنشاء حساب، وتعالج الملفات المدعومة محلياً داخل المتصفح. يساعد ذلك على إنجاز المهام بسرعة ويقلل الحاجة إلى إرسال الملفات الشخصية لخدمة خارجية.',
        },
        {
          heading: 'تطوير مفتوح',
          body:
            'المشروع منشور على GitHub حتى يمكن مراجعة مصدره وتطويراته ومناقشة مشكلاته بشكل مفتوح. نرحب بالاقتراحات وتقارير الأخطاء.',
        },
      ],
      back: 'العودة إلى LUMIXA',
      contactCta: 'اقترح تحسيناً',
    },
    [StaticPageId.CONTACT_US]: {
      title: 'اتصل بنا',
      description: 'احصل على المساعدة أو أبلغ عن مشكلة أو اقترح تطويراً لـ LUMIXA.',
      intro:
        'أفضل طريقة للتواصل مع مشروع LUMIXA هي عبر GitHub Issues. يمكنك الإبلاغ عن أداة لا تعمل أو طلب ميزة جديدة أو اقتراح تحسين دون مشاركة ملفات خاصة أو أسرار.',
      sections: [
        {
          heading: 'الإبلاغ عن مشكلة',
          body:
            'اذكر اسم الأداة والجهاز والمتصفح والخطوات التي سببت المشكلة ورسالة الخطأ كاملة إن ظهرت. لا ترفع مستندات خاصة أو مفاتيح API أو كلمات مرور أو معلومات شخصية داخل البلاغ.',
        },
        {
          heading: 'طلب ميزة جديدة',
          body:
            'اشرح المهمة التي تريد أن تدعمها LUMIXA، وصيغ الإدخال والإخراج المطلوبة، وما إذا كان من المهم أن تعمل الميزة بالكامل داخل المتصفح.',
        },
        {
          heading: 'مستودع المشروع',
          body:
            'يمكنك مراجعة الكود ومتابعة التحديثات وفتح نقاش من خلال مستودع LUMIXA العام.',
        },
      ],
      back: 'العودة إلى LUMIXA',
      contactCta: 'فتح GitHub Issues',
    },
  },
};

export function StaticPage({ pageId, lang, onNavigateHome }: StaticPageProps) {
  const copy = PAGE_COPY[lang][pageId];
  const isAr = lang === Language.AR;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <button
        type="button"
        onClick={onNavigateHome}
        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900 transition-colors"
      >
        {isAr ? <ArrowRight className="w-4 h-4" aria-hidden="true" /> : <ArrowLeft className="w-4 h-4" aria-hidden="true" />}
        {copy.back}
      </button>

      <header className="mt-8 border-b border-slate-200 pb-8">
        <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">{copy.title}</h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">{copy.description}</p>
      </header>

      <div className="mt-8 space-y-8">
        <p className="text-base leading-8 text-slate-700">{copy.intro}</p>
        {copy.sections.map((section) => (
          <section key={section.heading} className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
            <p className="mt-3 text-sm sm:text-base leading-8 text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>

      {copy.contactCta && (
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={pageId === StaticPageId.CONTACT_US ? GITHUB_ISSUES_URL : GITHUB_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800 transition-colors"
          >
            {copy.contactCta}
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
          {pageId === StaticPageId.CONTACT_US && (
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-violet-500 hover:text-violet-700 transition-colors"
            >
              {isAr ? 'فتح المستودع' : 'Open repository'}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
