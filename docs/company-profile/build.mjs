// Renders company-profile.html to an A4 PDF.
// Usage: node docs/company-profile/build.mjs
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
// Playwright is not a project dependency; resolve it from NODE_PATH / global install.
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(dir, 'company-profile.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: path.join(dir, 'AEM-Frozen-Food-Company-Profile.pdf'),
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
console.log('Wrote AEM-Frozen-Food-Company-Profile.pdf');
