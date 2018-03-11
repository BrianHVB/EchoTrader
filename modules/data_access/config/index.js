const env = process.env.NODE_ENV;
const cfg = require('./private_config.' + env);

module.exports = cfg;
