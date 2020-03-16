import jwt             from 'jsonwebtoken';
import ServiceBase     from '../ServiceBase.js';

import config          from '../../../etc/config.js';
import { dumpUser }    from '../../utils/dumps.js';
import { Action }      from '../../models.js';

export default class ActionsSubmit extends ServiceBase {
    async validate(data) {
        const rulesRegistry = {
            'RESET_PASSWORD' : {
                password        : 'required',
                confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ]
            },

            'CONFIRM_EMAIL' : {}
        };

        const action = await Action.findById(data.id);

        return this.doValidation(data, {
            ...rulesRegistry[action.type],
            id : [ 'required', 'uuid' ]
        });
    }

    async execute(data) {
        const action = await Action.findById(data.id);
        const { type } = action;

        const result = await action.run(data);

        await action.destroy();

        /* istanbul ignore else */

        if (type === 'RESET_PASSWORD') {
            return { data: dumpUser(result) };
        } else if (type === 'CONFIRM_EMAIL') {
            return { jwt: jwt.sign(dumpUser(result), config.secret) };
        }

        return {};
    }
}

