import { connectDatabase } from './config/database.js';
import app from './app.js';
import config from './config/index.js';

const PORT = config.PORT;

async function start(): Promise<void> {
  try {
    await connectDatabase(config.DATABASE_URL);

    app.listen(PORT, () => {
      console.log(`Media service listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start media service', error);
    process.exit(1);
  }
}

start();