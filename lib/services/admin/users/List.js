import ServiceBase  from '../../ServiceBase.js';
import { Op }       from '../../../../packages.js';
import { dumpUser } from '../../../utils/dumps.js';
import User         from '../../../models/User.js';

export default class UsersList extends ServiceBase {
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
