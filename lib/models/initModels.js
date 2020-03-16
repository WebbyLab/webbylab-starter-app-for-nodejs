import User      from './User.js';
import Action    from './Action.js';

export default function initAllModels(sequelize) {
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
