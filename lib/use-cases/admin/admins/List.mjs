import Base   from '../../Base.mjs';
import { Op }        from '../../../../packages.mjs';
import { dumpAdmin } from '../../utils/dumps.mjs';
import Admin         from '../../../domain-model/Admin.mjs';

const DEFAULT_LIMIT  = 20;
const DEFAULT_OFFSET = 0;

export default class AdminsList extends Base {
    static validationRules = {
        search   : [ { 'min_length': 2 } ],
        limit    : [ 'positive_integer' ],
        offset   : [ 'integer', { 'min_number': 0 } ],
        sortedBy : [ { 'one_of': [ 'id', 'email', 'createdAt', 'updatedAt' ] } ],
        order    : [ { 'one_of': [ 'ASC', 'DESC' ] } ]
    };

    async execute({
        limit    = DEFAULT_LIMIT,
        offset   = DEFAULT_OFFSET,
        search   = '',
        sortedBy = 'createdAt',
        order    = 'DESC'
    }) {
        const userFields = [ 'email' ];
        const findQuery = search
            ? { [Op.or]: userFields.map(field => ({ [field]: { [Op.like]: `%${ search }%` } })) }
            : {};

        const dbRequest = {
            where : findQuery,
            order : [ [ sortedBy, order ] ],
            limit,
            offset
        };

        const [ users, filteredCount, totalCount ] = await Promise.all([
            Admin.findAll(dbRequest),
            Admin.count({ where: findQuery }),
            Admin.count()
        ]);

        const data = users.map(dumpAdmin);

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
