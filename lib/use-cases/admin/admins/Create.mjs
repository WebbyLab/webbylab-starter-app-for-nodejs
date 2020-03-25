import {
    Exception as X
} from '../../../../packages.mjs';

import Base   from '../../Base.mjs';
import { dumpAdmin } from '../../../utils/dumps.mjs';
import Admin         from '../../../domain-model/Admin.mjs';

const DEFAULT_PASSWORD = 'password';

export default class UsersCreate extends Base {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            email : [ 'required', 'string', 'to_lc' ]
        } } ]
    };

    async execute({ data }) {
        const isAdminExist = await Admin.findOne({ where: { email: data.email } });

        if (isAdminExist) {
            throw new X({
                code   : 'NOT_UNIQUE',
                fields : { email: 'NOT_UNIQUE' }
            });
        }
        const admin = await Admin.create({
            password : DEFAULT_PASSWORD,
            ...data
        });

        return { data: dumpAdmin(admin) };
    }
}
