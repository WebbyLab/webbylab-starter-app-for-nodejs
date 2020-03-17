import config     from '../etc/config.js';
import initModels from './models/initModels.js';

const dbMode = process.env.MODE === 'production' ? 'db' : 'test-db';

const models = initModels(config[dbMode]);

export const Action    = models.Action;
export const User      = models.User;
export const sequelize = models.sequelize;
export const Op        = sequelize.Op;
