// 本地预览用的极简静态服务器（零依赖）
// 用法：node preview.mjs  然后打开 http://127.0.0.1:5500
// 只用于本地看效果，正式上线用 Vercel / GitHub Pages / 阿里云 OSS。

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT) || 5500;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function resolveFile(urlPath) {
  // 去掉查询串和 hash，解码中文路径
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const target = normalize(join(ROOT, clean));

  // 防目录穿越：必须仍在 ROOT 内
  if (target !== ROOT.replace(/[\\/]$/, "") && !target.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep)) {
    return null;
  }

  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      return resolveFile(clean.replace(/\/?$/, "/") + "index.html");
    }
    return target;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = req.url || "/";
  const file = await resolveFile(url === "/" ? "/index.html" : url);

  if (!file) {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(`<h1>404</h1><p>找不到 ${url}</p><p><a href="/">回首页</a></p>`);
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("读取文件失败");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`本地预览: http://127.0.0.1:${PORT}`);
  console.log("按 Ctrl+C 停止");
});
