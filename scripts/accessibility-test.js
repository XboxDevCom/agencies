// Exercise the real built app over HTTP; a missing/empty app must fail this gate.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');
const axe = require('axe-core');
const root = path.resolve(__dirname, '../build');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.csv': 'text/csv', '.json': 'application/json', '.ico': 'image/x-icon' };
async function run() {
  let browser;
  const report = [];
  const server = http.createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      let file = path.resolve(root, `.${pathname}`);
      if (!file.startsWith(root + path.sep) && file !== root) { response.writeHead(403).end(); return; }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) { response.writeHead(404).end(); return; }
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(response);
    } catch { response.writeHead(500).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    const origin = `http://127.0.0.1:${server.address().port}`;
    await page.goto(`${origin}/?lang=de`, { waitUntil: 'load' });
    await page.waitForSelector('.agency-row');
    const expected = require('papaparse').parse(fs.readFileSync(path.join(root, 'data.csv'), 'utf8'), { header: true, skipEmptyLines: true }).data.length;
    assert.equal(await page.$$eval('.agency-row', rows => rows.length), expected);
    await page.addScriptTag({ content: axe.source });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewport({ width, height: 950 });
      const results = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      report.push({ width, overflow, violations: results.violations });
      assert(!overflow, `Horizontal overflow at ${width}px`);
    }
    await page.setViewport({ width: 1440, height: 950 });
    await page.click('.agency-identity button');
    await page.waitForSelector('dialog[open]');
    const modal = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    report.push({ state: 'profile', violations: modal.violations });
    await page.keyboard.press('Escape');
    assert.equal(await page.$('dialog[open]'), null);
    await page.click('#agency-search');
    await page.type('#agency-search', 'Secret Unicorn');
    assert.equal(await page.$eval('#agency-search', input => input.value), 'Secret Unicorn');
    assert.equal(await page.$$eval('.agency-row', rows => rows.length), 1);
    for (const route of ['investor-tips', 'dividend-calculator']) {
      const response = await page.goto(`${origin}/${route}/?lang=de`, { waitUntil: 'load' });
      assert.equal(response.status(), 200, `Missing direct route ${route}`);
      await page.waitForSelector('.archive-note');
    }
    assert.equal(failures.length, 0, failures.join('\n'));
    assert.equal(report.reduce((count, result) => count + result.violations.length, 0), 0, 'Accessibility violations; see report');
    console.log('Real directory, responsive layouts, profile and direct routes passed.');
  } finally {
    fs.writeFileSync(path.join(root, '../accessibility-report.json'), JSON.stringify(report, null, 2));
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
