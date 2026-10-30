import { FAQItem, Language, StaticPageId, ToolCategory, ToolDefinition, ToolId } from '../types/tools';

export const TOOLS_CATALOG: ToolDefinition[] = [
  {
    id: ToolId.IMAGE_COMPRESSOR,
    category: ToolCategory.IMAGE,
    iconName: 'Minimize2',
    featured: true,
    en: {
      name: 'Image Compressor',
      shortDescription:
        'Reduce PNG, JPG, and WebP file sizes with adjustable quality control and instant visual comparison.',
      seoTitle: 'Free Image Compressor (JPG, PNG, WebP) – LUMIXA',
      seoDescription:
        'Compress JPG, PNG, and WebP images directly in your browser. Reduce file size while preserving visual clarity with zero server uploads.',
      formatsLabel: 'PNG, JPG, WebP',
      steps: [
        'Select or drag a PNG, JPG, or WebP image into the upload area.',
        'Adjust the compression quality slider and choose your preferred output format.',
        'Compare the original and compressed sizes, then download your optimized image.',
      ],
      keywords: ['compress', 'shrink', 'optimize', 'size', 'kb', 'mb', 'photo', 'jpg', 'png', 'webp'],
    },
    ar: {
      name: 'ضغط الصور',
      shortDescription:
        'تقليل حجم صور PNG وJPG وWebP مع تحكم دقيق في الجودة ومقارنة فورية قبل وبعد الضغط.',
      seoTitle: 'أداة ضغط الصور مجاناً (JPG, PNG, WebP) – LUMIXA',
      seoDescription:
        'اضغط صور JPG وPNG وWebP مباشرة في متصفحك لتقليل حجم الملفات مع الحفاظ على وضوح الصورة وخصوصيتك الكاملة.',
      formatsLabel: 'PNG, JPG, WebP',
      steps: [
        'اختر صورة بصيغة PNG أو JPG أو WebP أو اسحبها إلى منطقة الرفع.',
        'اضبط شريط مستوى الجودة واختر صيغة الإخراج المناسبة.',
        'قارن الحجم الأصلي بالحجم الجديد ثم حمّل الصورة المضغوطة فوراً.',
      ],
      keywords: ['ضغط', 'تصغير حجم', 'صور', 'جودة', 'تحسين', 'jpg', 'png', 'webp'],
    },
  },
  {
    id: ToolId.IMAGE_RESIZER,
    category: ToolCategory.IMAGE,
    iconName: 'Maximize2',
    en: {
      name: 'Image Resizer',
      shortDescription:
        'Resize images to exact pixel dimensions or percentage scales with optional aspect ratio locking.',
      seoTitle: 'Resize Images Online by Pixels or Percentage – LUMIXA',
      seoDescription:
        'Resize PNG, JPG, and WebP images to custom pixel dimensions or standard presets right in your browser for free.',
      formatsLabel: 'Exact Pixels · Ratio Lock',
      steps: [
        'Upload your PNG, JPG, or WebP image from your device.',
        'Enter target width and height in pixels or pick a quick scale preset.',
        'Preview the resized dimensions and download the new image file.',
      ],
      keywords: ['resize', 'dimensions', 'width', 'height', 'scale', 'pixels', 'aspect ratio'],
    },
    ar: {
      name: 'تغيير أبعاد الصور',
      shortDescription:
        'تعديل عرض وارتفاع الصور بالبكسل أو بالنسبة المئوية مع خيار قفل نسبة الأبعاد التلقائي.',
      seoTitle: 'تغيير حجم وأبعاد الصور أونلاين مجاناً – LUMIXA',
      seoDescription:
        'غيّر أبعاد صور PNG وJPG وWebP بالبكسل أو النسب الجاهزة مباشرة من متصفحك مجاناً وبدون رفع للخادم.',
      formatsLabel: 'تحكم بالبكسل · قفل النسبة',
      steps: [
        'ارفع صورتك بصيغة PNG أو JPG أو WebP من جهازك.',
        'أدخل العرض والارتفاع المطلوبين بالبكسل أو اختر مقاساً جاهزاً.',
        'عاين النتيجة وحمّل الصورة بالأبعاد الجديدة مباشرة.',
      ],
      keywords: ['تغيير أبعاد', 'مقاس', 'عرض', 'ارتفاع', 'بكسل', 'تكبير', 'تصغير'],
    },
  },
  {
    id: ToolId.IMAGE_CONVERTER,
    category: ToolCategory.IMAGE,
    iconName: 'RefreshCw',
    en: {
      name: 'Image Format Converter',
      shortDescription:
        'Convert single or multiple images cleanly between PNG, JPG, and modern WebP formats.',
      seoTitle: 'Convert PNG, JPG & WebP Images Online – LUMIXA',
      seoDescription:
        'Batch convert images between PNG, JPG, and WebP formats locally in your browser with customizable background fill and quality.',
      formatsLabel: 'PNG ↔ JPG ↔ WebP',
      steps: [
        'Drop one or multiple PNG, JPG, or WebP files into the converter.',
        'Choose your target output format and quality or background fill settings.',
        'Convert all files instantly and download each converted image.',
      ],
      keywords: ['convert', 'format', 'png to jpg', 'webp to png', 'jpg to webp', 'image converter'],
    },
    ar: {
      name: 'تحويل صيغ الصور',
      shortDescription:
        'تحويل صورة واحدة أو عدة صور دفعة واحدة بين صيغ PNG وJPG وWebP الحديثة بسرعة عالية.',
      seoTitle: 'تحويل صيغ الصور بين PNG وJPG وWebP مجاناً – LUMIXA',
      seoDescription:
        'حوّل صورك بين صيغ PNG وJPG وWebP مباشرة على جهازك مع دعم تحويل عدة ملفات والتحكم بلون الخلفية.',
      formatsLabel: 'PNG ↔ JPG ↔ WebP',
      steps: [
        'أضف صورة أو مجموعة صور بصيغة PNG أو JPG أو WebP.',
        'حدد الصيغة المطلوبة للتحويل واضبط إعدادات الجودة أو لون الخلفية.',
        'اضغط تحويل وحمّل كل صورة بالصيغة الجديدة بضغطة واحدة.',
      ],
      keywords: ['تحويل', 'صيغة', 'امتداد', 'png', 'jpg', 'webp', 'محول صور'],
    },
  },
  {
    id: ToolId.IMAGES_TO_PDF,
    category: ToolCategory.IMAGE,
    iconName: 'FileImage',
    en: {
      name: 'Images to PDF',
      shortDescription:
        'Combine PNG, JPG, and WebP images into a clean, ordered PDF document with A4, Letter, or auto-fit pages.',
      seoTitle: 'Convert Images to PDF (JPG, PNG, WebP to PDF) – LUMIXA',
      seoDescription:
        'Turn multiple JPG, PNG, and WebP images into a single downloadable PDF document with page size, orientation, and margin controls.',
      formatsLabel: 'JPG, PNG, WebP → PDF',
      steps: [
        'Upload one or more PNG, JPG, or WebP images and arrange their page order.',
        'Select page size (A4, US Letter, or Fit Image), orientation, and margin.',
        'Generate your PDF, inspect the preview, and download the finished file.',
      ],
      keywords: ['images to pdf', 'jpg to pdf', 'png to pdf', 'photos to pdf', 'combine images'],
    },
    ar: {
      name: 'تحويل الصور إلى PDF',
      shortDescription:
        'دمج وتحويل عدة صور PNG وJPG وWebP إلى ملف PDF منظم مع التحكم في مقاس الصفحة والهوامش.',
      seoTitle: 'تحويل الصور إلى ملف PDF مجاناً (JPG, PNG, WebP) – LUMIXA',
      seoDescription:
        'اجمع صورك بصيغ JPG وPNG وWebP في مستند PDF واحد مرتب مع اختيار مقاس A4 أو ملاءمة الصورة تلقائياً.',
      formatsLabel: 'JPG, PNG, WebP ← PDF',
      steps: [
        'ارفع صورة أو عدة صور ورتّب تسلسل ظهورها في المستند.',
        'اختر مقاس الصفحة (A4 أو Letter أو مطابق للصورة) والاتجاه والهوامش.',
        'أنشئ ملف PDF وعاينه مباشرة قبل التحميل.',
      ],
      keywords: ['صور الى pdf', 'تحويل صور pdf', 'جمع صور', 'مستند'],
    },
  },
  {
    id: ToolId.QR_GENERATOR,
    category: ToolCategory.IMAGE,
    iconName: 'QrCode',
    en: {
      name: 'QR Code Generator',
      shortDescription:
        'Create scannable, high-resolution QR codes for links, text, or contact details in PNG and SVG formats.',
      seoTitle: 'Free QR Code Generator (Download PNG & SVG) – LUMIXA',
      seoDescription:
        'Generate customizable high-resolution QR codes for URLs and text. Adjust colors, size, and error correction, and download as PNG or SVG.',
      formatsLabel: 'PNG & Vector SVG',
      steps: [
        'Enter any website URL, plain text, or Wi-Fi/contact string.',
        'Customize pixel size, error correction level, and foreground/background colors.',
        'Verify contrast and download your crisp QR code as PNG or vector SVG.',
      ],
      keywords: ['qr', 'qr code', 'barcode', 'link', 'svg', 'png', 'generator'],
    },
    ar: {
      name: 'إنشاء رمز QR',
      shortDescription:
        'توليد رموز استجابة سريعة (QR Code) عالية الدقة للروابط والنصوص مع تحميل بصيغتي PNG وSVG.',
      seoTitle: 'مولد رمز QR مجاني عالي الدقة (PNG و SVG) – LUMIXA',
      seoDescription:
        'أنشئ رمز QR مخصص للروابط والنصوص مجاناً مع التحكم بالألوان والدقة ومستوى تصحيح الخطأ وتحميل فوري.',
      formatsLabel: 'PNG وملف متجهي SVG',
      steps: [
        'أدخل رابط الموقع أو النص المطلوب تحويله إلى رمز QR.',
        'خصص الحجم والألوان ومستوى تصحيح الخطأ حسب حاجتك.',
        'حمّل الرمز بجودة عالية بصيغة PNG أو SVG المتجهية للطباعة.',
      ],
      keywords: ['رمز qr', 'باركود', 'كيو ار', 'رابط', 'مولد qr'],
    },
  },
  {
    id: ToolId.PDF_MERGER,
    category: ToolCategory.PDF,
    iconName: 'Files',
    featured: true,
    en: {
      name: 'Merge PDF Files',
      shortDescription:
        'Combine multiple PDF documents into a single file in your exact preferred order with live preview.',
      seoTitle: 'Merge PDF Files Online for Free – LUMIXA',
      seoDescription:
        'Combine two or more PDF files into one organized PDF document locally in your browser. Private, fast, and no watermarks.',
      formatsLabel: 'Multi-PDF · Local Merge',
      steps: [
        'Select two or more PDF files from your device (or load sample PDFs to test).',
        'Use the up and down controls to arrange the exact document order.',
        'Click Merge PDFs, preview the combined document, and download it.',
      ],
      keywords: ['merge pdf', 'combine pdf', 'join pdf', 'pdf binder', 'unite pdf'],
    },
    ar: {
      name: 'دمج ملفات PDF',
      shortDescription:
        'جمع ودمج عدة ملفات PDF في مستند واحد مرتب بسرعة وأمان تام على متصفحك بدون علامة مائية.',
      seoTitle: 'دمج ملفات PDF أونلاين مجاناً وبدون علامة مائية – LUMIXA',
      seoDescription:
        'ادمج ملفين أو أكثر من ملفات PDF في ملف واحد بالترتيب الذي تختاره مباشرة على جهازك وبخصوصية تامة.',
      formatsLabel: 'دمج متعدد · معالجة محلية',
      steps: [
        'اختر ملفين أو أكثر بصيغة PDF من جهازك.',
        'رتّب تسلسل الملفات للأعلى أو الأسفل حسب الرغبة.',
        'اضغط دمج الملفات وعاين المستند النهائي ثم حمّله.',
      ],
      keywords: ['دمج pdf', 'جمع pdf', 'ربط ملفات pdf', 'توحيد pdf'],
    },
  },
  {
    id: ToolId.PDF_SPLITTER,
    category: ToolCategory.PDF,
    iconName: 'Scissors',
    en: {
      name: 'Split PDF Files',
      shortDescription:
        'Extract specific pages or split PDF documents by custom page ranges with preview and validation.',
      seoTitle: 'Split PDF by Page Range Online – LUMIXA',
      seoDescription:
        'Extract selected pages or split a PDF document by page ranges (e.g., 1-3, 5) directly in your browser with instant preview.',
      formatsLabel: 'Page Ranges · Extract',
      steps: [
        'Upload your PDF document to inspect its total page count.',
        'Enter page ranges such as "1-3, 5" or click individual page numbers.',
        'Choose whether to combine extracted pages or download each range separately.',
      ],
      keywords: ['split pdf', 'extract pages', 'page range', 'cut pdf', 'separate pdf'],
    },
    ar: {
      name: 'تقسيم ملفات PDF',
      shortDescription:
        'استخراج صفحات محددة أو تقسيم ملف PDF حسب نطاقات الصفحات مع معاينة واضحة وتحقق تلقائي.',
      seoTitle: 'تقسيم ملفات PDF واستخراج الصفحات مجاناً – LUMIXA',
      seoDescription:
        'استخرج صفحات معينة أو قسّم ملف PDF حسب نطاق الصفحات (مثل 1-3, 5) مباشرة في متصفحك مع معاينة فورية.',
      formatsLabel: 'نطاقات صفحات · استخراج',
      steps: [
        'ارفع ملف PDF لمعرفة إجمالي عدد صفحاته.',
        'اكتب نطاق الصفحات مثل "1-3, 5" أو انقر على أرقام الصفحات مباشرة.',
        'اختر استخراجها في ملف واحد أو تقسيم كل نطاق في ملف مستقل ثم حمّل النتيجة.',
      ],
      keywords: ['تقسيم pdf', 'فصل صفحات pdf', 'استخراج صفحات', 'قص pdf'],
    },
  },
  {
    id: ToolId.WORD_COUNTER,
    category: ToolCategory.TEXT,
    iconName: 'AlignLeft',
    en: {
      name: 'Word & Character Counter',
      shortDescription:
        'Count words, characters, sentences, paragraphs, reading time, and top repeated words in real time.',
      seoTitle: 'Free Word & Character Counter (English & Arabic) – LUMIXA',
      seoDescription:
        'Instant word, character, sentence, and paragraph counter with estimated reading time and keyword frequency for English and Arabic text.',
      formatsLabel: 'Words · Characters · Reading Time',
      steps: [
        'Paste or type your English or Arabic text into the editor.',
        'Review live counts for words, characters (with and without spaces), sentences, and lines.',
        'Check estimated reading time and top word frequency below the editor.',
      ],
      keywords: ['word counter', 'character count', 'letter count', 'reading time', 'paragraphs'],
    },
    ar: {
      name: 'عداد الكلمات والحروف',
      shortDescription:
        'حساب فوري لعدد الكلمات والحروف والجمل والفقرات ووقت القراءة التقديري للنصوص العربية والإنجليزية.',
      seoTitle: 'عداد الكلمات والحروف أونلاين (عربي وإنجليزي) – LUMIXA',
      seoDescription:
        'احسب عدد الكلمات والحروف مع المسافات وبدونها وعدد الجمل والفقرات ووقت القراءة بدقة للنصوص العربية والإنجليزية.',
      formatsLabel: 'كلمات · حروف · وقت القراءة',
      steps: [
        'اكتب أو الصق النص العربي أو الإنجليزي داخل مربع التحرير.',
        'شاهد الإحصائيات الفورية للكلمات والحروف والجمل والأسطر.',
        'اطّلع على وقت القراءة المتوقع والكلمات الأكثر تكراراً في النص.',
      ],
      keywords: ['عداد الكلمات', 'حساب الحروف', 'عدد الاحرف', 'فقرات', 'وقت القراءة'],
    },
  },
  {
    id: ToolId.TEXT_FORMATTER,
    category: ToolCategory.TEXT,
    iconName: 'Type',
    en: {
      name: 'Text Formatter & Cleaner',
      shortDescription:
        'Remove extra spaces and empty lines, deduplicate lines, and convert capitalization in one click.',
      seoTitle: 'Online Text Formatter, Space Remover & Case Converter – LUMIXA',
      seoDescription:
        'Clean messy text by removing extra spaces, blank lines, and duplicates, or convert text between UPPERCASE, lowercase, Title Case, and Sentence case.',
      formatsLabel: 'Clean Spaces · Empty Lines · Case',
      steps: [
        'Paste your unformatted text into the workspace.',
        'Apply one-click cleanup actions to strip extra spaces, blank lines, or duplicate rows.',
        'Convert capitalization where applicable and copy the cleaned result.',
      ],
      keywords: ['text formatter', 'remove extra spaces', 'empty lines', 'uppercase', 'lowercase', 'title case'],
    },
    ar: {
      name: 'منسق ومنظف النصوص',
      shortDescription:
        'إزالة المسافات الزائدة والأسطر الفارغة والتكرار وتعديل حالة الأحرف الإنجليزية بضغطة واحدة.',
      seoTitle: 'منسق النصوص وإزالة المسافات الزائدة والأسطر الفارغة – LUMIXA',
      seoDescription:
        'نظّف النصوص الفوضوية بإزالة المسافات المكررة والأسطر الفارغة وترتيب الأسطر وتحويل حالة الأحرف الإنجليزية بسهولة.',
      formatsLabel: 'تنظيف المسافات · الأسطر · الأحرف',
      steps: [
        'الصق النص المراد تنسيقه أو تنظيفه داخل المحرر.',
        'استخدم أزرار التنظيف الفوري لإزالة المسافات المزدوجة أو الأسطر الفارغة أو المكررة.',
        'عدّل حالة الأحرف اللاتينية عند الحاجة ثم انسخ النص المنسق بضغطة واحدة.',
      ],
      keywords: ['تنسيق النصوص', 'ازالة المسافات', 'اسطر فارغة', 'تنظيف نص', 'حالة الاحرف'],
    },
  },
  {
    id: ToolId.JSON_FORMATTER,
    category: ToolCategory.DEVELOPER,
    iconName: 'Braces',
    featured: true,
    en: {
      name: 'JSON Formatter & Validator',
      shortDescription:
        'Beautify, minify, sort keys, and validate JSON data with exact line-and-column error reporting.',
      seoTitle: 'JSON Formatter, Beautifier & Validator Online – LUMIXA',
      seoDescription:
        'Validate, pretty-print, minify, and inspect JSON payloads in your browser with clear syntax error diagnostics and one-click copy.',
      formatsLabel: 'Validate · Beautify · Minify',
      steps: [
        'Paste raw JSON or upload a .json file into the input editor.',
        'Choose indentation (2 spaces, 4 spaces, or Tab) to format, or click Minify.',
        'Fix any highlighted line/column syntax errors and copy the formatted output in one click.',
      ],
      keywords: ['json', 'json formatter', 'json validator', 'beautify json', 'minify json', 'lint'],
    },
    ar: {
      name: 'منسق ومدقق JSON',
      shortDescription:
        'تنسيق وضغط والتحقق من صحة بيانات JSON مع تحديد دقيق لموقع الأخطاء البرمجية ونسخ فوري.',
      seoTitle: 'منسق ومدقق JSON أونلاين للمطورين – LUMIXA',
      seoDescription:
        'تحقق من صحة بيانات JSON وقم بتنسيقها أو ضغطها وترتيب المفاتيح مع رسائل خطأ واضحة تحدد السطر والعمود.',
      formatsLabel: 'تحقق · تنسيق · ضغط',
      steps: [
        'الصق كود JSON الخام أو ارفع ملف .json داخل المحرر.',
        'اختر حجم المسافة البادئة لتنسيق الكود أو اضغط ضغط (Minify) لتقليص الحجم.',
        'راجع رسائل التحقق الدقيقة وانسخ المخرجات المنسقة بضغطة زر واحدة.',
      ],
      keywords: ['json', 'تنسيق json', 'مدقق json', 'مطورين', 'فحص json'],
    },
  },
  {
    id: ToolId.PDF_TO_IMAGES,
    category: ToolCategory.PDF,
    iconName: 'FileImage',
    featured: true,
    en: {
      name: 'PDF to JPG & PNG Converter',
      shortDescription: 'Convert PDF pages into clear JPG or PNG images directly in your browser.',
      seoTitle: 'Convert PDF to JPG or PNG Online – LUMIXA',
      seoDescription: 'Turn every page of a PDF into a downloadable JPG or PNG image locally in your browser with adjustable resolution.',
      formatsLabel: 'PDF → JPG · PNG',
      steps: ['Choose a PDF file from your device.', 'Select JPG or PNG and the image resolution.', 'Preview pages and download individual images or all pages.'],
      keywords: ['pdf to jpg', 'pdf to png', 'convert pdf to image', 'pdf pages to images'],
    },
    ar: {
      name: 'تحويل PDF إلى صور',
      shortDescription: 'حوّل صفحات ملفات PDF إلى صور JPG أو PNG واضحة مباشرة داخل متصفحك.',
      seoTitle: 'تحويل PDF إلى JPG وPNG أونلاين مجاناً – LUMIXA',
      seoDescription: 'حوّل كل صفحة من ملف PDF إلى صورة JPG أو PNG قابلة للتحميل محلياً مع التحكم في دقة الإخراج.',
      formatsLabel: 'PDF ← JPG · PNG',
      steps: ['اختر ملف PDF من جهازك.', 'حدد صيغة JPG أو PNG ودقة الصور.', 'عاين الصفحات وحمّل صورة واحدة أو جميع الصفحات.'],
      keywords: ['تحويل pdf الى jpg', 'تحويل pdf الى png', 'pdf الى صورة', 'صور من pdf'],
    },
  },
  {
    id: ToolId.PASSWORD_GENERATOR,
    category: ToolCategory.DEVELOPER,
    iconName: 'ShieldCheck',
    featured: true,
    en: {
      name: 'Strong Password Generator',
      shortDescription: 'Generate random, cryptographically secure passwords locally without storing or sending them.',
      seoTitle: 'Free Strong Password Generator – LUMIXA',
      seoDescription: 'Create strong random passwords with custom length, symbols, numbers, and uppercase characters entirely in your browser.',
      formatsLabel: 'Secure · Local · Customizable',
      steps: ['Choose the password length and character types.', 'Generate a fresh password using your device cryptography.', 'Copy it to your password manager and do not share it.'],
      keywords: ['password generator', 'strong password', 'secure password', 'random password'],
    },
    ar: {
      name: 'مولد كلمات المرور القوية',
      shortDescription: 'أنشئ كلمات مرور عشوائية وآمنة محلياً دون حفظها أو إرسالها إلى أي خادم.',
      seoTitle: 'مولد كلمات مرور قوية وآمنة مجاناً – LUMIXA',
      seoDescription: 'أنشئ كلمات مرور عشوائية قوية مع التحكم بالطول والرموز والأرقام والأحرف الكبيرة داخل متصفحك بالكامل.',
      formatsLabel: 'آمن · محلي · قابل للتخصيص',
      steps: ['حدد طول كلمة المرور وأنواع الأحرف المطلوبة.', 'أنشئ كلمة مرور جديدة باستخدام مولد التشفير في جهازك.', 'انسخها إلى مدير كلمات المرور ولا تشاركها مع أي شخص.'],
      keywords: ['مولد كلمات المرور', 'كلمة مرور قوية', 'كلمة مرور آمنة', 'إنشاء باسورد'],
    },
  },
];

