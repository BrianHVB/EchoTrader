let env = process.env.NODE_ENV;
env = 'development';
const config = require('./private_config.' + env);

module.exports = config;
