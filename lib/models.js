import config     from '../etc/db.js';
import initModels from './models/initModels.js';

/* istanbul ignore next */
const { database, username, password, dialect, host, port } = config[process.env.MODE || 'development'];

const models = initModels({
    database,
    username,
    password,
    dialect,
    host,
    port
});

export const Action    = models.Action;
export const User      = models.User;

export const sequelize = models.sequelize;
