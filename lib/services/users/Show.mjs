import {
    Exception as X
} from '../../../packages.mjs';
import ServiceBase  from '../ServiceBase.mjs';
import { dumpUser } from '../../utils/dumps.mjs';
import User         from '../../models/User.mjs';

export default class UsersShow extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'uuid' ]
    };

    async execute({ id }) {
        const { userId } = this.context;

        if (id !== userId) {
            throw new X({
                code   : 'BAD_TOKEN',
                fields : { token: 'WRONG_TOKEN' }
            });
        }
        const user = await User.findById(id);

        return { data: dumpUser(user) };
    }
}
