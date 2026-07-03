import { Server } from 'http';
import app from './index';

let server: Server | null = null;

export const startAuthService = async (): Promise<Server> => {
  if (!server) {
    server = app.listen(process.env.AUTH_SERVICE_PORT || 4000, () => {
      console.log('Auth service started');
    });
  }
  return server;
};

export const stopAuthService = async (): Promise<void> => {
  if (server) {
    await new Promise((resolve) => server!.close(resolve));
    server = null;
  }
};