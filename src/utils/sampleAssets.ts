import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates a rich, crisp 1280x800 sample graphic in memory via HTML5 Canvas
 * so visitors can test compression, resizing, format conversion, and PDF creation immediately.
 */
export async function createSampleImageFile(filename = 'lumixa-sample-graphic.png'): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Crisp architectural background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1280, 800);
  bgGrad.addColorStop(0, '#1E1B4B');
  bgGrad.addColorStop(0.55, '#4C1D95');
  bgGrad.addColorStop(1, '#7C3AED');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1280, 800);

  // Subtle geometric grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1280; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 800);
    ctx.stroke();
  }
  for (let y = 0; y <= 800; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }

  // Luminous geometric spheres/shapes for realistic compression detail
  const circleGrad = ctx.createRadialGradient(920, 360, 40, 920, 360, 280);
  circleGrad.addColorStop(0, 'rgba(221, 214, 254, 0.95)');
  circleGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.45)');
  circleGrad.addColorStop(1, 'rgba(124, 58, 237, 0)');
  ctx.fillStyle = circleGrad;
  ctx.beginPath();
  ctx.arc(920, 360, 280, 0, Math.PI * 2);
  ctx.fill();

  // Architectural card showcase
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.beginPath();
  ctx.roundRect(110, 160, 620, 480, 28);
  ctx.fill();

  ctx.fillStyle = '#5B21B6';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('LUMIXA DIGITAL STUDIO', 164, 240);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 52px sans-serif';
  ctx.fillText('High-Resolution', 164, 320);
  ctx.fillText('Sample Canvas', 164, 382);

  ctx.fillStyle = '#475569';
  ctx.font = '24px sans-serif';
  ctx.fillText('1280 × 800 px · RGB Color Profile · Local Processing', 164, 448);

  // Color calibration swatches
  const palette = ['#4C1D95', '#6D28D9', '#8B5CF6', '#C4B5FD', '#0F172A', '#E2E8F0'];
  palette.forEach((hex, idx) => {
    ctx.fillStyle = hex;
    ctx.beginPath();
    ctx.roundRect(164 + idx * 82, 505, 66, 66, 14);
    ctx.fill();
  });

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Blob creation failed'))), 'image/png');
  });

  return new File([blob], filename, { type: 'image/png' });
}

/**
 * Generates a clean multi-page PDF file in memory using pdf-lib
 * for immediate testing of PDF Merge and PDF Split tools.
 */
export async function createSamplePdfFile(
  title: string,
  pageCount: number,
  filename: string
): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pageCount; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
    const { width, height } = page.getSize();

    // Header accent bar
    page.drawRectangle({
      x: 48,
      y: height - 92,
      width: width - 96,
      height: 36,
      color: rgb(0.36, 0.13, 0.71),
    });

    page.drawText('LUMIXA SAMPLE PDF DOCUMENT', {
      x: 64,
      y: height - 79,
      size: 11,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText(`${title} — Page ${i} of ${pageCount}`, {
      x: 48,
      y: height - 155,
      size: 24,
      font: boldFont,
      color: rgb(0.06, 0.09, 0.16),
    });

    page.drawText(
      `This sample page (${i}/${pageCount}) was generated locally inside your browser to test LUMIXA PDF tools.`,
      {
        x: 48,
        y: height - 195,
        size: 11.5,
        font: regularFont,
        color: rgb(0.28, 0.33, 0.41),
      }
    );

    // Subtle content wireframe lines
    for (let row = 0; row < 6; row++) {
      page.drawRectangle({
        x: 48,
        y: height - 255 - row * 48,
        width: width - 96,
        height: 28,
        color: rgb(0.96, 0.96, 0.98),
      });
      page.drawText(`Section ${i}.${row + 1} — Verified local page structure`, {
        x: 62,
        y: height - 245 - row * 48,
        size: 10,
        font: regularFont,
        color: rgb(0.35, 0.39, 0.48),
      });
    }

    page.drawText(`LUMIXA · Page ${i}`, {
      x: 48,
      y: 42,
      size: 10,
      font: regularFont,
      color: rgb(0.45, 0.49, 0.56),
    });
  }

  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  return new File([blob], filename, { type: 'application/pdf' });
}
