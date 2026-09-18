import http from 'node:http';
import { parse } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import next from 'next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
// In AI Studio sandbox, Nginx proxies port 8080 to port 3000 (detected by CONTROL_PLANE_PORT).
// In standalone Cloud Run production deployments, the app must bind directly to process.env.PORT (typically 8080).
const port = process.env.CONTROL_PLANE_PORT
  ? parseInt(process.env.DEFAULT_APP_PORT || '3000', 10)
  : parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer(async (req, res) => {
        try {
          const parsedUrl = parse(req.url!, true);
          await handle(req, res, parsedUrl);
        } catch (err) {
          console.error('Error handling request:', req.url, err);
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      })
      .once('error', (err) => {
        console.error('Server error:', err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`> Next.js Server ready on http://${hostname}:${port}`);
      });
  })
  .catch((err) => {
    console.error('Failed to prepare Next.js app:', err);
    process.exit(1);
  });
