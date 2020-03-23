import ServiceBase from '../../ServiceBase.js';
import User        from '../../../models/User.js';

export default class UsersDelete extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const user = await User.findById(id);

        await user.destroy();

        return { };
    }
}
