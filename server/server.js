import { createApp } from './src/app.js';
import sequelize, { connectDatabase } from './src/config/db.js';
import { syncModels } from './src/models/index.js';
import env from './src/config/env.js';
import logger from './src/utils/logger.js';

/**
 * Application entry point: connect DB, sync models, then start the server
 * with graceful shutdown and last-resort process error handlers.
 */
async function start() {
  try {
    await connectDatabase();
    await syncModels();

    const app = createApp();
    const server = app.listen(env.port, () => {
      logger.info(`DevDNA API running on http://localhost:${env.port} (${env.nodeEnv})`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received, shutting down gracefully…`);
      server.close(async () => {
        await sequelize.close();
        process.exit(0);
      });
      // Force-exit if connections don't drain in time.
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  process.exit(1);
});

start();
