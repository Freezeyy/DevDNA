import { Sequelize } from 'sequelize';
import env from './env.js';
import logger from '../utils/logger.js';

/**
 * Single shared Sequelize instance used by all models.
 */
const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect,
  logging: env.nodeEnv === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

/**
 * Verify the DB connection is reachable. Called on startup.
 */
export async function connectDatabase() {
  await sequelize.authenticate();
  logger.info('Database connection established.');
}

export default sequelize;
