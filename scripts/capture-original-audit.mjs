import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const root = 'research/audit-2026-11-15';
const html = readFileSync(`${root}/original-homepage.html`, 'utf8');
const text = html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
writeFileSync(`${root}/original-text.txt`,text);
writeFileSync(`${root}/original-urls.txt`,[...new Set([...html.matchAll(/(?:href|src)=["']([^"']+)/g)].map(m=>m[1]))].join('\n'));
const endpoint = 'http://127.0.0.1:9223';
const target = await (await fetch(`${endpoint}/json/new?about:blank`,{method:'PUT'})).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r=>socket.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();
socket.addEventListener('message',event=>{const d=JSON.parse(event.data);if(d.id){const p=pending.get(d.id);pending.delete(d.id);d.error?p?.reject(d.error):p?.resolve(d.result);}});
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}));});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function shot(name){const r=await send('Page.captureScreenshot',{format:'png'});writeFileSync(`${root}/${name}.png`,Buffer.from(r.data,'base64'));}
await send('Page.enable');await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'https://fibernet-sa.online/'});
for(let attempt=0;attempt<24;attempt++){
 await delay(500);
 const ready=await send('Runtime.evaluate',{expression:'document.querySelectorAll("h2").length',returnByValue:true});
 if(ready.result?.value>0) break;
}
await shot('original-desktop');
const data=await send('Runtime.evaluate',{expression:`JSON.stringify({title:document.title,headings:[...document.querySelectorAll('h1,h2')].map(h=>h.textContent.trim()),phoneLinks:[...document.links].filter(a=>a.protocol==='tel:'||a.href.includes('whatsapp')).map(a=>a.getAttribute('href')),galleryImages:[...document.querySelectorAll('.elementor-element-aaf37df img')].map(i=>i.src)})`,returnByValue:true});
writeFileSync(`${root}/live-browser-audit.json`,data.result.value||'{}');
await send('Runtime.evaluate',{expression:`document.querySelector('.elementor-element-aaf37df')?.scrollIntoView({block:'center',behavior:'instant'})`});await delay(700);await shot('original-wall-box-section');
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await send('Runtime.evaluate',{expression:'scrollTo({top:0,behavior:"instant"})'});await delay(300);await shot('original-mobile');
await fetch(`${endpoint}/json/close/${target.id}`);socket.close();console.log('Captured original homepage and extracted source audit.');
