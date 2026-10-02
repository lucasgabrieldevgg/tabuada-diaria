const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 900 } });
  await p.goto('http://localhost:8093', { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  await p.screenshot({ path: 'tab-antes-desktop.png' });
  await p.screenshot({ path: 'tab-antes-full.png', fullPage: true });
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto('http://localhost:8093', { waitUntil: 'networkidle' });
  await m.screenshot({ path: 'tab-antes-mobile.png' });
  await b.close(); console.log('ANTES OK');
})();
