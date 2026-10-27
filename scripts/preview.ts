/**
 * pnpm preview — serve out/ under /Portfolio/, the way GitHub Pages serves it.
 * Run `pnpm build` first.
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { basePath } from '../src/lib/site'

const out = join(import.meta.dirname, '..', 'out')
const port = Number(process.env.PORT ?? 4173)

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
}

if (!existsSync(out)) {
  console.error('out/ not found: run `pnpm build` first.')
  process.exit(1)
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  if (!url.pathname.startsWith(`${basePath}/`)) {
    res.writeHead(302, { location: `${basePath}/` }).end()
    return
  }
  let file = normalize(join(out, decodeURIComponent(url.pathname.slice(basePath.length))))
  if (!file.startsWith(out)) return void res.writeHead(403).end()
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  const status = existsSync(file) ? 200 : 404
  if (status === 404) file = join(out, '404.html')
  res.writeHead(status, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}).listen(port, () => console.log(`Serving out/ at http://localhost:${port}${basePath}/`))
