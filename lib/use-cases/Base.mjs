import {
    UseCaseBase as ChistaUseCaseBase
} from '../../packages.mjs';

import './registerValidationRules.mjs';

export default class UseCaseBase extends ChistaUseCaseBase {
    constructor(...params) {
        super(...params);

        this.notificator = UseCaseBase.notificatorInstanse;
    }

    static sequelizeInstanse = null;

    static notificatorInstanse = {
        notify : () => {
            if (process.env.MODE === 'test') return;
            throw new Error('notificatorInstanse is not set');
        }
    };

    static setSequelizeInstanse(sequelize) {
        UseCaseBase.sequelizeInstanse = sequelize;
    }

    static setNotificatorInstanse(notificator) {
        UseCaseBase.notificatorInstanse = notificator;
    }

    run(...args) {
        if (!UseCaseBase.sequelizeInstanse) /* c8 ignore next */ return super.run(...args);

        const run = super.run.bind(this);
        const transaction = global.testTransaction /* c8 ignore next */ || null;

        return UseCaseBase.sequelizeInstanse.transaction({ transaction }, () => run(...args));
    }
}
