import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.js';
import config from './config/index.js';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.use(errorHandler);

export default app;
