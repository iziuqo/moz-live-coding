// Go-live checks for the contacts search, run against the real page.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const APP = path.join(__dirname, '..', 'challenge');
const BS = fs.readFileSync(require.resolve('bootstrap/dist/css/bootstrap.min.css'));
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const results = []; const check = (name, ok, info='') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? '  (' + info + ')' : ''}`);

async function open(browser, { dataJs, query = '', viewport = { width: 1280, height: 900 }, reducedMotion } = {}) {
  const page = await browser.newPage({ viewport, reducedMotion });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => { errors.push('dialog:' + d.message()); d.dismiss(); });
  await page.route('**/*', route => {
    const u = new URL(route.request().url());
    if (u.hostname === 'cdn.jsdelivr.net') return route.fulfill({ body: BS, contentType: 'text/css' });
    if (u.hostname !== 'app.test') return route.abort();
    const file = u.pathname === '/' ? 'index.html' : u.pathname.slice(1);
    if (file === 'data.js' && dataJs) return route.fulfill({ body: dataJs, contentType: 'text/javascript' });
    const p = path.join(APP, file);
    if (!fs.existsSync(p)) return route.fulfill({ status: 404 });
    route.fulfill({ body: fs.readFileSync(p), contentType: { html: 'text/html', js: 'text/javascript', css: 'text/css' }[file.split('.').pop()] });
  });
  await page.goto('http://app.test/' + (query ? '?q=' + encodeURIComponent(query) : ''));
  return { page, errors };
}
const rows = p => p.locator('#contact-list .contact-row:visible').count();
const statusText = p => p.locator('#search-announcer').textContent();
const axe = async (p) => { await p.addScriptTag({ content: AXE }); return p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a','wcag2aa','wcag21aa','best-practice'] })).violations.map(v => v.id + ':' + v.nodes.length)); };

(async () => {
  const browser = await chromium.launch();
  const shots = process.argv[2];

  // 1. Loading state
  let { page, errors } = await open(browser);
  check('loading: skeleton rows shown', await page.locator('#contact-list .placeholder-glow').count() === 6);
  check('loading: list is aria-busy', await page.getAttribute('#contact-list', 'aria-busy') === 'true');
  check('loading: status announces', (await statusText(page)).includes('Loading'));
  if (shots) await page.screenshot({ path: shots + '/1-loading.png' });
  await page.waitForSelector('.contact-row');
  check('ready: 40 contacts', await rows(page) === 40);
  check('ready: aria-busy false', await page.getAttribute('#contact-list', 'aria-busy') === 'false');
  check('ready: status count', (await statusText(page)) === '40 contacts');
  await page.waitForTimeout(800);
  check('a11y: no axe violations (ready)', (await axe(page)).length === 0, (await axe(page)).join(', '));
  if (shots) await page.screenshot({ path: shots + '/2-ready.png' });

  // 2. Searching
  await page.fill('#search-input', 'al'); // matches 4 names + 13 'Personal' labels
  check('search "al": filters (names + labels)', await rows(page) === 17, String(await rows(page)));
  check('search "al": highlights with <mark>', await page.locator('.contact-row mark').count() >= 17);
  await page.waitForTimeout(400);
  check('search: status announced after pause', (await statusText(page)).startsWith('17 contacts match'), await statusText(page));
  check('search: visible count is immediate', (await page.textContent('#search-status')).startsWith('17')); check('search: query synced to URL', page.url().endsWith('?q=al'));
  if (shots) await page.screenshot({ path: shots + '/3-search.png' });
  await page.fill('#search-input', 'ALEX');  check('case-insensitive', await rows(page) === 1);
  await page.fill('#search-input', '5550101001'); check('phone digits ignore formatting', await rows(page) === 1);
  await page.fill('#search-input', '010-1002'); check('phone with dash', await rows(page) === 1);
  await page.fill('#search-input', 'work alex'); check('multi-word: label + name', await rows(page) === 1);
  await page.fill('#search-input', 'family'); check('label search', await rows(page) === 13, String(await rows(page)));
  await page.fill('#search-input', '   '); check('whitespace = all', await rows(page) === 40);

  // 3. No results
  await page.fill('#search-input', 'zzzz');
  check('no results: message shown', await page.locator('#list-message:visible').count() === 1 && await page.locator('#contact-list').isHidden());
  check('no results: query echoed', (await page.textContent('#list-message')).includes('zzzz'));
  await page.waitForTimeout(400);
  check('a11y: no axe violations (no results)', (await axe(page)).length === 0, (await axe(page)).join(', '));
  if (shots) await page.screenshot({ path: shots + '/4-no-results.png' });
  await page.click('text=Clear search');
  check('clear button: resets list and refocuses', await rows(page) === 40 && await page.evaluate(() => document.activeElement.id) === 'search-input');

  // 4. Keyboard
  await page.fill('#search-input', 'sam'); await page.keyboard.press('Escape');
  check('Escape clears', (await page.inputValue('#search-input')) === '' && await rows(page) === 40);
  await page.locator('h1').click(); await page.keyboard.press('/');
  check('"/" focuses search', await page.evaluate(() => document.activeElement.id) === 'search-input');
  await page.keyboard.type('/'); check('"/" types normally inside the input', (await page.inputValue('#search-input')) === '/');
  await page.fill('#search-input', 'sam'); await page.keyboard.press('Enter');
  check('Enter does not reload', page.url().endsWith('?q=sam') && await rows(page) === 1);
  check('no JS errors', errors.length === 0, errors.join(' | '));
  await page.close();

  // 5. Deep link + search while loading
  ({ page } = await open(browser, { query: 'harper' }));
  check('deep link: input prefilled', (await page.inputValue('#search-input')) === 'harper');
  await page.fill('#search-input', 'riley'); // typed before data arrives
  await page.waitForSelector('.contact-row');
  check('query typed during loading is applied', await rows(page) === 1 && (await page.textContent('.contact-name')) === 'Riley Foster');
  await page.close();

  // 6. XSS
  const evil = `const contacts=[{name:'<img src=x onerror="window.pwned=1">Eve',phone:'<b>1</b>',label:'<script>window.pwned=1<\\/script>'}];function loadContacts(){return Promise.resolve(contacts);}`;
  ({ page, errors } = await open(browser, { dataJs: evil }));
  await page.waitForSelector('.contact-row');
  await page.fill('#search-input', 'img');
  await page.waitForTimeout(300);
  check('XSS: markup rendered as text, never executed', await page.evaluate(() => !window.pwned && !document.querySelector('#contact-list img, #contact-list b, #contact-list script')));
  await page.close();

  // 7. Error + retry
  const flaky = `let calls=0;const contacts=[{name:'Alex Rivera',phone:'(555) 010-1001',label:'Work'}];function loadContacts(){calls++;return calls===1?Promise.reject(new Error('500')):Promise.resolve(contacts);}`;
  ({ page } = await open(browser, { dataJs: flaky }));
  await page.waitForSelector('.alert-danger');
  check('error: alert with role=alert', await page.getAttribute('.alert-danger', 'role') === 'alert');
  check('a11y: no axe violations (error)', (await axe(page)).length === 0, (await axe(page)).join(', '));
  if (shots) await page.screenshot({ path: shots + '/5-error.png' });
  await page.click('text=Try again'); await page.waitForSelector('.contact-row');
  check('error: retry recovers', await rows(page) === 1);
  await page.close();

  // 8. Empty
  ({ page } = await open(browser, { dataJs: 'function loadContacts(){return Promise.resolve([]);}' }));
  await page.waitForSelector('#list-message:visible');
  check('empty: "No contacts yet."', (await page.textContent('#list-message')).includes('No contacts yet'));
  await page.close();

  // 9. Mobile + reduced motion
  ({ page } = await open(browser, { viewport: { width: 360, height: 740 }, reducedMotion: 'reduce' }));
  await page.waitForSelector('.contact-row');
  check('mobile: no horizontal scroll', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  check('reduced motion: no row animation', await page.evaluate(() => getComputedStyle(document.querySelector('.contact-row')).animationName === 'none'));
  await page.fill('#search-input', 'r');
  if (shots) await page.screenshot({ path: shots + '/6-mobile.png' });
  await page.close();

  await browser.close();
  console.log(results.join('\n'));
  console.log(`\n${results.filter(r => r.startsWith('PASS')).length}/${results.length} passed`);
})();
