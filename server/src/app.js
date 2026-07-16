import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import env from './config/env.js';
import routes from './routes/index.js';
import { analyzeLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');

/**
 * Builds and configures the Express application (without starting it),
 * which keeps it importable for tests.
 */
export function createApp() {
  const app = express();

  // Behind a reverse proxy (Nginx, Render, etc.) so rate-limit + protocol
  // detection use the forwarded client IP.
  app.set('trust proxy', 1);

  // Security headers. CORP is relaxed so the SPA on another origin can
  // consume the API responses during development.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

  // API surface.
  app.use('/api', analyzeLimiter, routes);
  app.use('/api', notFoundHandler);

  // In production, serve the built client and let the SPA handle routing.
  if (env.nodeEnv === 'production' && fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  } else {
    app.use(notFoundHandler);
  }

  app.use(errorHandler);

  return app;
}

export default createApp;
