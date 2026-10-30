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
];

const esc = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const page = (tool) => {
  const url = `${origin}/tools/${tool.slug}/`;
  const steps = tool.steps.map((step, index) => `<li><strong>${index + 1}.</strong> ${esc(step)}</li>`).join('');
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: tool.heading,
    description: tool.description,
    url,
    step: tool.steps.map((text, index) => ({ '@type': 'HowToStep', position: index + 1, text })),
    tool: { '@type': 'HowToTool', name: 'LUMIXA browser tool' },
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
console.log(`Generated ${tools.length} SEO tool pages.`);
