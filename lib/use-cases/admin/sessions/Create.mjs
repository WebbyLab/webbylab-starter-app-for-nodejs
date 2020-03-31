import jwt          from 'jsonwebtoken';
import {
    Exception as X
} from '../../../../packages.mjs';
import Base   from '../../Base.mjs';
import config from '../../../config.cjs';
import Admin  from '../../../domain-model/Admin.mjs';

export default class SessionsCreate extends Base {
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
                jwt : jwt.sign({ id: existingAdmin.id }, config.secret)
            }
        };
    }
}
