const target=await(await fetch('http://127.0.0.1:9223/json/new?about:blank',{method:'PUT'})).json();
const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>socket.addEventListener('open',r,{once:true}));
let id=0;const pending=new Map();socket.addEventListener('message',e=>{const d=JSON.parse(e.data);if(d.id){pending.get(d.id)?.(d.result);pending.delete(d.id);}});
const send=(method,params={})=>new Promise(resolve=>{const n=++id;pending.set(n,resolve);socket.send(JSON.stringify({id:n,method,params}));});
await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:320,height:844,deviceScaleFactor:1,mobile:true});await send('Page.navigate',{url:'http://127.0.0.1:3005'});await new Promise(r=>setTimeout(r,700));
for(const locale of ['en','ar']){
 await send('Runtime.evaluate',{expression:`document.querySelector('.nav-actions .language-button').click()`});await new Promise(r=>setTimeout(r,200));
 const data=await send('Runtime.evaluate',{returnByValue:true,expression:`JSON.stringify({dir:document.dir,innerWidth,clientWidth:document.documentElement.clientWidth,viewport:visualViewport.width,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();if(!r.width||(r.left>=-1&&r.right<=321))return false;for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){if(['hidden','clip','auto','scroll'].includes(getComputedStyle(p).overflowX))return false;}return true}).slice(0,35).map(e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return {tag:e.tagName,class:typeof e.className==='string'?e.className:'svg',text:e.textContent.slice(0,100),left:r.left,right:r.right,width:r.width,cssWidth:s.width,min:s.minWidth,grid:s.gridTemplateColumns,font:s.fontSize}}),dock:document.querySelector('.contact-dock').getBoundingClientRect().toJSON()})`});console.log(data.result?.value);
}
await fetch(`http://127.0.0.1:9223/json/close/${target.id}`);socket.close();
