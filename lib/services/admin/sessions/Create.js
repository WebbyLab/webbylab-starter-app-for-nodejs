import jwt          from 'jsonwebtoken';
import {
    Exception as X
} from '../../../../packages.js';

import ServiceBase   from '../../ServiceBase.js';
import { dumpAdmin } from '../../../utils/dumps.js';
import config        from '../../../../etc/config.js';
import Admin         from '../../../models/Admin.js';

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
