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
    title: 'Compress PDF Online Free Without Uploading | LUMIXA',
    description: 'Compress PDF files free in your browser. Reduce file size privately with local processing, no account, and no watermark.',
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
  ['privacy-policy', 'Privacy Policy – LUMIXA', 'Learn how LUMIXA handles information and keeps browser-processed files private.', 'LUMIXA is designed around local browser processing for supported images, PDFs, text, JSON, and QR tasks. The browser reads the selected file, performs the operation on your device, and creates a result for download. LUMIXA does not require an account for the core tools and does not maintain an account-based file library.\n\nThe website is hosted by Cloudflare Pages and the source code is published in a public GitHub repository. The interface stores the selected language in localStorage. Google Fonts may receive standard technical request information under Google\'s own policies.\n\nReserved advertising spaces may be used in the future. If advertising, analytics, cookies, or similar technologies are introduced, this policy will be updated to explain their purpose, providers, retention, and available choices before they are relied upon. Users remain responsible for reviewing downloaded results and deleting local copies they no longer need.'],
  ['terms-of-use', 'Terms of Use – LUMIXA', 'The terms that apply when you use the free LUMIXA browser tools.', 'LUMIXA provides free browser-based utilities for personal and lawful use without a subscription or guaranteed service level. You are responsible for the files and content you process and must have the right to use them.\n\nResults can vary with file structure, browser support, device memory, and input size. Keep backups of important originals and review every output before submitting, sharing, or relying on it. Do not attempt to disrupt the service, bypass security controls, misuse automated requests, or process unlawful or harmful content.\n\nThe tools are provided as available. LUMIXA may update, improve, limit, or discontinue a feature as the project changes. The latest version of these terms remains available on this page.'],
  ['about-us', 'About LUMIXA', 'Learn what LUMIXA is and why it was built.', 'LUMIXA is a bilingual collection of practical digital tools for students, independent creators, office workers, developers, and anyone who needs a quick browser utility. It includes image compression, resizing and conversion, image-to-PDF, PDF merging and splitting, PDF compression, QR generation, word counting, text cleanup, password generation, and JSON formatting.\n\nThe platform is designed for iPhone, Android, tablets, and desktop browsers. Its English and Arabic interfaces include LTR and RTL layouts. Supported tools process files locally in the browser whenever possible, so users can complete common tasks without mandatory registration or unnecessary file transfers.\n\nLUMIXA is developed openly through GitHub. Because browser support and file structures vary, users should review important outputs before using them.'],
  ['contact-us', 'Contact LUMIXA', 'Get help, report an issue, or suggest an improvement to LUMIXA.', 'For help, bug reports, and feature suggestions, visit the public LUMIXA GitHub Issues page. Include the tool name, device model, operating system, browser version, approximate file type and size, steps to reproduce the issue, and the exact error message if one appears.\n\nPlease redact personal information and never share private documents, passwords, API keys, or secrets in a public issue. If the problem involves a sensitive file, describe the behavior without uploading the file.'],
]; 

for (const [slug, title, description, body] of legalPages) {
  const url = `${origin}/${slug}/`;
  const dir = join(process.cwd(), 'dist', slug);
  await mkdir(dir, { recursive: true });
  const bodyHtml = body.split('\n\n').map((paragraph) => `<p>${esc(paragraph)}</p>`).join('');
  const html = `<!doctype html>
<html lang="en" dir="ltr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${url}"><meta property="og:site_name" content="LUMIXA"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${origin}/og-image.svg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}/og-image.svg"><link rel="icon" href="${origin}/favicon.svg"></head><body><main><nav><a href="${origin}/">LUMIXA</a> / ${esc(title)}</nav><article><h1>${esc(title.replace(' – LUMIXA', ''))}</h1>${bodyHtml}<p><a href="${origin}/#/page/${slug}">Open the full ${esc(title.replace(' – LUMIXA', ''))} page</a></p></article></main></body></html>`;
  await writeFile(join(dir, 'index.html'), html);
}

