import {
    ServiceBase as ChistaServiceBase
} from '../../packages.js';

export default class ServiceBase extends ChistaServiceBase {
    static sequelizeInstanse = null;

    static setSequelizeInstanse(sequelize) {
        ServiceBase.sequelizeInstanse = sequelize;
    }

    run(...args) {
        const run = super.run.bind(this);
        const transaction = global.testTransaction || null;

        return ServiceBase.sequelizeInstanse.transaction({ transaction }, () => run(...args));
    }
}
