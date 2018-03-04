// global imports
require('./lib/global_helpers');


// module imports
const config = require('./config');


let app = {
	config: require('./config'),
	gdaxDatabaseBridge: new (require('./lib/GdaxDatabaseBridge'))(),

	run: function() {
		this.gdaxDatabaseBridge.connectAndSubscribe();
	}
};

app.run();

