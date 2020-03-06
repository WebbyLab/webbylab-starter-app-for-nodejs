/* eslint-disable import/no-commonjs */
const confme = require('confme');

const config = confme(`${__dirname}/db.json`);

// is needed for sequelize-cli migrations/seeds
module.exports = config;
