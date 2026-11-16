import { mkdirSync, writeFileSync } from 'node:fs';
const remote = 'http://127.0.0.1:9223';
const target = await (await fetch(`${remote}/json/new?about:blank`, {method:'PUT'})).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let id=0;const pending = new Map();
ws.addEventListener('message',e=>{const d=JSON.parse(e.data);if(d.id){const p=pending.get(d.id);pending.delete(d.id);d.error?p?.reject(d.error):p?.resolve(d.result);}});
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));setTimeout(()=>{if(pending.has(n)){pending.delete(n);reject(new Error(`CDP timeout: ${method}`));}},20000).unref();});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1050,deviceScaleFactor:1,mobile:false});
mkdirSync('research/provider-references',{recursive:true});
const sites=[['gfiber','https://gfiber.com/'],['hyperoptic','https://www.hyperoptic.com/'],['verizon','https://www.verizon.com/home/internet/'],['starlink','https://starlink.com/residential'],['swisscom','https://www.swisscom.ch/en/residential/internet-subscription.html']];
for(const [name,url] of sites){
  try{
    await send('Page.navigate',{url});await delay(5500);
    const image=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    writeFileSync(`research/provider-references/${name}.png`,Buffer.from(image.data,'base64'));
    const data=await send('Runtime.evaluate',{expression:`JSON.stringify({url:location.href,title:document.title,headings:[...document.querySelectorAll('h1,h2')].slice(0,12).map(e=>e.textContent.trim()),colors:[...new Set([...document.querySelectorAll('header,main,section,button')].slice(0,80).map(e=>getComputedStyle(e).backgroundColor))]})`,returnByValue:true});
    writeFileSync(`research/provider-references/${name}.json`,data.result.value);console.log(`${name}: captured`);
  }catch(e){console.log(`${name}: ${e.message}`);}
}
await fetch(`${remote}/json/close/${target.id}`);ws.close();