export const UI_STRINGS: Record<
  Language,
  {
    siteTitle: string;
    siteMetaDescription: string;
    nav: {
      image: string;
      pdf: string;
      text: string;
      developer: string;
      faq: string;
      switchLangLabel: string;
    };
    hero: {
      kicker: string;
      headline: string;
      subtitle: string;
      searchPlaceholder: string;
      clearSearch: string;
      popularLabel: string;
      browseToolsCta: string;
    };
    categories: Record<ToolCategory, string>;
    categoryDescriptions: Record<Exclude<ToolCategory, ToolCategory.ALL>, string>;
    catalog: {
      heading: string;
      subheading: string;
      openTool: string;
      noResultsTitle: string;
      noResultsBody: string;
      resetFilters: string;
      toolsCount: (count: number) => string;
    };
    trustStrip: {
      heading: string;
      items: { title: string; description: string }[];
    };
    workspace: {
      homeBreadcrumb: string;
      backToAll: string;
      howToTitle: string;
      privacyNotice: string;
      relatedToolsTitle: string;
    };
    ads: {
      reservedLabel: string;
      nonIntrusiveNote: string;
    };
    faq: {
      heading: string;
      subheading: string;
      items: FAQItem[];
    };
    footer: {
      tagline: string;
      categoriesHeading: string;
      resourcesHeading: string;
      sitemapLink: string;
      robotsLink: string;
      freeForeverNote: string;
      copyright: string;
    };
    pages: Record<StaticPageId, { title: string; description: string }>;
  }
