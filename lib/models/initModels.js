import cls       from 'cls-hooked';
import Sequelize from 'sequelize';
import User      from './User';
import Action    from './Action';

Sequelize.useCLS(cls.createNamespace('sequelize-transactions-namespace'));

export default function initAllModels(config) {
    const { database, username, password, dialect, host, port } = config;

    const sequelize = new Sequelize(database, username, password, {
        host,
        port,
        dialect,
        logging : false
    });

    const models = {
        User,
        Action
    };

    Object.values(models).forEach(model => model.init(sequelize));
    Object.values(models).forEach(model => model.initRelationsAndHooks(sequelize));

    return {
        ...models,
        sequelize
    };
}
