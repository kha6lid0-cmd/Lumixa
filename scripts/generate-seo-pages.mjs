import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const origin = 'https://lumixa-99t.pages.dev';
const tools = [
  {
    slug: 'image-compressor',
    title: 'Free Image Compressor (JPG, PNG, WebP) – LUMIXA',
    description: 'Compress JPG, PNG, and WebP images directly in your browser. Reduce file size while preserving visual clarity with zero server uploads.',
    heading: 'Free Image Compressor',
    intro: 'Reduce image file sizes while keeping your pictures clear. LUMIXA processes images locally in your browser for fast, private compression.',
    formats: 'JPG, PNG, and WebP',
    steps: ['Choose an image from your device.', 'Adjust quality and compare the original with the compressed result.', 'Download the optimized image.'],
  },
  {
    slug: 'image-resizer',
    title: 'Resize Images Online by Pixels or Percentage – LUMIXA',
    description: 'Resize PNG, JPG, and WebP images to custom pixel dimensions or percentage presets right in your browser for free.',
    heading: 'Resize Images Online',
    intro: 'Change image width and height precisely by pixels or percentage. Lock the aspect ratio to avoid distortion.',
    formats: 'JPG, PNG, and WebP',
    steps: ['Upload an image.', 'Set the target dimensions or choose a scale preset.', 'Preview and download the resized image.'],
  },
  {
    slug: 'image-converter',
    title: 'Convert PNG, JPG & WebP Images Online – LUMIXA',
    description: 'Batch convert images between PNG, JPG, and WebP formats locally in your browser with quality and background controls.',
    heading: 'Image Format Converter',
    intro: 'Convert one or many images between PNG, JPG, and WebP without uploading files to a server.',
    formats: 'PNG, JPG, and WebP',
    steps: ['Add one or more images.', 'Select the output format and quality.', 'Convert and download the new files.'],
  },
  {
    slug: 'images-to-pdf',
    title: 'Convert Images to PDF (JPG, PNG, WebP to PDF) – LUMIXA',
    description: 'Turn multiple JPG, PNG, and WebP images into one downloadable PDF with page size, orientation, and margin controls.',
    heading: 'Convert Images to PDF',
    intro: 'Combine photos and images into one organized PDF document with control over page size, order, orientation, and margins.',
    formats: 'JPG, PNG, and WebP to PDF',
    steps: ['Upload and arrange your images.', 'Choose page size, orientation, and margins.', 'Generate and download the PDF.'],
  },
  {
    slug: 'qr-generator',
    title: 'Free QR Code Generator (Download PNG & SVG) – LUMIXA',
    description: 'Generate customizable high-resolution QR codes for URLs and text. Adjust colors, size, error correction, and download PNG or SVG.',
    heading: 'Free QR Code Generator',
    intro: 'Create high-resolution QR codes for links, text, contact details, or Wi-Fi information with instant PNG and SVG downloads.',
    formats: 'PNG and SVG',
    steps: ['Enter a URL or text.', 'Customize size, colors, and error correction.', 'Download the QR code as PNG or SVG.'],
  },
  {
    slug: 'pdf-merger',
    title: 'Merge PDF Files Online for Free – LUMIXA',
    description: 'Combine two or more PDF files into one organized document locally in your browser. Private, fast, and without watermarks.',
    heading: 'Merge PDF Files Online',
    intro: 'Join multiple PDF documents in your preferred order. Files are processed locally in your browser for privacy.',
    formats: 'Multiple PDF files',
    steps: ['Select two or more PDF files.', 'Arrange them in the desired order.', 'Merge and download the combined PDF.'],
  },
  {
    slug: 'pdf-splitter',
    title: 'Split PDF by Page Range Online – LUMIXA',
    description: 'Extract selected pages or split a PDF by custom page ranges directly in your browser with instant preview.',
    heading: 'Split PDF Files Online',
    intro: 'Extract selected pages or divide a PDF into smaller documents by entering page ranges such as 1-3, 5.',
    formats: 'PDF page ranges',
    steps: ['Upload a PDF.', 'Enter page ranges or select pages.', 'Download the extracted PDF files.'],
  },
  {
    slug: 'word-counter',
    title: 'Free Word & Character Counter (English & Arabic) – LUMIXA',
    description: 'Count words, characters, sentences, paragraphs, reading time, and repeated words in English and Arabic text instantly.',
    heading: 'Word and Character Counter',
    intro: 'Analyze English and Arabic writing with live word, character, sentence, paragraph, reading-time, and frequency counts.',
    formats: 'English and Arabic text',
    steps: ['Paste or type your text.', 'Review live word and character counts.', 'Use the reading-time and frequency insights.'],
  },
  {
    slug: 'text-formatter',
    title: 'Free Text Formatter and Cleaner Online – LUMIXA',
    description: 'Clean and format text by removing extra spaces, empty lines, duplicate lines, and changing capitalization in your browser.',
    heading: 'Text Formatter and Cleaner',
    intro: 'Clean messy text quickly by removing duplicate lines, extra spaces, and empty lines or changing letter case.',
    formats: 'Plain text',
    steps: ['Paste your text.', 'Choose a cleaning or formatting action.', 'Copy or download the cleaned result.'],
  },
  {
    slug: 'json-formatter',
    title: 'Free JSON Formatter and Validator – LUMIXA',
    description: 'Beautify, minify, sort keys, and validate JSON with exact line and column errors directly in your browser.',
    heading: 'JSON Formatter and Validator',
    intro: 'Format, validate, minify, and sort JSON with clear error messages that help you find invalid syntax quickly.',
    formats: 'JSON data',
    steps: ['Paste JSON into the editor.', 'Format, validate, minify, or sort keys.', 'Copy or download the result.'],
  },
  {
    slug: 'pdf-to-images',
    title: 'Convert PDF to JPG or PNG Online – LUMIXA',
    description: 'Turn every page of a PDF into a downloadable JPG or PNG image locally in your browser with adjustable resolution.',
    heading: 'Convert PDF to Images',
    intro: 'Render PDF pages as clear JPG or PNG images locally in your browser with selectable format and resolution.',
    formats: 'PDF to JPG or PNG',
    steps: ['Choose a PDF file.', 'Select JPG or PNG and an output resolution.', 'Preview each page and download the images.'],
  },
  {
    slug: 'pdf-compressor',
    title: 'Compress PDF Files Online for Free – LUMIXA',
    description: 'Reduce PDF file size with browser-side optimization. Compare the original and optimized files before downloading.',
    heading: 'Compress PDF Files',
    intro: 'Optimize PDF structure locally in your browser and compare the result before downloading.',
    formats: 'PDF local optimization',
    steps: ['Choose a PDF file.', 'Let LUMIXA optimize its internal structure.', 'Compare sizes and download the optimized PDF.'],
  },
  {
    slug: 'password-generator',
    title: 'Free Strong Password Generator – LUMIXA',
    description: 'Create strong random passwords with custom length, symbols, numbers, and uppercase characters entirely in your browser.',
    heading: 'Strong Password Generator',
    intro: 'Generate a strong password locally using your device cryptography. Nothing is saved or sent to a server.',
    formats: 'Secure local generation',
    steps: ['Choose the password length and character types.', 'Generate a fresh random password.', 'Copy it to your password manager.'],
  },
];

