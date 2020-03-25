import jwt          from 'jsonwebtoken';
import {
    Exception as X
} from '../../../../packages.mjs';

import ServiceBase   from '../../ServiceBase.mjs';
import { dumpAdmin } from '../../../utils/dumps.mjs';
import config        from '../../../config.mjs';
import Admin         from '../../../models/Admin.mjs';

export default class SessionsCreate extends ServiceBase {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            password : [ 'required', 'string' ],
            email    : [ 'required', 'string' ]
        } } ]
    };

    async execute({ data }) {
        const existingAdmin = await Admin.findOne({ where: { email: data.email } });

        if (!existingAdmin || !await existingAdmin.checkPassword(data.password)) {
            throw new X({
                code   : 'AUTHENTICATION_FAILED',
                fields : {
                    email    : 'INVALID',
                    password : 'INVALID'
                }
            });
        }

        return {
            data : {
                jwt : jwt.sign(dumpAdmin(existingAdmin), config.secret)
            }
        };
    }
}
