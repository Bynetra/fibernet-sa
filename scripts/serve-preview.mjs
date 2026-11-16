import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('out');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.woff2':'font/woff2','.json':'application/json'};
const server = http.createServer(async(req,res)=>{
  try {
    let pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname.endsWith('/')) pathname+='index.html';
    const file = path.resolve(root, '.'+pathname);
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const data = await readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
});
const port = Number(process.argv[2] || 3000);
server.listen(port,'127.0.0.1',()=>console.log(`FiberNet preview: http://127.0.0.1:${port}`));
