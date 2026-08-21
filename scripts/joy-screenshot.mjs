// Screenshot the built Opportunity Universe for a visual check.
// Usage: npm run preview:joy &  then  node scripts/joy-screenshot.mjs [url] [out.png]
import { chromium } from 'playwright-core';

const url = process.argv[2] || 'http://localhost:3001/joy/';
const out = process.argv[3] || 'joy-desktop.png';
const executablePath = process.env.JOY_CHROMIUM || '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath });

const desktop = await browser.newPage({ viewport: { width: 1440, height: 2400 } });
await desktop.goto(url, { waitUntil: 'networkidle' });
await desktop.waitForTimeout(1200);
await desktop.screenshot({ path: out });

const mobile = await browser.newPage({ viewport: { width: 390, height: 1600 } });
await mobile.goto(url, { waitUntil: 'networkidle' });
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: out.replace('.png', '-mobile.png') });

await browser.close();
console.log(`written: ${out} + mobile variant`);
