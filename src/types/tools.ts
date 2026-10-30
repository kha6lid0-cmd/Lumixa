export enum Language {
  EN = 'en',
  AR = 'ar',
}

export enum ToolCategory {
  ALL = 'all',
  IMAGE = 'image',
  PDF = 'pdf',
  TEXT = 'text',
  DEVELOPER = 'developer',
}

export enum ToolId {
  IMAGE_COMPRESSOR = 'image-compressor',
  IMAGE_RESIZER = 'image-resizer',
  IMAGE_CONVERTER = 'image-converter',
  IMAGES_TO_PDF = 'images-to-pdf',
  QR_GENERATOR = 'qr-generator',
  PDF_MERGER = 'pdf-merger',
  PDF_SPLITTER = 'pdf-splitter',
  PDF_TO_IMAGES = 'pdf-to-images',
  WORD_COUNTER = 'word-counter',
  TEXT_FORMATTER = 'text-formatter',
  JSON_FORMATTER = 'json-formatter',
  PASSWORD_GENERATOR = 'password-generator',
}

export enum StaticPageId {
  PRIVACY_POLICY = 'privacy-policy',
  TERMS_OF_USE = 'terms-of-use',
  ABOUT_US = 'about-us',
  CONTACT_US = 'contact-us',
}

export interface LocalizedToolContent {
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  formatsLabel: string;
  steps: string[];
  keywords: string[];
}

export interface ToolDefinition {
  id: ToolId;
  category: ToolCategory.IMAGE | ToolCategory.PDF | ToolCategory.TEXT | ToolCategory.DEVELOPER;
  iconName:
    | 'Minimize2'
    | 'Maximize2'
    | 'RefreshCw'
    | 'FileImage'
    | 'QrCode'
    | 'Files'
    | 'Scissors'
    | 'ShieldCheck'
    | 'AlignLeft'
    | 'Type'
    | 'Braces';
  featured?: boolean;
  en: LocalizedToolContent;
  ar: LocalizedToolContent;
}

export interface FAQItem {
  question: string;
  answer: string;
}
