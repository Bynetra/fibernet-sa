import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const html = readFileSync('../fibernet-source.html', 'utf8');
const urls = [...new Set([...html.matchAll(/(?:href|src|data-src)=["']([^"']+)/g)].map(m => m[1]))];
mkdirSync('research', { recursive: true });
writeFileSync('research/original-urls.txt', urls.join('\n'));
let text = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
writeFileSync('research/original-text.txt', text);
console.log(urls.filter(x=>/facebook|whatsapp|tel:/.test(x)));
console.log(text.slice(0, 18000));
