import {
    ServiceBase as ChistaServiceBase
} from '../../packages.mjs';

import logger from '../utils/logger.mjs';

import './registerValidationRules.mjs';

export default class UseCaseBase extends ChistaServiceBase {
    constructor(...args) {
        super(...args);

        this.logger = logger;
    }

    static sequelizeInstanse = null;

    static setSequelizeInstanse(sequelize) {
        UseCaseBase.sequelizeInstanse = sequelize;
    }

    run(...args) {
        if (!UseCaseBase.sequelizeInstanse) /* c8 ignore next */ return super.run(...args);

        const run = super.run.bind(this);
        const transaction = global.testTransaction /* c8 ignore next */ || null;

        return UseCaseBase.sequelizeInstanse.transaction({ transaction }, () => run(...args));
    }
}
