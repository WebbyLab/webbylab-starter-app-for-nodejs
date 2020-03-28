import Action     from '../../../../../lib/domain-model/Action.mjs';
import User       from '../../../../../lib/domain-model/User.mjs';

import dumpEntity from '../../../../utils/dumpEntity.mjs';

export default async function fetchSideEffects({ userId }) {
    const users = await User.findAll({ where: { id: userId } });
    const actions = await Action.findAll({ where: { data: { '"userId"': userId } } });

    return {
        users   : users.map(dumpEntity),
        actions : actions.map(dumpEntity)
    };
}
