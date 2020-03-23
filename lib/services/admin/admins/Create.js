import {
    Exception as X
} from '../../../../packages.js';

import ServiceBase   from '../../ServiceBase.js';
import { dumpAdmin } from '../../../utils/dumps.js';
import Admin         from '../../../models/Admin.js';

const DEFAULT_PASSWORD = 'password';

export default class UsersCreate extends ServiceBase {
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
