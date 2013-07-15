module.exports = function(elementName, testpath) {
	var path = require('path');
	testpath = testpath || testpath;

	if(testpath) {
		return require(path.resolve(testpath) + '/selectors.js')[elementName] || elementName;
	}
	return elementName;
};