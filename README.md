# LUMIXA — Free All-in-One Digital Tools Platform | منصة لوميكسا للأدوات الرقمية

**LUMIXA** is a fast, privacy-first, bilingual (English & Arabic, LTR/RTL) web platform offering free browser-based digital utilities across Image, PDF, Text, and Developer categories—with zero mandatory registration or paid subscriptions.

**لوميكسا (LUMIXA)** هي منصة ويب سريعة ومجانية بالكامل تدعم اللغتين العربية والإنجليزية (RTL / LTR)، وتضم أدوات رقمية متكاملة للصور وملفات PDF والنصوص والمطورين تعمل مباشرة داخل متصفح الزائر بخصوصية تامة.

[Open LUMIXA online](https://lumixa-99t.pages.dev/) · [Explore SEO-friendly tool pages](https://lumixa-99t.pages.dev/sitemap.xml)

---

## Included Tools | الأدوات المتوفرة

### 1. Image Tools | أدوات الصور
- **Image Compressor:** Compress JPG, WebP, and PNG images with adjustable quality and max-width scaling.
- **Image Resizer:** Resize images by exact pixel dimensions, aspect-ratio lock, or percentage presets.
- **Image Format Converter:** Convert seamlessly between PNG, JPG, and WebP formats.
- **Images to PDF:** Combine multiple images into a single downloadable PDF (A4, US Letter, or Fit-to-Image).
- **QR Code Generator:** Generate customizable, high-resolution downloadable PNG QR codes.

### 2. PDF Tools | أدوات PDF
- **Merge PDF:** Combine two or more PDF files in any custom order with instant preview.
- **Split PDF:** Extract custom page ranges into a single PDF or separate PDF documents.
- **PDF Compressor:** Reduce PDF file size with local browser-side optimization.
- **PDF to Images:** Render PDF pages as JPG or PNG images with selectable resolution.

### 3. Text Tools | أدوات النصوص
- **Word & Character Counter:** Live word, character, sentence, paragraph, and reading-time statistics.
- **Text Formatter & Cleaner:** Remove extra spaces, strip empty lines, and change text capitalization.

### 4. Developer Tools | أدوات المطورين
- **JSON Formatter & Validator:** Beautify, minify, validate JSON syntax with clear error messages, and copy with one click.
- **Strong Password Generator:** Create random passwords locally with configurable length and character sets.

### Guides | أدلة مفيدة
- [How to compress a PDF on iPhone](https://lumixa-99t.pages.dev/guides/compress-pdf-on-iphone/)
- [HEIC to JPG conversion and privacy tips](https://lumixa-99t.pages.dev/guides/heic-to-jpg-privacy/)
- [How to reduce PDF size for email](https://lumixa-99t.pages.dev/guides/reduce-pdf-size-for-email/)

---

## Local Development | التشغيل محلياً

```bash
# 1. Install dependencies | تثبيت الحزم
npm install

# 2. Start development server | تشغيل خادم التطوير
npm run dev

# 3. Build static production files | بناء ملفات الإنتاج الثابتة
npm run build
```

The production-ready static files will be generated inside the `dist/` directory.

---

## Free Deployment to GitHub Pages | النشر المجاني عبر GitHub Pages

This project includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml` and relative asset paths (`base: './'`) in `vite.config.ts`:

1. Create a new **Public** repository on GitHub and push all project files to the `main` branch.
2. Open your repository **Settings** → **Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build and publish your site to `https://<username>.github.io/<repo-name>/`.

---

## SEO & Future Advertising | تهيئة محركات البحث والإعلانات

- **SEO:** Update the domain URL inside `public/robots.txt` and `public/sitemap.xml` once your live domain is active.
- **Advertising:** Non-intrusive, layout-shift-safe (`CLS = 0`) ad slots are reserved via `src/config/siteConfig.ts` and `src/components/AdSlot.tsx`. Add your ad provider script to `index.html` only after your domain is approved.
