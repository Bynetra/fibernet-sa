import { mkdirSync, writeFileSync } from 'node:fs';
const base = 'http://127.0.0.1:9223';
const appUrl = process.argv[2] || 'http://127.0.0.1:3000';
const target = await (await fetch(`${base}/json/new?about:blank`,{method:'PUT'})).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
let id=0;const pending = new Map();const errors=[];const results=[];
socket.addEventListener('message',event=>{const data=JSON.parse(event.data);if(data.id){const p=pending.get(data.id);pending.delete(data.id);if(data.error)p?.reject(data.error);else p?.resolve(data.result);}if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails.text);if(data.method==='Log.entryAdded'&&data.params.entry.level==='error')errors.push(data.params.entry.text);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});socket.send(JSON.stringify({id:key,method,params}));});
const evaluate=async(expression)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const check=(name,pass,detail)=>{results.push({name,pass:!!pass,detail});if(!pass)console.log('FAIL',name,detail);};
async function resize(width,height=900){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<760});await delay(150);}
async function ready(){await evaluate('document.fonts.ready.then(()=>Promise.all([...document.images].filter(i=>i.loading!=="lazy").map(i=>i.decode().catch(()=>{}))))');await delay(250);}
async function screenshot(name,full=false){const metrics=await send('Page.getLayoutMetrics');const params={format:'png',captureBeyondViewport:full};if(full)params.clip={x:0,y:0,width:metrics.cssContentSize.width,height:metrics.cssContentSize.height,scale:1};const r=await send('Page.captureScreenshot',params);writeFileSync(`artifacts/${name}.png`,Buffer.from(r.data,'base64'));}
async function galleryScreenshot(name){
  await evaluate(`(()=>{document.activeElement?.blur();const style=document.createElement('style');style.id='gallery-capture';style.textContent='.header,.contact-dock,.skip-link{visibility:hidden!important}';document.head.append(style)})()`);
  try{
    const clip=await evaluate('(()=>{const r=document.getElementById("fiber-boxes").getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()');
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});writeFileSync(`artifacts/${name}.png`,Buffer.from(shot.data,'base64'));
  }finally{await evaluate('document.getElementById("gallery-capture").remove()');}
}
await send('Page.enable');await send('Runtime.enable');await send('Log.enable');await send('Page.bringToFront');await resize(1440,1000);await send('Page.navigate',{url:appUrl});await delay(700);await ready();
await evaluate('localStorage.clear()');await send('Page.reload');await delay(700);await ready();
mkdirSync('artifacts',{recursive:true});
check('Page title and new headline',await evaluate('document.querySelector("h1").textContent.includes("Home internet.")&&document.title.includes("Compare home fiber")'));
check('Hero image loads',await evaluate('document.querySelector(".hero-image").complete&&document.querySelector(".hero-image").naturalWidth>0'));
check('Local fonts loaded',await evaluate('document.fonts.check("600 16px Manrope")'));
await screenshot('desktop-en');await screenshot('desktop-en-full',true);
check('All business call links use the verified number',await evaluate('[...document.links].filter(a=>a.protocol==="tel:").every(a=>a.getAttribute("href")==="tel:+966547205593")'));
check('All WhatsApp links use the verified international number',await evaluate('[...document.links].filter(a=>a.hostname==="wa.me").every(a=>new URL(a.href).pathname==="/966547205593")'));
check('Call and WhatsApp have distinct persistent actions',await evaluate('document.querySelector(".contact-dock .dock-call").getAttribute("href")==="tel:+966547205593"&&document.querySelector(".contact-dock .dock-whatsapp").href.includes("wa.me/966547205593")'));
check('All five original box photographs are present',await evaluate('document.querySelectorAll(".box-photo-open").length===5'));
check('Photo enquiry prepares the correct message',await evaluate('decodeURIComponent(document.querySelector(".box-photo-cta").href).includes("I’ll attach a photo")'));
check('5G and Mobily enquiry is available without invented plans',await evaluate('decodeURIComponent(document.querySelector(".connection-options a").href).includes("5G home internet or Mobily")'));
await evaluate('document.querySelectorAll(".box-photo-open")[0].focus();document.querySelectorAll(".box-photo-open")[0].click()');await delay(200);
check('Photo opens as a modal and receives focus',await evaluate('document.querySelector(".photo-dialog").matches(":modal")&&document.querySelector(".photo-dialog").contains(document.activeElement)&&document.querySelector(".photo-dialog img").src.endsWith("box-1.jpg")'));
await evaluate('document.querySelector(".photo-controls button:last-child").click()');
check('Photo next control shows the second original image',await evaluate('document.querySelector(".photo-dialog img").src.endsWith("box-2.jpg")'));
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight'});
check('Gallery supports keyboard navigation',await evaluate('document.querySelector(".photo-dialog img").src.endsWith("box-3.jpg")'));
await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});await delay(150);
check('Escape closes the photo and restores focus',await evaluate('!document.querySelector(".photo-dialog").open&&document.activeElement===document.querySelectorAll(".box-photo-open")[0]&&document.body.style.overflow!=="hidden"'));
await evaluate('scrollTo(0,0)');
await evaluate('document.getElementById("tab-stc").click()');
check('STC tab shows STC prices',await evaluate('document.getElementById("plans-panel").textContent.includes("287")&&document.getElementById("tab-stc").getAttribute("aria-selected")==="true"'));
await evaluate('document.getElementById("tab-zain").click()');
check('Zain tab shows Zain plans',await evaluate('document.getElementById("plans-panel").textContent.includes("Zain Fiber Plus")&&document.getElementById("plans-panel").textContent.includes("399")'));
check('Three package cards remain visible in selected provider',await evaluate('document.querySelectorAll("#plans-panel .plan-card").length===3'));
await evaluate('document.getElementById("tab-salam").click()');
check('Plan WhatsApp links have verified recipient and context',await evaluate('[...document.querySelectorAll(".plan-card>.button")].every(a=>a.href.includes("wa.me/966547205593")&&decodeURIComponent(a.href).includes("Salam Fiber"))'));
await evaluate('document.getElementById("faq-question-1").click()');
check('FAQ accordion expands accessibly',await evaluate('document.getElementById("faq-question-1").getAttribute("aria-expanded")==="true"&&!document.getElementById("faq-answer-1").hidden&&document.getElementById("faq-answer-0").hidden'));
await evaluate('document.querySelector(".coverage-form button[type=submit]").click()');
check('Coverage form validates both fields',await evaluate('!!document.getElementById("city-error")&&!!document.getElementById("district-error")'));
check('Invalid form focuses the missing field',await evaluate('document.activeElement.id==="city"'));
await evaluate(`window.__opened='';window.open=(url)=>{window.__opened=url;return null};document.getElementById('city').value='Riyadh';document.getElementById('city').dispatchEvent(new Event('change',{bubbles:true}));`);
await evaluate(`const el=document.getElementById('district');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'Al Yasmin');el.dispatchEvent(new Event('input',{bubbles:true}));`);await delay(150);
await evaluate('document.querySelector(".coverage-form button[type=submit]").click()');
const enquiry=await evaluate('window.__opened');
check('Coverage sends enquiry with city and neighbourhood',enquiry?.includes('966547205593')&&decodeURIComponent(enquiry).includes('Riyadh')&&decodeURIComponent(enquiry).includes('Al Yasmin'),enquiry);
for(const locale of ['en','ar']){
  if(locale==='ar'){await evaluate('document.querySelector(".nav-actions .language-button").click()');await ready();}
  for(const width of [1440,1280,1024,768,430,390,360,320]){
    await resize(width, width<760?844:1000);
    const dimensions=await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth,dir:document.documentElement.dir,overflow:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+2&&getComputedStyle(e).position!=='absolute'}).slice(0,5).map(e=>e.className)})`);
    check(`No horizontal overflow: ${locale} ${width}px`,dimensions.scroll<=width+1&&dimensions.width<=width+1,dimensions);
    const contact=await evaluate(`(()=>{const links=[...document.querySelectorAll('.contact-dock a')];return links.map(a=>{const r=a.getBoundingClientRect();return {href:a.getAttribute('href'),visible:r.left>=-0.5&&r.right<=innerWidth+0.5&&r.top>=0&&r.bottom<=innerHeight+0.5,fullLabel:a.scrollWidth<=a.clientWidth+1,height:r.height,left:r.left,right:r.right,bottom:r.bottom}})})()`);
    check(`Both contact buttons fit fully: ${locale} ${width}px`,contact.length===2&&contact.every(a=>a.visible&&a.fullLabel&&a.height>=44),contact);
    const header=await evaluate(`(()=>{const logo=document.querySelector('.brand-link').getBoundingClientRect();const actions=document.querySelector('.nav-actions').getBoundingClientRect();const nav=document.querySelector('.desktop-nav');const n=nav.getBoundingClientRect();return getComputedStyle(nav).display==='none'||(document.dir==='rtl' ? n.right<=logo.left+1&&n.left>=actions.right-1 : n.left>=logo.right-1&&n.right<=actions.left+1)})()`);
    check(`Header controls do not overlap: ${locale} ${width}px`,header);
    const photoFrame=await evaluate(`(()=>{const frame=document.querySelector('.box-photo-featured .box-photo-open').getBoundingClientRect();const image=document.querySelector('.box-photo-featured img').getBoundingClientRect();return {ratio:frame.width/frame.height,inlineGap:frame.width-image.width,blockGap:frame.height-image.height}})()`);
    check(`Featured photo fills its frame: ${locale} ${width}px`,Math.abs(photoFrame.ratio-890/554)<0.01&&photoFrame.inlineGap<=2.1&&photoFrame.blockGap<=2.1,photoFrame);
    if(width===390){await evaluate('scrollTo(0,0)');await screenshot(`mobile-${locale}`);await screenshot(`mobile-${locale}-full`,true);}
    if(locale==='ar'&&width===1440){await evaluate('scrollTo(0,0)');await screenshot('desktop-ar');}
  }
}
await resize(1440,1000);
await evaluate('document.querySelector(".nav-actions .language-button").click();document.getElementById("fiber-boxes").scrollIntoView({behavior:"instant",block:"start"})');await ready();
await evaluate('Promise.all([...document.querySelectorAll(".box-photo-open img")].map(i=>i.decode()))');
check('All gallery photographs load',await evaluate('[...document.querySelectorAll(".box-photo-open img")].every(i=>i.naturalWidth>0)'));
await galleryScreenshot('fiber-box-guide-en');
await evaluate('document.querySelectorAll(".box-photo-open")[4].click()');await delay(200);await screenshot('fiber-photo-viewer');await evaluate('document.querySelector(".photo-close").click()');await delay(150);
for(const width of [1440,390]){
  await resize(width,width===390?844:1000);
  for(let index=0;index<5;index++){
    await evaluate(`document.querySelectorAll('.box-photo-open')[${index}].click()`);await delay(150);
    await evaluate('document.querySelector(".photo-dialog img").decode()');
    const framing=await evaluate(`(()=>{const dialog=document.querySelector('.photo-dialog');const frame=document.querySelector('.photo-dialog-image');const image=frame.querySelector('img');const r=image.getBoundingClientRect();const d=dialog.getBoundingClientRect();return {sideGap:frame.clientWidth-r.width,aspect:r.width/r.height,naturalAspect:image.naturalWidth/image.naturalHeight,visible:d.left>=0&&d.right<=innerWidth&&d.top>=0&&d.bottom<=innerHeight+1,overflow:dialog.scrollWidth>dialog.clientWidth+1}})()`);
    check(`Photo viewer fits original without side gaps: ${width}px photo ${index+1}`,Math.abs(framing.sideGap)<1&&Math.abs(framing.aspect-framing.naturalAspect)<0.01&&framing.visible&&!framing.overflow,framing);
    if(width===390&&index===4)await screenshot('fiber-photo-viewer-mobile');
    await evaluate('document.querySelector(".photo-close").click()');await delay(100);
  }
  if(width===390){
    await evaluate('document.getElementById("fiber-boxes").scrollIntoView({behavior:"instant",block:"start"})');
    await galleryScreenshot('fiber-box-guide-mobile');
  }
}
await resize(1440,1000);
await evaluate('document.querySelector(".nav-actions .language-button").click()');await ready();
check('Arabic applies document language and direction',await evaluate('document.documentElement.lang==="ar"&&document.documentElement.dir==="rtl"'));
await resize(390,844);await evaluate('document.querySelector(".menu-button").click()');
check('Mobile navigation opens',await evaluate('!!document.getElementById("mobile-nav")&&document.querySelector(".menu-button").getAttribute("aria-expanded")==="true"'));
await evaluate('document.querySelectorAll("#mobile-nav a")[3].click()');
check('Mobile navigation closes on link',await evaluate('!document.getElementById("mobile-nav")'));
await send('Page.reload');await delay(600);await ready();
check('Language preference survives reload',await evaluate('document.documentElement.dir==="rtl"'));
await resize(740,360);await evaluate('document.querySelector(".menu-button").click()');
check('Navigation remains scrollable on short landscape screens',await evaluate('(()=>{const r=document.getElementById("mobile-nav").getBoundingClientRect();const dock=document.querySelector(".contact-dock").getBoundingClientRect();return r.bottom<=dock.top&&getComputedStyle(document.getElementById("mobile-nav")).overflowY==="auto"})()'));
await evaluate('document.querySelector(".menu-button").click()');
await evaluate('document.querySelector(".nav-actions .language-button").click();scrollTo(0,0)');
check('No browser errors',errors.length===0,errors);
writeFileSync('artifacts/qa-report.json',JSON.stringify({results,errors},null,2));
console.log(JSON.stringify({passed:results.filter(r=>r.pass).length,total:results.length,failures:results.filter(r=>!r.pass),errors},null,2));
await fetch(`${base}/json/close/${target.id}`);socket.close();if(results.some(r=>!r.pass))process.exitCode=1;
