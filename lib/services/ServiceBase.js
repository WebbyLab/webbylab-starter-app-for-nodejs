import {
    ServiceBase as ChistaServiceBase
} from '../../packages.js';

import sequelize from '../sequelize.js';

export default class ServiceBase extends ChistaServiceBase {
    run(...args) {
        const run = super.run.bind(this);
        const transaction = global.testTransaction || null;

        return sequelize.transaction({ transaction }, () => run(...args));
    }
}