const esc = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const page = (tool) => {
  const url = `${origin}/tools/${tool.slug}/`;
  const steps = tool.steps.map((step, index) => `<li><strong>${index + 1}.</strong> ${esc(step)}</li>`).join('');
  const faq = [
    [`Is ${tool.heading} free?`, `Yes. The ${tool.heading} tool is available at no cost in the LUMIXA browser tools collection.`],
    ['Are my files uploaded?', 'Supported file processing is designed to happen locally in your browser whenever possible. Do not use the tool with a file if your browser or device cannot complete local processing.'],
    [`What can I use ${tool.heading} for?`, `${tool.intro} It is suitable for quick personal, study, and work tasks without installing desktop software.`],
  ];
  const faqHtml = faq.map(([question, answer]) => `<div><h3>${esc(question)}</h3><p>${esc(answer)}</p></div>`).join('');
  const related = tools.filter((item) => item.slug !== tool.slug).slice(0, 3).map((item) => `<a href="${origin}/tools/${item.slug}/">${esc(item.heading)}</a>`).join(' · ');
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        name: tool.heading,
        description: tool.description,
        url,
        step: tool.steps.map((text, index) => ({ '@type': 'HowToStep', position: index + 1, text })),
        tool: { '@type': 'HowToTool', name: 'LUMIXA browser tool' },
      },
      {
        '@type': 'WebApplication',
        name: tool.heading,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        isAccessibleForFree: true,
        url,
      },
    ],
  });
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(tool.title)}</title>
  <meta name="description" content="${esc(tool.description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${url}">
  <meta property="og:site_name" content="LUMIXA">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(tool.title)}">
  <meta property="og:description" content="${esc(tool.description)}">
  <meta property="og:image" content="${origin}/og-image.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(tool.title)}">
  <meta name="twitter:description" content="${esc(tool.description)}">
  <meta name="twitter:image" content="${origin}/og-image.svg">
  <link rel="icon" href="${origin}/favicon.svg">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <main>
    <nav aria-label="Breadcrumb"><a href="${origin}/">LUMIXA</a> / ${esc(tool.heading)}</nav>
    <article>
      <h1>${esc(tool.heading)}</h1>
      <p>${esc(tool.intro)}</p>
      <p><strong>Supported formats:</strong> ${esc(tool.formats)}</p>
      <h2>How to use this tool</h2>
      <ol>${steps}</ol>
      <h2>Why use LUMIXA?</h2>
      <p>${esc(tool.intro)} LUMIXA is built for fast, simple workflows on phones, tablets, and desktop browsers. The interface is bilingual in English and Arabic, and the result is ready to download when processing is complete.</p>
      <h2>Frequently asked questions</h2>
      <div>${faqHtml}</div>
      <h2>Related tools</h2>
      <p>${related}</p>
      <p><a href="${origin}/#/tool/${tool.slug}">Open the interactive ${esc(tool.heading)} tool</a></p>
    </article>
  </main>
