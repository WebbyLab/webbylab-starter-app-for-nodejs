import ServiceBase  from '../../ServiceBase.mjs';
import { dumpUser } from '../../../utils/dumps.mjs';
import User         from '../../../models/User.mjs';

export default class UsersShow extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const user = await User.findById(id);

        return { data: dumpUser(user) };
    }
}
