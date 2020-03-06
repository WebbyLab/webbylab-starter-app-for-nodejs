import {
    Exception as X
} from '../../../packages.js';
import ServiceBase  from '../ServiceBase.js';
import { dumpUser } from '../../utils/dumps.js';
import { User }     from '../../models.js';

export default class UsersShow extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const { userRole, userId } = this.context;

        if (id !== userId && userRole !== 'ADMIN') {
            throw new X({
                code   : 'BAD_TOKEN',
                fields : { token: 'WRONG_TOKEN' }
            });
        }
        const user = await User.findById(id);

        return { data: dumpUser(user) };
    }
}
