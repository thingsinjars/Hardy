/* CSS Steps Tests
 */

var CSSSteps, basedir;

basedir = '../../';

var mockery = require('mockery');

describe('CSS Steps: ', function() {

	var fsMock, httpMock, child_processMock;

	console.log = jasmine.createSpy('Console log');

	beforeEach(function() {
		console.log.reset();
		mockery.registerAllowable(basedir + 'features/step_definitions/css.js');
	});

	describe('<Then> the <element> should have <property> of <value>', function() {

		it('fails if the element selector is invalid', function() {
			CSSSteps = require(basedir + 'features/step_definitions/css.js');
		});
	});

});