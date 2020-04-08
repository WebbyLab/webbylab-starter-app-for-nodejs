import jwt    from 'jsonwebtoken';
import {
    Exception as X
} from '../../../packages.mjs';

import config from '../../config.cjs';
import Action from '../../domain-model/StoredTriggerableAction.mjs';
import DMX    from '../../domain-model/X.mjs';
import {
    dumpUser,
    dumpAdmin
} from '../../utils/dumps.mjs';
import Base   from '../Base.mjs';

export default class ActionsSubmit extends Base {
    async validate(data) {
        try {
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
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_ID',
                    fields : { [x.field]: 'WRONG_ID' }
                });
                /* c8 ignore next */
            }
            /* c8 ignore next 2 */
            throw x;
        }
    }

    async execute(data) {
        const action = await Action.findById(data.id);
        const { type } = action;

        const result = await action.run(data);

        await action.destroy();

        if (type === 'RESET_USER_PASSWORD') {
            return { data: dumpUser(result) };
        } else if (type === 'RESET_ADMIN_PASSWORD') {
            return { data: dumpAdmin(result) };
        } else if (type === 'ACTIVATE_USER') {
            return { jwt: jwt.sign(dumpUser(result), config.secret) };
            /* c8 ignore next 2 */
        }

        /* c8 ignore next 2 */
        return {};
    }
}

