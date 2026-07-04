import { connectDatabase } from './config/database';
import app from './app';
import config from './config/index';

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