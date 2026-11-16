import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

let css = readFileSync('public/fonts/google-source.css', 'utf8').replace(/^\uFEFF/, '');
const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))];
for (let i=0;i<urls.length;i++) {
  const ext = urls[i].split('.').pop();
  const name = `font-${i}.${ext}`;
  if (existsSync(`public/fonts/${name}`)) { css = css.replaceAll(urls[i], `/fonts/${name}`); continue; }
  const response = await fetch(urls[i]);
  if (!response.ok) throw new Error(`Font download failed: ${response.status}`);
  writeFileSync(`public/fonts/${name}`, Buffer.from(await response.arrayBuffer()));
  css = css.replaceAll(urls[i], `/fonts/${name}`);
}
writeFileSync('public/fonts/fonts.css',css);
for (const name of ['connected-home','connected-everyday']) {
  await sharp(`research/generated-assets/${name}.png`).resize({width:1440,withoutEnlargement:true}).webp({quality:87}).toFile(`public/images/${name}.webp`);
}
console.log(`Prepared ${urls.length} local fonts and two optimized lifestyle images.`);
