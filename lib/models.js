import config     from '../etc/db.json';
import initModels from './models/initModels';

/* istanbul ignore next */
const { database, username, password, dialect, host, port } = config[process.env.MODE || 'development'];

export default initModels({
    database,
    username,
    password,
    dialect,
    host,
    port
});
