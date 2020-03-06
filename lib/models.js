import sequelize  from './sequelize.js';
import initModels from './models/initModels.js';

const models = initModels(sequelize);

export const Action    = models.Action;
export const User      = models.User;
