// global defaults - this file SHOULD be committed to source control

const config = {
	env: `development`
};

const production = {
	dataSource: "http://echogy.net:8090",

};

const development = {
	dataSource: "http://localhost:8090",
};


Object.assign(config,
	config.env === 'production' ? production : development
);






module.exports = config;