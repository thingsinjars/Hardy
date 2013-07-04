module.exports = function() {
	console.log('Search on HERE Steps Loaded');
	this.World = require('../support/world');

	/* "<Then> I should see place search results" */
	this.Then(/^I should see place search results$/, function(callback) {
		var selector = '#pp1';
		this.waitFor(selector, 1000, function(err, result) {
			if(err) {
				callback.fail(err);
			}
			return callback();
		});

	});
};