</body>
</html>
`;
};

for (const tool of tools) {
  const dir = join(process.cwd(), 'dist', 'tools', tool.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), page(tool));
}

const legalPages = [
  ['privacy-policy', 'Privacy Policy – LUMIXA', 'Learn how LUMIXA handles information and keeps browser-processed files private.', 'LUMIXA tools process supported files locally in your browser. We do not require an account for the core tools. If advertising or analytics are enabled, this page will be updated to explain the cookies, providers, and user choices involved.'],
  ['terms-of-use', 'Terms of Use – LUMIXA', 'The terms that apply when you use the free LUMIXA browser tools.', 'LUMIXA provides free browser-based utilities for personal and lawful use. You are responsible for the files and content you process, and you should review the output before relying on it.'],
  ['about-us', 'About LUMIXA', 'Learn what LUMIXA is and why it was built.', 'LUMIXA is a bilingual collection of practical digital tools for images, PDFs, text, JSON, and QR codes. The tools are designed to be simple, fast, and privacy-friendly by processing files in the browser whenever possible.'],
  ['contact-us', 'Contact LUMIXA', 'Get help, report an issue, or suggest an improvement to LUMIXA.', 'For help, bug reports, and suggestions, visit the LUMIXA GitHub Issues page. Include the tool name, device, browser, and steps to reproduce the issue without sharing private files or secrets.'],
];

for (const [slug, title, description, body] of legalPages) {
  const url = `${origin}/${slug}/`;
  const dir = join(process.cwd(), 'dist', slug);
  await mkdir(dir, { recursive: true });
  const html = `<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${url}"><meta property="og:site_name" content="LUMIXA"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${origin}/og-image.svg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}/og-image.svg"><link rel="icon" href="${origin}/favicon.svg"></head><body><main><nav><a href="${origin}/">LUMIXA</a> / ${esc(title)}</nav><article><h1>${esc(title.replace(' – LUMIXA', ''))}</h1><p>${esc(body)}</p><p><a href="${origin}/#/page/${slug}">Open the full ${esc(title.replace(' – LUMIXA', ''))} page</a></p></article></main></body></html>`;
  await writeFile(join(dir, 'index.html'), html);
}

console.log(`Generated ${tools.length} SEO tool pages and ${legalPages.length} legal pages.`);
