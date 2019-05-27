import { User }      from '../sequelize';
import { dumpUtils } from './';


export async function normalizeInclude(dataset, includeMap, getOptions) {
    const linked = {};
    const includeKeys = Object.keys(includeMap);
    const usersIds = new Set(dataset.map(entity => entity.createdBy));

    await Promise.all(dataset.map(entity => Promise.all(includeKeys.map(async includeKey => {
        const options = getOptions(includeKey);

        const [ includeList, includeTotalCount ] = await includeMap[includeKey]({ id: entity.id, options });

        if (!entity.links) entity.links = {};   // eslint-disable-line
        if (!entity.links[includeKey]) {
            entity.links[includeKey] = {    // eslint-disable-line
                data : [],
                meta : {}
            };
        }

        if (!linked[includeKey]) linked[includeKey] = [];

        includeList.forEach(includeData => {
            const includeId = includeData.id;
            const createdBy = includeData.createdBy;

            if (!linked[includeKey].find(link => link.id === includeId)) {
                linked[includeKey].push(includeData);
            }

            if (createdBy) usersIds.add(createdBy);

            entity.links[includeKey].data.push({ id: includeId });
        });

        entity.links[includeKey].meta = {  // eslint-disable-line
            totalCount    : includeTotalCount,
            filteredCount : includeList.length,
            limit         : options.limit,
            offset        : options.offset
        };

        entity.links[includeKey].type = includeKey; // eslint-disable-line
    }))));

    const includeUsers = await User.findAll({ where: { id: { in: [ ...usersIds ] } } });
    const users = includeUsers.map(dumpUtils.dumpUser);

    if (users.length) linked.users = users;  // eslint-disable-line

    return [ dataset, linked ];
}
