const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../out");
const port = Number(process.env.PORT || 3000);
const host = process.env.PORTFOLIO_HOST || "127.0.0.1";
const types = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

if (!fs.existsSync(path.join(root, "index.html"))) {
  console.error("Build the static site first with npm run build.");
  process.exit(1);
}

http
  .createServer((request, response) => {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405);
      response.end();
      return;
    }
    let file;
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      file = path.resolve(root, "." + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) {
        response.writeHead(403);
        response.end();
        return;
      }
      if (file === root) file = path.join(root, "index.html");
      else if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        const base = file.replace(/\/$/, "");
        file = fs.existsSync(base + ".html")
          ? base + ".html"
          : path.join(file, "index.html");
      }
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        if (request.method === "HEAD") response.end();
        else fs.createReadStream(path.join(root, "404.html")).pipe(response);
        return;
      }
      const size = fs.statSync(file).size;
      if (size === 0) {
        response.writeHead(503, { "Retry-After": "2" });
        response.end();
        return;
      }
      const headers = {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-cache",
      };
      let start = 0,
        end = size - 1,
        status = 200;
      if (request.headers.range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
        if (!match || (!match[1] && !match[2])) {
          response.writeHead(416, { "Content-Range": `bytes */${size}` });
          response.end();
          return;
        }
        start = match[1]
          ? Number(match[1])
          : Math.max(0, size - Number(match[2]));
        end =
          match[1] && match[2]
            ? Math.min(Number(match[2]), size - 1)
            : size - 1;
        if (start >= size || start > end) {
          response.writeHead(416, { "Content-Range": `bytes */${size}` });
          response.end();
          return;
        }
        headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
        status = 206;
      }
      headers["Content-Length"] = end - start + 1;
      response.writeHead(status, headers);
      if (request.method === "HEAD") response.end();
      else {
        const stream = fs.createReadStream(file, { start, end });
        stream.on("error", () => response.destroy());
        stream.pipe(response);
      }
    } catch {
      if (response.headersSent) response.destroy();
      else {
        response.writeHead(400);
        response.end();
      }
    }
  })
  .listen(port, host, () =>
    console.log(`Portfolio preview: http://${host}:${port}`),
  );
