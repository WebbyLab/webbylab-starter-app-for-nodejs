import {
    Exception as X
} from '../../../../packages.mjs';

import { dumpUser, dumpAdmin } from '../../utils/dumps.mjs';
import { generateToken }       from '../../utils/jwtUtils.mjs';

import DMX    from '../../../domain-model/X.mjs';
import Base   from '../../Base.mjs';
import Action, {
    TYPES as ActionTypes
}             from '../../../domain-model/StoredTriggerableAction.mjs';

const rulesRegistry = {
    [ActionTypes.ACTIVATE_USER]       : {},
    [ActionTypes.RESET_USER_PASSWORD] : {
        password        : 'required',
        confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ]
    },
    [ActionTypes.RESET_ADMIN_PASSWORD] : {
        password        : 'required',
        confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ]
    }
};

const resultFormatters = {
    [ActionTypes.ACTIVATE_USER]        : (result) => ({ jwt: generateToken({ id: result.id }) }),
    [ActionTypes.RESET_USER_PASSWORD]  : (result) => ({ data: dumpUser(result) }),
    [ActionTypes.RESET_ADMIN_PASSWORD] : (result) => ({ data: dumpAdmin(result) })
};

export default class ActionsSubmit extends Base {
    async validate(data = {}) {
        try {
            // TODO: validate incoming data
            const action = await Action.findById(data.id);

            return this.doValidation(data, {
                data : [ 'required', { 'nested_object': rulesRegistry[action.type] } ],
                id   : [ 'required', 'uuid' ]
            });
        } catch (x) {
            if (x instanceof DMX.WrongId) {
                throw new X({
                    code   : 'WRONG_ID',
                    fields : { [x.field]: 'WRONG_ID' }
                });
            }

            throw x;
        }
    }

    async execute({ data, id }) {
        try {
            const action = await Action.findById(id);
            const { type } = action;

            const result = await action.runAndDelete(data);

            return resultFormatters[type](result);
        } catch (x) {
            throw new X({
                code   : 'ACTION_FAILED',
                fields : {
                    id : 'ACTION_FAILED'
                }
            });
        }
    }
}

