import jwt          from 'jsonwebtoken';
import ServiceBase  from '../ServiceBase.mjs';

import config       from '../../../etc/config.mjs';
import Action       from '../../models/Action.mjs';
import {
    dumpUser,
    dumpAdmin
} from '../../utils/dumps.mjs';

export default class ActionsSubmit extends ServiceBase {
    async validate(data) {
        const rulesRegistry = {
            'RESET_USER_PASSWORD' : {
                password        : 'required',
                confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ]
            },
            'RESET_ADMIN_PASSWORD' : {
                password        : 'required',
                confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ]
            },

            'ACTIVATE_USER' : {}
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

        if (type === 'RESET_USER_PASSWORD') {
            return { data: dumpUser(result) };
        } else if (type === 'RESET_ADMIN_PASSWORD') {
            return { data: dumpAdmin(result) };
        } else if (type === 'ACTIVATE_USER') {
            return { jwt: jwt.sign(dumpUser(result), config.secret) };
        }

        return {};
    }
}

