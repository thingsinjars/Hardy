module.exports = function(configValue, configFile) {
	var path = require('path');
	configFile = configFile || process.env.CONFIGFILE;
	if (configFile) {
		return require(path.resolve(configFile))[configValue];
	}
	return null;
};