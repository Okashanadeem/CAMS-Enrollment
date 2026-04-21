import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

export async function generateStudentCard(studentName: string, studentId: string) {
  const qrCodeDataUrl = await QRCode.toDataURL(studentId);
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    :root {
      --smiu-red: #8b2323;
      --smiu-green: #1b4d3e;
      --accent-gold: #fbbf24;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Outfit', sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 210mm;
      height: 297mm;
      margin: 0;
      background: white;
    }

    .card-container {
      width: 340px; /* Reduced from 380px */
      display: flex;
      flex-direction: column; gap: 30px;
      padding: 20px;
      align-items: center;
    }

    .card {
      width: 340px; /* Reduced from 380px */
      height: 215px; /* Reduced from 240px to maintain aspect ratio */
      border-radius: 18px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .front {
      background: linear-gradient(120deg, var(--smiu-green) 0%, #0d2e23 100%);
      color: white;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .front::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 180px;
      height: 180px;
      background: linear-gradient(135deg, var(--smiu-red), transparent);
      border-radius: 50%;
      opacity: 0.6;
      filter: blur(40px);
    }

    .glass-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
      z-index: 1;
    }

    .card-content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 18px 22px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card-logo {
      height: 40px;
      width: 40px;
      object-fit: contain;
      background: white;
      border-radius: 8px;
      padding: 4px;
    }

    .uni-name h3 {
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 3px;
      letter-spacing: 0.5px;
    }

    .uni-name span {
      font-size: 8px;
      opacity: 0.8;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .card-body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .student-info { flex: 1; }

    .info-label {
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255,255,255,0.7);
      margin-bottom: 3px;
      font-weight: 600;
    }

    .student-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }

    .student-name {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .course-tag {
      display: inline-block;
      padding: 4px 10px;
      background: rgba(251, 191, 36, 0.9);
      border-radius: 18px;
      font-size: 9px;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: 0.5px;
    }

    .qr-box {
      background: white;
      padding: 5px; /* Slightly reduced padding to maximize QR size */
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -30px; /* Moved further up */
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .qr-box img {
      width: 90px; /* Increased from 75px */
      height: 90px; /* Increased from 75px */
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 10px;
      margin-top: auto;
    }

    .validity {
      font-size: 8px;
      opacity: 0.8;
    }

    .back {
      background: white;
      display: flex;
      flex-direction: column;
      border: 2px solid var(--smiu-green);
    }

    .back-header-strip {
      background: var(--smiu-green);
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .back-body {
      padding: 15px;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .terms-list {
      list-style: none;
      margin-bottom: 12px;
    }

    .terms-list li {
      font-size: 9px;
      color: #4b5563;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .credit-box {
      border: 1px dashed #e5e7eb;
      padding: 6px 12px;
      border-radius: 8px;
      background: #f9fafb;
    }

    .credit-text {
      font-size: 8px;
      color: #6b7280;
      line-height: 1.4;
    }

    .credit-text span {
      color: var(--smiu-red);
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="card-container">
    <div class="card front">
      <div class="glass-overlay"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="brand">
            <img src="${logoDataUrl}" alt="SMIU" class="card-logo">
            <div class="uni-name">
              <h3>SMIU</h3>
              <span>SOFTWARE ENGINEERING</span>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="student-info">
            <div class="info-label">Student Identity</div>
            <div class="student-id">${studentId}</div>
            <div class="student-name">${studentName}</div>
          </div>
          <div class="qr-box">
            <img src="${qrCodeDataUrl}" alt="QR Code">
          </div>
        </div>
        <div class="card-footer">
          <div class="course-tag">BSSE Fall '25</div>
          <div class="validity">ATTENDANCE ONLY</div>
        </div>
      </div>
    </div>

    <div class="card back">
      <div class="back-header-strip">CAMS - Official Use Only</div>
      <div class="back-body">
        <ul class="terms-list">
          <li>• Use strictly for marking classroom attendance.</li>
          <li>• Non-transferable property of the student.</li>
          <li>• Proxy marking will result in strict action.</li>
        </ul>
        <div class="credit-box">
          <div class="credit-text">
            CAMS Designed & Developed by<br>
            <span>CR Okasha Nadeem</span> (BSSE Fall '25)
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  let browser;
  try {
    // For Vercel/Serverless
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      const executablePath = await chromium.executablePath();
      browser = await puppeteer.launch({
        args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 794, height: 1123 },
        executablePath: executablePath,
        headless: 'shell',
      });
    } else {
      // Local development
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.CHROME_PATH || undefined // Let puppeteer find it naturally locally
      });
    }
  } catch (error: any) {
    console.error("Browser launch failed:", error);
    throw new Error(`Failed to launch browser: ${error.message}`);
  }

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

  const pdfBuffer = await page.pdf({
    printBackground: true,
    format: 'A4',
    pageRanges: '1'
  });

  await browser.close();
  return pdfBuffer;
}
