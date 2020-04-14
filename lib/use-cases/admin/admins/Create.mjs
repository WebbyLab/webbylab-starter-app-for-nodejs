import {
    Exception as X
} from '../../../../packages.mjs';

import Base          from '../../Base.mjs';
import { dumpAdmin } from '../../../utils/dumps.mjs';
import Admin         from '../../../domain-model/Admin.mjs';
import DMX           from '../../../domain-model/X.mjs';

const DEFAULT_PASSWORD = 'password';

export default class AdminsCreate extends Base {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            email : [ 'required', 'string', 'to_lc' ]
        } } ]
    };

    async execute({ data }) {
        try {
            const admin = await Admin.create({
                password : DEFAULT_PASSWORD,
                ...data
            });

            return { data: dumpAdmin(admin) };
        } catch (x) {
            if (x instanceof DMX.NotUnique) {
                throw new X({
                    code   : 'NOT_UNIQUE',
                    fields : { [x.field]: 'NOT_UNIQUE' }
                });
            }
            throw x;
        }
    }
}
