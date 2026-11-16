import { mkdirSync, writeFileSync } from 'node:fs';

const base = 'http://127.0.0.1:9223';
const appUrl = process.argv[2] || 'http://127.0.0.1:3000';
const directOnly = process.argv.includes('--direct-only');
const target = await (await fetch(`${base}/json/new?about:blank`, { method: 'PUT' })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id) return;
  const call = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) call?.reject(message.error);
  else call?.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
};
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const sectionIds = ['home', 'plans', 'why-fibernet', 'coverage', 'fiber-boxes', 'faq'];
const results = [];
async function checkActive(name, expected) {
  await pause(180);
  const detail = await evaluate(`({active:document.querySelector('.desktop-nav [aria-current="location"]')?.hash.slice(1),scrollY,sections:${JSON.stringify(sectionIds)}.map(id=>({id,top:Math.round(document.getElementById(id).getBoundingClientRect().top)}))})`);
  const pass = detail.active === expected;
  results.push({ name, pass, expected, ...detail });
  if (!pass) console.log('FAIL', name, JSON.stringify(detail));
}
async function scrollToSection(id) {
  await evaluate(`(()=>{const section=document.getElementById(${JSON.stringify(id)});const marker=document.querySelector('.header').getBoundingClientRect().height+16;scrollTo({top:section.getBoundingClientRect().top+scrollY-marker,behavior:'instant'})})()`);
}
async function waitForAnchor(id) {
  // Initial hash navigation can start another smooth scroll after fonts load.
  // Wait for the actual target position rather than asserting after a timer.
  await evaluate(`document.fonts.ready`);
  await evaluate(`(async()=>{for(let attempt=0;attempt<70;attempt++){const top=document.getElementById('${id}').getBoundingClientRect().top;const offset=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);if(Math.abs(top-offset)<3)return;await new Promise(resolve=>setTimeout(resolve,100));}})()`);
}
try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.bringToFront');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: appUrl });
  await pause(1200);
  await evaluate('localStorage.setItem("fibernet-language","en")');
  await send('Page.reload');
  await pause(1000);
  await evaluate('document.fonts.ready');
  for (const locale of directOnly ? [] : ['en', 'ar']) {
    if (locale === 'ar') {
      await evaluate('document.querySelector(".language-button").click()');
      await pause(300);
    }
    for (const id of sectionIds) {
      await scrollToSection(id);
      await checkActive(`${locale}: scroll down to ${id}`, id);
    }
    for (const id of sectionIds.toReversed()) {
      await scrollToSection(id);
      await checkActive(`${locale}: scroll up to ${id}`, id);
    }
    // Exercise smooth anchor navigation as well as large instantaneous jumps.
    for (const id of ['fiber-boxes', 'coverage', 'faq', 'home', 'plans']) {
      await evaluate(`document.querySelector('.desktop-nav a[href="#${id}"]').click()`);
      await pause(1300);
      await checkActive(`${locale}: anchor click ${id}`, id);
    }
    await scrollToSection('coverage');
    await pause(180);
    for (const id of ['fiber-boxes', 'faq']) {
      const deltaY = await evaluate(`document.getElementById('${id}').getBoundingClientRect().top-document.querySelector('.header').getBoundingClientRect().height-16`);
      await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 1200, y: 500, deltaX: 0, deltaY });
      await pause(250);
      await checkActive(`${locale}: mouse wheel to ${id}`, id);
    }
    await evaluate('scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})');
    await checkActive(`${locale}: document bottom`, 'faq');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    for (const id of sectionIds) {
      await scrollToSection(id);
      await checkActive(`${locale}: mobile scroll to ${id}`, id);
    }
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1400, deviceScaleFactor: 1, mobile: false });
    await evaluate('scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})');
    await checkActive(`${locale}: tall viewport document bottom`, 'faq');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  }
  await evaluate('if(document.documentElement.lang!=="en")document.querySelector(".language-button").click()');
  for (const id of ['fiber-boxes', 'faq']) {
    await send('Page.navigate', { url: 'about:blank' });
    await pause(150);
    await send('Page.navigate', { url: `${appUrl}/#${id}` });
    await pause(1200);
    await waitForAnchor(id);
    await checkActive(`Direct URL #${id}`, id);
    await send('Page.reload');
    await pause(1200);
    await waitForAnchor(id);
    await checkActive(`Reload #${id}`, id);
  }
  mkdirSync('artifacts', { recursive: true });
  writeFileSync('artifacts/navigation-qa.json', JSON.stringify({ results }, null, 2));
  console.log(JSON.stringify({ passed: results.filter(result => result.pass).length, total: results.length, failures: results.filter(result => !result.pass) }, null, 2));
  if (results.some(result => !result.pass)) process.exitCode = 1;
} finally {
  await fetch(`${base}/json/close/${target.id}`);
  socket.close();
}
