/* Selectors map Tests
 */

var CSSUtils, basedir;

basedir = '../';

var mockery = require('mockery');

describe('Selectors map: ', function() {

	var fsMock, httpMock, child_processMock;

	console.log = jasmine.createSpy('Console log');

	beforeEach(function() {
		console.log.reset();
		mockery.registerAllowable(basedir + 'features/support/selectors.js');
	});

	describe('<Then> the <element> should have <property> of <value>', function() {

		it('fails if the element selector is invalid', function() {
			CSSUtils = require(basedir + 'features/support/selectors.js');
		});
	});

});