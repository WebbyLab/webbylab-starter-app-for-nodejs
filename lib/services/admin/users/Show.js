import ServiceBase  from '../../ServiceBase.js';
import { dumpUser } from '../../../utils/dumps.js';
import User         from '../../../models/User.js';

export default class UsersShow extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const user = await User.findById(id);

        return { data: dumpUser(user) };
    }
}
