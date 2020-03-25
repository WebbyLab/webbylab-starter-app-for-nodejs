import {
    Exception as X
} from '../../../packages.mjs';

import Base from '../Base.mjs';
import User        from '../../domain-model/User.mjs';

export default class UsersDelete extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const { userId } = this.context;

        if (id !== userId) {
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
