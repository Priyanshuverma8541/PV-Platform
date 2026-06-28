import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from './config/index.js';

dotenv.config();

const app = express();
const PORT = config.PORT;

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

// NOTE: Do NOT add express.json() before the proxy — it consumes the body
// and the proxy can no longer forward it. Parse JSON only on non-proxied routes.

app.use(
  '/api/auth',
  createProxyMiddleware({
    target: config.AUTH_SERVICE_URL,
    changeOrigin: true,
    // No pathRewrite needed: gateway receives /api/auth/register
    // and auth-service also handles /api/auth/register
  })
);

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.listen(PORT, () => {
  console.log(`API gateway listening on http://localhost:${PORT}`);
});