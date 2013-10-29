module.exports = function(elementName, testpath) {
	var path = require('path');
	testpath = testpath || process.env.TESTPATH;

	if (testpath) {
		return require(path.resolve(testpath) + '/selectors.js')[elementName] || elementName;
	}
	return elementName;
};