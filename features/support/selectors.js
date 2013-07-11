module.exports = function(elementName) {
	var path = require('path');
	if(process.env['TESTPATH']) {
		return require(path.resolve(process.env['TESTPATH']) + '/selectors.js')[elementName] || elementName;
	}
	return elementName;
};