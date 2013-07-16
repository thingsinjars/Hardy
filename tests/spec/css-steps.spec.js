/* CSS Steps Tests
 */

var CSSSteps, basedir;

basedir = '../../';

var mockery = require('mockery');

describe('CSS Steps: ', function() {

	var worldMock, imageTestMock, utilsMock, assertMock, selectorsMock, cucumberMock;

	beforeEach(function() {

		worldMock = {}; // Might not need this
		imageTestMock = {
			init: jasmine.createSpy('initialising imageTest')
		};
		utilsMock = {
			isColor: jasmine.createSpy('initialising imageTest').andReturn(true)
		};
		assertMock = {
			equal: function(a, b, message) {
				return a === b;
			}
		};
		selectorsMock = function() {
			return 'mock > selector';
		};
		cucumberMock = {
			'Then': jasmine.createSpy('Then').andCallFake(function(matcher, callback) {
						// console.log('Matcher:: ' + matcher);
					}),
			'Given': jasmine.createSpy('Given').andCallFake(function(matcher, callback) {
						// console.log('Matcher:: ' + matcher);
					})
		};

		mockery.registerAllowable(basedir + 'features/step_definitions/css.js');
	});

	afterEach(function() {
		mockery.disable();
		mockery.deregisterAll();
	});

	describe('cucumber test loading', function() {

		it('should register all Given and Then matchers', function() {
			mockery.registerMock('../support/world.js', worldMock);
			mockery.registerMock('../support/imagetest', imageTestMock);
			mockery.registerMock('../support/css-utils', utilsMock);
			mockery.registerMock('assert', assertMock);
			mockery.registerMock('../support/selectors.js', selectorsMock);

			mockery.enable();
			CSSSteps = require(basedir + 'features/step_definitions/css.js');

			var cucumberInstance = CSSSteps.apply(cucumberMock);

			expect(cucumberMock.Given).toHaveBeenCalledWith(/^the window size is "([^"]*)" by "([^"]*)"$/, jasmine.any(Function));
			expect(cucumberMock.Then).toHaveBeenCalledWith(/^"([^"]*)" should have "([^"]*)" of "([^"]*)"$/, jasmine.any(Function));
			expect(cucumberMock.Then).toHaveBeenCalledWith(/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/, jasmine.any(Function));
			expect(cucumberMock.Then).toHaveBeenCalledWith(/^"([^"]*)" should look the same as before$/, jasmine.any(Function));

		});
	});

});