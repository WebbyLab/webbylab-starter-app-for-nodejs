import Base from '../../Base.mjs';
import User        from '../../../models/User.mjs';

export default class UsersDelete extends Base {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const user = await User.findById(id);

        await user.destroy();

        return { };
    }
}
