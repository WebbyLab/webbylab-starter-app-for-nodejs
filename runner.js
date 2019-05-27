if (process.env.LAMBDA) process.env.BABEL_DISABLE_CACHE=1;

require('@babel/register');
module.exports = require('./app.js');