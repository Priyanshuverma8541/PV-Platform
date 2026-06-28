import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from './config/index.js';

dotenv.config();

const app = express();
const PORT = config.PORT;

app.use(express.json());
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  '/api/auth',
  createProxyMiddleware({
    target: config.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/api/auth' },
  })
);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.listen(PORT, () => {
  console.log(`API gateway listening on http://localhost:${PORT}`);
});