const guides = [
  {
    slug: 'compress-pdf-on-iphone',
    title: 'How to Compress a PDF on iPhone Without Installing an App – LUMIXA',
    description: 'A practical guide to reducing PDF file size on iPhone from a browser, with privacy-first local processing tips.',
    heading: 'How to Compress a PDF on iPhone',
    body: ['Large PDF attachments can be difficult to send from an iPhone. LUMIXA lets you choose a PDF from the Files app, optimize it in the browser, compare the result, and download the smaller copy without installing a separate app.', 'Open the PDF Compressor, choose your document, wait for local processing to finish, and check the original and optimized sizes before downloading. For private documents, keep the file on your device and avoid sharing it with unknown services.'],
    links: [`${origin}/tools/pdf-compressor/`, `${origin}/tools/pdf-to-images/`],
  },
  {
    slug: 'heic-to-jpg-privacy',
    title: 'HEIC to JPG Conversion: Privacy Tips for iPhone Photos – LUMIXA',
    description: 'Learn how to convert iPhone HEIC photos to JPG while keeping a privacy-first workflow and avoiding unnecessary uploads.',
    heading: 'HEIC to JPG Conversion and Privacy',
    body: ['HEIC is efficient for storing iPhone photos, but some websites and older apps still expect JPG. Before choosing a converter, check whether the files are uploaded to a server and whether the service explains how files are handled.', 'A browser-based workflow can be convenient for one-off conversions. Use LUMIXA for supported local image processing, review the output, and remove downloaded copies you no longer need.'],
    links: [`${origin}/tools/image-converter/`, `${origin}/tools/image-compressor/`],
  },
  {
    slug: 'reduce-pdf-size-for-email',
    title: 'How to Reduce PDF Size Before Sending It by Email – LUMIXA',
    description: 'Practical steps for making a PDF smaller before email, messaging, or online submission while checking the final file.',
    heading: 'How to Reduce PDF Size for Email',
    body: ['Email providers and online forms often limit attachment size. Start by removing pages you do not need, then use a PDF compressor and compare the result before sending it.', 'Always open the optimized copy and confirm that text, page order, and important visuals are still usable. LUMIXA processes supported PDF optimization in the browser, so you can review the file before downloading it.'],
    links: [`${origin}/tools/pdf-compressor/`, `${origin}/tools/pdf-splitter/`, `${origin}/tools/pdf-merger/`],
  },
];

for (const guide of guides) {
  const url = `${origin}/guides/${guide.slug}/`;
  const dir = join(process.cwd(), 'dist', 'guides', guide.slug);
  await mkdir(dir, { recursive: true });
  const linkHtml = guide.links.map((link) => `<li><a href="${link}">${link.replace(`${origin}/`, '').replaceAll('/', ' ')}</a></li>`).join('');
  const paragraphs = guide.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('');
  const html = `<!doctype html><html lang="en" dir="ltr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(guide.title)}</title><meta name="description" content="${esc(guide.description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${url}"><meta property="og:site_name" content="LUMIXA"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(guide.title)}"><meta property="og:description" content="${esc(guide.description)}"><meta property="og:image" content="${origin}/og-image.svg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(guide.title)}"><meta name="twitter:description" content="${esc(guide.description)}"><meta name="twitter:image" content="${origin}/og-image.svg"><link rel="icon" href="${origin}/favicon.svg"></head><body><main><nav aria-label="Breadcrumb"><a href="${origin}/">LUMIXA</a> / <a href="${origin}/guides/">Guides</a> / ${esc(guide.heading)}</nav><article><h1>${esc(guide.heading)}</h1>${paragraphs}<h2>Useful LUMIXA tools</h2><ul>${linkHtml}</ul><p><a href="${origin}/">Explore all LUMIXA digital tools</a></p></article></main></body></html>`;
  await writeFile(join(dir, 'index.html'), html);
}

const guidesIndexUrl = `${origin}/guides/`;
const guidesIndexDir = join(process.cwd(), 'dist', 'guides');
await mkdir(guidesIndexDir, { recursive: true });
const guideLinks = guides.map((guide) => `<li><a href="${origin}/guides/${guide.slug}/">${esc(guide.heading)}</a><p>${esc(guide.description)}</p></li>`).join('');
await writeFile(join(guidesIndexDir, 'index.html'), `<!doctype html><html lang="en" dir="ltr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>LUMIXA Guides – Practical File and Privacy Tips</title><meta name="description" content="Practical guides for PDF compression, HEIC conversion, file privacy, and browser-based digital tools."><meta name="robots" content="index,follow"><link rel="canonical" href="${guidesIndexUrl}"><meta property="og:site_name" content="LUMIXA"><meta property="og:type" content="website"><meta property="og:url" content="${guidesIndexUrl}"><meta property="og:title" content="LUMIXA Guides – Practical File and Privacy Tips"><meta property="og:description" content="Practical guides for PDF compression, HEIC conversion, file privacy, and browser-based digital tools."><meta property="og:image" content="${origin}/og-image.svg"><link rel="icon" href="${origin}/favicon.svg"></head><body><main><nav><a href="${origin}/">LUMIXA</a> / Guides</nav><article><h1>LUMIXA Guides</h1><p>Practical, privacy-first guidance for working with PDFs, images, and everyday digital files.</p><ul>${guideLinks}</ul></article></main></body></html>`);

console.log(`Generated ${tools.length} SEO tool pages, ${legalPages.length} legal pages, ${guides.length} guides, and 1 guide index.`);
