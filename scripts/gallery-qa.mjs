import { mkdirSync, writeFileSync } from 'node:fs';

const endpoint = 'http://127.0.0.1:9223';
const appUrl = process.argv[2] || 'http://127.0.0.1:3000';
const target = await (await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
let sequence = 0;
const pending = new Map();
const results = [];
socket.addEventListener('message', ({ data }) => {
  const response = JSON.parse(data);
  if (!response.id) return;
  const call = pending.get(response.id);
  pending.delete(response.id);
  if (response.error) call?.reject(response.error);
  else call?.resolve(response.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const check = (name, pass, detail) => {
  results.push({ name, pass: !!pass, detail });
  if (!pass) console.log('FAIL', name, JSON.stringify(detail));
};
async function resize(width, height) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 761 });
  await pause(150);
}
async function key(key, code = key, shift = false) {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, modifiers: shift ? 8 : 0 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers: shift ? 8 : 0 });
}
async function captureGuide(locale) {
  // Hide fixed viewport overlays only in the cropped section screenshot.
  // Visibility preserves layout and the real gallery measurements.
  await evaluate(`(()=>{document.activeElement?.blur();const style=document.createElement('style');style.id='gallery-capture';style.textContent='.header,.contact-dock,.skip-link{visibility:hidden!important}';document.head.append(style)})()`);
  try {
    const clip = await evaluate(`(()=>{const r=document.getElementById('fiber-boxes').getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()`);
    const capture = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
    writeFileSync(`artifacts/fiber-box-guide-mobile-${locale}.png`, Buffer.from(capture.data, 'base64'));
    if (locale === 'en') writeFileSync('artifacts/fiber-box-guide-mobile.png', Buffer.from(capture.data, 'base64'));
  } finally {
    await evaluate(`document.getElementById('gallery-capture').remove()`);
  }
}
try {
  mkdirSync('artifacts', { recursive: true });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.bringToFront');
  await resize(390, 844);
  await send('Page.navigate', { url: appUrl });
  await pause(1200);
  await evaluate('localStorage.setItem("fibernet-language","en")');
  await send('Page.reload');
  await pause(1000);
  await evaluate('document.fonts.ready');
  for (const locale of ['en', 'ar']) {
    if (locale === 'ar') {
      await evaluate('document.querySelector(".language-button").click()');
      await pause(250);
    }
    await resize(390, 844);
    await evaluate('document.getElementById("fiber-boxes").scrollIntoView({behavior:"instant"})');
    await evaluate('Promise.all([...document.querySelectorAll(".box-photo-open img")].map(image=>image.decode()))');
    await captureGuide(locale);
    await resize(740, 360);
    await evaluate(`document.querySelectorAll('.box-photo-open')[1].click()`);
    await pause(200);
    check(`${locale}: viewer announces its photo`, await evaluate(`document.querySelector('.photo-dialog').getAttribute('aria-describedby')==='photo-dialog-description'&&!!document.getElementById('photo-dialog-description')`));
    for (let index = 0; index < 4; index++) await key('Tab');
    check(`${locale}: keyboard focus stays in modal`, await evaluate(`document.querySelector('.photo-dialog').contains(document.activeElement)`));
    await evaluate(`document.querySelector('.photo-dialog').scrollTop=10000`);
    const overflow = await evaluate(`(()=>{const dialog=document.querySelector('.photo-dialog');return {scrollTop:dialog.scrollTop,scrollHeight:dialog.scrollHeight,height:dialog.clientHeight}})()`);
    check(`${locale}: short viewer can scroll to the complete photo and controls`, overflow.scrollTop > 0, overflow);
    const controls = await evaluate(`[...document.querySelectorAll('.photo-dialog-actions button')].map(button=>{const r=button.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height,width:r.width}})`);
    check(`${locale}: close and both photo controls stay reachable while scrolling`, controls.length === 3 && controls.every(r=>r.top>=0&&r.bottom<=360&&r.left>=0&&r.right<=740&&r.height>=44&&r.width>=44), controls);
    await evaluate(`document.querySelector('.photo-controls button:last-child').focus();document.querySelector('.photo-controls button:last-child').click()`);
    await pause(180);
    const next = await evaluate(`(()=>{const dialog=document.querySelector('.photo-dialog');return {scrollTop:dialog.scrollTop,photo:dialog.querySelector('img').getAttribute('src'),focused:document.activeElement===document.querySelector('.photo-controls button:last-child')}})()`);
    check(`${locale}: changing a photo starts it at the top and retains control focus`, next.scrollTop === 0 && next.photo.endsWith('box-3.jpg') && next.focused, next);
    await key('Escape');
    await pause(150);
    check(`${locale}: keyboard close restores the opener and releases page scroll`, await evaluate(`!document.querySelector('.photo-dialog').open&&document.activeElement===document.querySelectorAll('.box-photo-open')[1]&&document.body.style.overflow!=='hidden'`));
  }
  await evaluate('document.querySelector(".language-button").click()');
  writeFileSync('artifacts/gallery-qa.json', JSON.stringify({ results }, null, 2));
  console.log(JSON.stringify({ passed: results.filter(result => result.pass).length, total: results.length, failures: results.filter(result => !result.pass) }, null, 2));
  if (results.some(result => !result.pass)) process.exitCode = 1;
} finally {
  await fetch(`${endpoint}/json/close/${target.id}`);
  socket.close();
}
