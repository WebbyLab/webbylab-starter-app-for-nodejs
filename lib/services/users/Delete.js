import {
    Exception as X
} from '../../../packages.js';

import ServiceBase from '../ServiceBase.js';
import { User }    from '../../models.js';

export default class UsersDelete extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const { userRole, userId } = this.context;

        if (id !== userId && userRole !== 'ADMIN') {
            throw new X({
                code   : 'WRONG_TOKEN',
                fields : { token: 'WRONG_TOKEN' }
            });
        }
        const user = await User.findById(id);

        await user.destroy();

        return { };
    }
}
