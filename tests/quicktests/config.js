module.exports = {
	fileNameGetter: function(_root, selector) {
		var fs = require("fs");
		// Possibly use selector here for filename
		selector = selector.replace(/[\#\.\s:>]/g, '');

		var name = _root + "/CONFIGURED_" + selector;

		if (fs.existsSync(name + '.png')) {
			return name + '.diff.png';
		} else {
			return name + '.png';
		}
	}
};