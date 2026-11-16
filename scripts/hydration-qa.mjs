import { mkdirSync, writeFileSync } from 'node:fs';

// Run against the development server: React's attribute-mismatch diagnostics
// are development-only. All injected attributes exist only in this test tab.
const appUrl = process.argv[2] || 'http://127.0.0.1:3000';
const expectBodyWarning = process.argv.includes('--expect-body-warning');
const endpoint = 'http://127.0.0.1:9223';
const target = await (await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
let sequence = 0;
const pending = new Map();
let warnings = [];
let exceptions = [];
socket.addEventListener('message', ({ data }) => {
  const response = JSON.parse(data);
  if (response.id) {
    const call = pending.get(response.id);
    pending.delete(response.id);
    if (response.error) call?.reject(response.error);
    else call?.resolve(response.result);
  }
  if (response.method === 'Runtime.consoleAPICalled') {
    const message = response.params.args.map(arg => arg.value ?? arg.description ?? '').join(' ');
    if (/hydration|hydrated|server.rendered/i.test(message)) warnings.push(message);
  }
  if (response.method === 'Runtime.exceptionThrown') exceptions.push(response.params.exceptionDetails.text);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
};
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const results = [];
try {
  const html = await (await fetch(appUrl)).text();
  if (html.includes('bis_register')) throw new Error('The server unexpectedly emits the extension attribute.');
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.bringToFront');
  for (const scenario of [
    { name: 'Clean English load', locale: 'en', injectBody: false, injectChild: false },
    { name: 'Extension attribute before English hydration', locale: 'en', injectBody: true, injectChild: false },
    { name: 'Extension attribute with saved Arabic preference', locale: 'ar', injectBody: true, injectChild: false },
    { name: 'Child mismatches still produce a warning', locale: 'en', injectBody: true, injectChild: true },
  ]) {
    await send('Page.navigate', { url: 'about:blank' });
    await pause(100);
    warnings = [];
    exceptions = [];
    const { identifier } = await send('Page.addScriptToEvaluateOnNewDocument', { source: `
      try { localStorage.setItem('fibernet-language', ${JSON.stringify(scenario.locale)}); } catch {}
      window.__hydrationProbe = { body: false, child: false };
      const observer = new MutationObserver(inject);
      function inject() {
        if (${scenario.injectBody} && document.body && !window.__hydrationProbe.body) {
          document.body.setAttribute('bis_register', btoa(JSON.stringify([{master:true,extensionId:'hydration-test'}])));
          window.__hydrationProbe.body = true;
        }
        const section = document.getElementById('home');
        if (${scenario.injectChild} && section && !window.__hydrationProbe.child) {
          section.setAttribute('data-hydration-probe', 'intentional-child-mismatch');
          window.__hydrationProbe.child = true;
        }
        if ((!${scenario.injectBody} || window.__hydrationProbe.body) && (!${scenario.injectChild} || window.__hydrationProbe.child)) observer.disconnect();
      }
      observer.observe(document, {childList:true,subtree:true});
      inject();
    ` });
    try {
      await send('Page.navigate', { url: appUrl });
      await pause(900);
      const state = await evaluate(`(async()=>{
        for(let attempt=0;attempt<50;attempt++){
          const tab=document.getElementById('tab-stc');
          if(tab){tab.click();await new Promise(resolve=>setTimeout(resolve,60));}
          if(tab?.getAttribute('aria-selected')==='true'&&document.documentElement.lang===${JSON.stringify(scenario.locale)})break;
          await new Promise(resolve=>setTimeout(resolve,100));
        }
        return {probe:window.__hydrationProbe,locale:document.documentElement.lang,dir:document.documentElement.dir,interactive:document.getElementById('tab-stc')?.getAttribute('aria-selected')==='true',cards:document.querySelectorAll('#plans-panel .plan-card').length};
      })()`);
      await pause(250);
      const expectsWarning = scenario.injectChild || (scenario.injectBody && expectBodyWarning);
      const hasExpectedWarning = expectsWarning
        ? warnings.some(message => message.includes(scenario.injectChild ? 'data-hydration-probe' : 'bis_register'))
        : warnings.length === 0;
      const pass = hasExpectedWarning && exceptions.length === 0 && state.interactive && state.cards === 3
        && state.locale === scenario.locale && state.dir === (scenario.locale === 'ar' ? 'rtl' : 'ltr')
        && state.probe.body === scenario.injectBody && state.probe.child === scenario.injectChild;
      results.push({ name: scenario.name, pass, expectsWarning, warningCount: warnings.length, state, exceptions: [...exceptions] });
      if (!pass) console.log('FAIL', scenario.name, JSON.stringify({ state, warnings, exceptions }));
    } finally {
      await send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
    }
  }
  mkdirSync('artifacts', { recursive: true });
  const filename = expectBodyWarning ? 'hydration-before.json' : 'hydration-qa.json';
  writeFileSync(`artifacts/${filename}`, JSON.stringify({ results }, null, 2));
  console.log(JSON.stringify({ passed: results.filter(result => result.pass).length, total: results.length, results }, null, 2));
  if (results.some(result => !result.pass)) process.exitCode = 1;
} finally {
  await fetch(`${endpoint}/json/close/${target.id}`);
  socket.close();
}
