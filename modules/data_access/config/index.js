const env = process.env.NODE_ENV || 'development';
const cfg = require('./private_config.' + env);

module.exports = cfg;