> = {
  [Language.EN]: {
    siteTitle: 'LUMIXA – Free All-in-One Digital Tools Platform',
    siteMetaDescription:
      'Free browser-based digital tools to compress, resize, and convert images, merge and split PDFs, format text, validate JSON, and generate QR codes in English and Arabic.',
    nav: {
      image: 'Image Tools',
      pdf: 'PDF Tools',
      text: 'Text Tools',
      developer: 'Developer',
      faq: 'FAQ',
      switchLangLabel: 'العربية',
    },
    hero: {
      kicker: '100% Free · No Login Required · Browser-Side Privacy',
      headline: 'Essential digital tools that run right in your browser.',
      subtitle:
        'Compress and convert images, merge or split PDFs, clean messy text, validate JSON, and create crisp QR codes—instantly, privately, and completely free.',
      searchPlaceholder: 'Search tools (e.g., compress image, merge PDF, JSON, QR code)...',
      clearSearch: 'Clear',
      popularLabel: 'Quick access:',
      browseToolsCta: 'Explore All Tools',
    },
    categories: {
      [ToolCategory.ALL]: 'All Tools',
      [ToolCategory.IMAGE]: 'Image Tools',
      [ToolCategory.PDF]: 'PDF Tools',
      [ToolCategory.TEXT]: 'Text Tools',
      [ToolCategory.DEVELOPER]: 'Developer Tools',
    },
    categoryDescriptions: {
      [ToolCategory.IMAGE]: 'Optimize, resize, convert formats, build PDFs, and generate QR codes.',
      [ToolCategory.PDF]: 'Combine multiple PDF documents or split pages cleanly without watermarks.',
      [ToolCategory.TEXT]: 'Analyze word counts, strip extra whitespace, and standardize capitalization.',
      [ToolCategory.DEVELOPER]: 'Validate syntax, format payloads, and inspect structured JSON data.',
    },
    catalog: {
      heading: 'Digital Tool Directory',
      subheading: 'Select any tool to start working immediately—no account, watermarks, or upload queues.',
      openTool: 'Open Tool',
      noResultsTitle: 'No matching tools found',
      noResultsBody: 'Try searching for a format like PNG, PDF, QR, or JSON, or reset your filter.',
      resetFilters: 'Show All Tools',
      toolsCount: (count: number) => `${count} ${count === 1 ? 'tool' : 'tools'} available`,
    },
    trustStrip: {
      heading: 'Built for speed, clarity, and local file privacy',
      items: [
        {
          title: '01. Files stay on your device',
          description:
            'Images, PDFs, text, and JSON payloads are processed locally using modern browser APIs—never uploaded to external servers.',
        },
        {
          title: '02. Always free, zero sign-ups',
          description:
            'Every core utility is unlocked out of the box with no accounts, no trial limits, and no watermarks on downloaded files.',
        },
        {
          title: '03. Bilingual English & Arabic UX',
          description:
            'Engineered from the ground up with native LTR and RTL layouts for seamless usability across iPhone, tablet, and desktop.',
        },
      ],
    },
    workspace: {
      homeBreadcrumb: 'Home',
      backToAll: 'All Tools',
      howToTitle: 'How to use this tool',
      privacyNotice: 'Processed locally in your browser. Your files are never uploaded to any server.',
      relatedToolsTitle: 'More tools you might need',
    },
    ads: {
      reservedLabel: 'Reserved Advertisement Space',
      nonIntrusiveNote: 'Layout space reserved for future sponsor placement',
    },
    faq: {
      heading: 'Frequently Asked Questions',
      subheading: 'Clear answers about how LUMIXA handles your files, privacy, and supported formats.',
      items: [
        {
          question: 'Are all tools on LUMIXA completely free to use?',
          answer:
            'Yes. Every image, PDF, text, and developer utility on LUMIXA is free to use without registration, subscriptions, or watermarks. The platform is designed to remain free and supported by non-intrusive advertising in the future.',
        },
        {
          question: 'Are my uploaded images and PDF documents sent to a server?',
          answer:
            'No. LUMIXA processes your images, PDFs, QR codes, text, and JSON directly inside your web browser using open-source JavaScript libraries and HTML5 APIs. Your files stay on your own device.',
        },
        {
          question: 'Which file formats are supported?',
          answer:
            'Image tools support PNG, JPG/JPEG, and WebP formats (plus PNG and SVG downloads for QR codes). Document tools support standard unencrypted PDF files, and developer tools support standard RFC 8259 JSON.',
        },
        {
          question: 'Does LUMIXA work on iPhone, Android, tablets, and in Arabic?',
          answer:
            'Yes. Every workspace is responsive for touch and desktop screens and includes one-click switching between English (LTR) and Arabic (RTL).',
        },
        {
          question: 'Why did a password-protected PDF fail to merge or split?',
          answer:
            'Encrypted or password-locked PDFs restrict page extraction for security reasons. Unlock the PDF in your viewer first, then upload the unlocked copy to merge or split pages.',
        },
      ],
    },
    footer: {
      tagline:
        'A fast, free all-in-one digital tools platform built for everyday productivity with browser-side privacy.',
      categoriesHeading: 'Tool Categories',
      resourcesHeading: 'Platform & SEO',
      sitemapLink: 'XML Sitemap',
      robotsLink: 'Robots.txt',
      freeForeverNote: 'Free to use · No registration · Local browser processing',
      copyright: `© ${new Date().getFullYear()} LUMIXA. All rights reserved.`,
    },
    pages: {
      [StaticPageId.PRIVACY_POLICY]: {
        title: 'Privacy Policy',
        description: 'How LUMIXA handles your information and protects your files.',
      },
      [StaticPageId.TERMS_OF_USE]: {
        title: 'Terms of Use',
        description: 'The terms that apply when you use the free LUMIXA tools.',
      },
      [StaticPageId.ABOUT_US]: {
        title: 'About Us',
        description: 'Learn what LUMIXA is and why it was built.',
      },
      [StaticPageId.CONTACT_US]: {
        title: 'Contact Us',
        description: 'Get help, report an issue, or suggest an improvement to LUMIXA.',
      },
    },
  },
  [Language.AR]: {
    siteTitle: 'LUMIXA – منصة الأدوات الرقمية المجانية المتكاملة',
    siteMetaDescription:
      'منصة لوميكسا المجانية لضغط الصور وتغيير أبعادها وتحويل الصيغ ودمج وتقسيم ملفات PDF وتنسيق النصوص وفحص JSON وإنشاء رموز QR مباشرة من متصفحك.',
    nav: {
      image: 'أدوات الصور',
      pdf: 'أدوات PDF',
      text: 'أدوات النصوص',
      developer: 'أدوات المطورين',
      faq: 'الأسئلة الشائعة',
      switchLangLabel: 'English',
    },
    hero: {
      kicker: 'مجاني بالكامل · بدون تسجيل حساب · معالجة محلية آمنة',
      headline: 'أدواتك الرقمية الأساسية تعمل فوراً داخل متصفحك.',
      subtitle:
        'اضغط الصور وحوّل صيغها، ادمج وقسّم ملفات PDF، نظّف النصوص، افحص بيانات JSON، وأنشئ رموز QR عالية الدقة — بسرعة، مجاناً، وبخصوصية تامة على جهازك.',
      searchPlaceholder: 'ابحث عن أداة (مثل: ضغط الصور، دمج PDF، عداد الكلمات، JSON)...',
      clearSearch: 'مسح',
      popularLabel: 'وصول سريع:',
      browseToolsCta: 'استعراض جميع الأدوات',
    },
    categories: {
      [ToolCategory.ALL]: 'جميع الأدوات',
      [ToolCategory.IMAGE]: 'أدوات الصور',
      [ToolCategory.PDF]: 'أدوات PDF',
      [ToolCategory.TEXT]: 'أدوات النصوص',
      [ToolCategory.DEVELOPER]: 'أدوات المطورين',
    },
    categoryDescriptions: {
      [ToolCategory.IMAGE]: 'ضغط الصور وتعديل المقاسات وتحويل الصيغ وإنشاء ملفات PDF ورموز QR.',
      [ToolCategory.PDF]: 'دمج عدة مستندات PDF أو استخراج الصفحات وتقسيمها بدون علامات مائية.',
      [ToolCategory.TEXT]: 'حساب الكلمات والحروف بدقة وإزالة المسافات الزائدة والأسطر الفارغة.',
      [ToolCategory.DEVELOPER]: 'التحقق من صحة بيانات JSON وتنسيقها وضغطها مع رسائل خطأ واضحة.',
    },
    catalog: {
      heading: 'دليل الأدوات الرقمية',
      subheading: 'اختر أي أداة للبدء فوراً — بدون حسابات أو اشتراكات أو علامات مائية.',
      openTool: 'فتح الأداة',
      noResultsTitle: 'لم يتم العثور على أدوات مطابقة',
      noResultsBody: 'جرّب البحث باسم الصيغة مثل PNG أو PDF أو QR أو JSON، أو أعد ضبط التصنيف.',
      resetFilters: 'عرض جميع الأدوات',
      toolsCount: (count: number) => `${count} أداة متاحة`,
    },
    trustStrip: {
      heading: 'مصممة للسرعة والوضوح وحماية خصوصية ملفاتك',
      items: [
        {
          title: '01. ملفاتك تبقى على جهازك',
          description:
            'تتم معالجة الصور وملفات PDF والنصوص وبيانات JSON محلياً داخل متصفحك دون رفعها إلى أي خوادم خارجية.',
        },
        {
          title: '02. مجانية دائماً وبدون تسجيل',
          description:
            'جميع الأدوات الأساسية مفتوحة بالكامل بدون إنشاء حساب أو خطط مدفوعة أو علامات مائية على الملفات المحمّلة.',
        },
        {
          title: '03. تجربة عربية وإنجليزية متكاملة',
          description:
            'دعم كامل لاتجاهي RTL وLTR مع تصميم متجاوب يعمل بسلاسة على هواتف iPhone والأجهزة اللوحية والحواسيب.',
        },
      ],
    },
    workspace: {
      homeBreadcrumb: 'الرئيسية',
      backToAll: 'جميع الأدوات',
      howToTitle: 'كيفية استخدام هذه الأداة',
      privacyNotice: 'تتم المعالجة محلياً داخل متصفحك؛ لا يتم رفع ملفاتك إلى أي خادم خارجي.',
      relatedToolsTitle: 'أدوات أخرى قد تهمك',
    },
    ads: {
      reservedLabel: 'مساحة إعلانية مخصصة',
      nonIntrusiveNote: 'مساحة مهيأة لإعلانات مستقبلية دون التأثير على تجربة الاستخدام',
    },
    faq: {
      heading: 'الأسئلة الشائعة',
      subheading: 'إجابات واضحة حول خصوصية الملفات والصيغ المدعومة وطريقة عمل منصة LUMIXA.',
      items: [
        {
          question: 'هل جميع أدوات LUMIXA مجانية بالكامل؟',
          answer:
            'نعم، كافة أدوات الصور وملفات PDF والنصوص والمطورين مجانية تماماً بدون تسجيل دخول أو اشتراكات شهرية أو علامات مائية، ومصممة لتكون مدعومة مستقبلاً بمساحات إعلانية غير مزعجة.',
        },
        {
          question: 'هل يتم رفع صوري أو ملفات PDF الخاصة بي إلى خادم خارجي؟',
          answer:
            'لا. تعمل أدوات LUMIXA عبر تقنيات المتصفح الحديثة ومكتبات مفتوحة المصدر لمعالجة ملفاتك مباشرة على جهازك الشخصي، مما يحافظ على خصوصيتك وسرعة الأداء.',
        },
        {
          question: 'ما هي صيغ الملفات المدعومة في المنصة؟',
          answer:
            'تدعم أدوات الصور صيغ PNG وJPG/JPEG وWebP (بالإضافة إلى PNG وSVG لرموز QR)، وتدعم أدوات المستندات ملفات PDF القياسية غير المشفرة، وتدعم أداة المطورين صيغة JSON القياسية.',
        },
        {
          question: 'هل يعمل الموقع على هواتف iPhone والأجهزة اللوحية؟',
          answer:
            'بالتأكيد. تم تصميم الواجهة لتكون متجاوبة بالكامل مع الشاشات اللمسية والحواسيب المكتبية مع تبديل فوري بين العربية (RTL) والإنجليزية (LTR).',
        },
        {
          question: 'لماذا يتعذر دمج أو تقسيم ملف PDF محمي بكلمة مرور؟',
          answer:
            'ملفات PDF المشفرة تمنع قراءة الصفحات لأسباب أمنية. يرجى إزالة الحماية من الملف أولاً عبر قارئ PDF الخاص بك ثم رفعه لإتمام الدمج أو التقسيم.',
        },
      ],
    },
    footer: {
      tagline:
        'منصة أدوات رقمية مجانية شاملة وسريعة مصممة لإنجاز مهامك اليومية بخصوصية كاملة داخل المتصفح.',
      categoriesHeading: 'أقسام الأدوات',
      resourcesHeading: 'المنصة ومحركات البحث',
      sitemapLink: 'خريطة الموقع (Sitemap)',
      robotsLink: 'ملف Robots.txt',
      freeForeverNote: 'مجاني بالكامل · بدون تسجيل · معالجة محلية آمنة',
      copyright: `© ${new Date().getFullYear()} LUMIXA. جميع الحقوق محفوظة.`,
    },
    pages: {
      [StaticPageId.PRIVACY_POLICY]: {
        title: 'سياسة الخصوصية',
        description: 'كيف تتعامل LUMIXA مع معلوماتك وتحافظ على خصوصية ملفاتك.',
      },
      [StaticPageId.TERMS_OF_USE]: {
        title: 'شروط الاستخدام',
        description: 'الشروط المطبقة عند استخدام أدوات LUMIXA المجانية.',
      },
      [StaticPageId.ABOUT_US]: {
        title: 'من نحن',
        description: 'تعرّف على LUMIXA والهدف من إنشائها.',
      },
      [StaticPageId.CONTACT_US]: {
        title: 'اتصل بنا',
        description: 'احصل على المساعدة أو أبلغ عن مشكلة أو اقترح تطويراً لـ LUMIXA.',
      },
    },
  },
};
