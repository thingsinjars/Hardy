var logger = require("./logger")();
module.exports = function() {

	this.After(function(callback) {

		logger.info('Shutting down browser');

		this.end(callback);

	});

};