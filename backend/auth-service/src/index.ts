import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import app from './server.js';
import config from './config/index.js';

dotenv.config();

const PORT = config.PORT;

async function start(): Promise<void> {
  await connectDatabase(config.DATABASE_URL);

  app.listen(PORT, () => {
    console.log(`Auth service listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start auth service', error);
  process.exit(1);
});
