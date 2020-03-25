import {
    ServiceBase as ChistaServiceBase
} from '../../packages.mjs';
import '../registerValidationRules.mjs';

export default class UseCaseBase extends ChistaServiceBase {
    static sequelizeInstanse = null;

    static setSequelizeInstanse(sequelize) {
        UseCaseBase.sequelizeInstanse = sequelize;
    }

    run(...args) {
        const run = super.run.bind(this);
        const transaction = global.testTransaction || null;

        return UseCaseBase.sequelizeInstanse.transaction({ transaction }, () => run(...args));
    }
}
