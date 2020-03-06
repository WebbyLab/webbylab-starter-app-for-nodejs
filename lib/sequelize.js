// import cls                 from 'cls-hooked';
/* eslint-disable import/no-unresolved */
import Sequelize           from 'sequelize';
import config              from '../etc/db.js';

// Sequelize.useCLS(cls.createNamespace('sequelize-transactions-namespace'));

const { database, username, password, dialect, host, port } = config[process.env.MODE || 'development'];

const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect,
    logging        : false,
    dialectOptions : {
        connectTimeout : 10000
    },
    pool : {
        min     : 0,
        max     : 10,
        idle    : 10000, // The maximum time, in milliseconds, that a connection can be idle before being released.
        acquire : 30000 // ..., that pool will try to get connection before throwing error
    },
    retry : { // Set of flags that control when a query is automatically retried.
        match : [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
            /TimeoutError/
        ],
        max : 4 // How many times a failing query is automatically retried.
    }
});

sequelize.Op = Sequelize.Op;

export const Op = sequelize.Op;
export default sequelize;
