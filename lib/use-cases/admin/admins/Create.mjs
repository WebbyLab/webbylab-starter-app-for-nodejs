import {
    Exception as X
} from '../../../../packages.mjs';

import Base          from '../../Base.mjs';
import { dumpAdmin } from '../../utils/dumps.mjs';
import Admin         from '../../../domain-model/Admin.mjs';
import DMX           from '../../../domain-model/X.mjs';

export default class AdminsCreate extends Base {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            email    : [ 'required', 'string', { 'max_length': 255 }, 'to_lc' ],
            password : [ 'required', 'string', { 'min_length': 6 }, { 'max_length': 255 } ]
        } } ]
    };

    async execute({ data }) {
        try {
            const admin = await Admin.create(data);

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
