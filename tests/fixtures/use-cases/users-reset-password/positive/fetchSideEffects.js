import Action     from '../../../../../lib/domain-model/Action.mjs';

import dumpEntity from '../../../../utils/dumpEntity.mjs';

export default async function fetchSideEffects() {
    const actions = await Action.findAll({ where: { data: { '"email"': 'default2@gmail.com' } } });

    return {
        actions : actions.map(dumpEntity)
    };
}
