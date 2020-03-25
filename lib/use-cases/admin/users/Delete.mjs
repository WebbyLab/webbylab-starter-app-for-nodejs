import Base from '../../Base.mjs';
import User        from '../../../domain-model/User.mjs';

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
