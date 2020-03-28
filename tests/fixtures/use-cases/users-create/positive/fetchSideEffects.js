import Action from '../../../../../lib/domain-model/Action.mjs';
import User   from '../../../../../lib/domain-model/User.mjs';


function dumpEntity(entity) {
    return {
        ...entity.dataValues,
        createdAt : entity.dataValues.createdAt.toISOString(),
        updatedAt : entity.dataValues.createdAt.toISOString()
    };
}

export default async function fetchSideEffects({ userId }) {
    const user = await User.findById(userId);
    const actions = await Action.findAll({ where: { data: { '"userId"': userId } } });

    return {
        user   : dumpEntity(user),
        action : actions.map(dumpEntity)
    };
}
