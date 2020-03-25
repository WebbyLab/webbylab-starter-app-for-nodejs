import Base  from '../Base.mjs';
import { Op }       from '../../../packages.mjs';
import { dumpUser } from '../../utils/dumps.mjs';
import User         from '../../models/User.mjs';

export default class UsersList extends Base {
    static validationRules = {
        search   : [ { 'min_length': 2 } ],
        limit    : [ 'positive_integer' ],
        offset   : [ 'integer', { 'min_number': 0 } ],
        sortedBy : [ { 'one_of': [ 'id', 'firstName', 'secondName', 'email', 'createdAt', 'updatedAt' ] } ],
        order    : [ { 'one_of': [ 'ASC', 'DESC' ] } ]
    };

    async execute({
        limit    = 20,
        offset   = 0,
        search   = '',
        sortedBy = 'createdAt',
        order    = 'DESC'
    }) {
        const userFields = [ 'firstName', 'secondName', 'email' ];
        const findQuery = search
            ? { [Op.or]: userFields.map(field => ({ [field]: { [Op.like]: `%${ search }%` } })) }
            : {};

        this.dbRequest = {
            where : findQuery,
            order : [ [ sortedBy, order ] ],
            limit,
            offset
        };

        const [ users, filteredCount, totalCount ] = await Promise.all([
            User.findAll(this.dbRequest),
            User.count({ where: findQuery }),
            User.count()
        ]);

        const data = users.map(dumpUser);

        return {
            data,
            meta : {
                totalCount,
                filteredCount,
                limit,
                offset
            }
        };
    }
}
