/* CSS Steps Tests
 */

var CSSSteps, basedir;

basedir = '../../';

var mockery = require('mockery');

describe('CSS Steps: ', function() {

	var worldMock, imageTestMock, utilsMock, assertMock, selectorsMock, cucumberMock, cucumberThens, cucumberGivens, callbackMock;

	beforeEach(function() {

		worldMock = {}; // Might not need this
		imageTestMock = {
			init: jasmine.createSpy('initialising imageTest')
		};
		utilsMock = {
			isColor: jasmine.createSpy('initialising imageTest').andReturn(true),
			toRgba: jasmine.createSpy('convert to RGBa').andCallFake(function(a) {
				return a;
			}),
			normalizeString: jasmine.createSpy('normalizing CSS values').andCallFake(function(a) {
				return a;
			})
		};
		assertMock = {
			equal: jasmine.createSpy('assert equal').andCallFake(function(a, b, message) {
				if (a === b) {
					return true;
				} else {
					throw new Error('Assertion error');
				}
			}),
			ok: jasmine.createSpy('assert ok').andCallFake(function(a, message) {
				if (a) {
					return a;
				} else {
					throw new Error('Assertion error');
				}
			})
		};
		assertMock.equal.reset();
		assertMock.ok.reset();

		selectorsMock = function() {
			return 'mock > selector';
		};

		cucumberThens = [];
		cucumberGivens = [];
		cucumberMock = {
			'Then': jasmine.createSpy('Then').andCallFake(function(matcher, callback) {
				cucumberThens[matcher] = callback;
			}),
			'Given': jasmine.createSpy('Given').andCallFake(function(matcher, callback) {
				cucumberGivens[matcher] = callback;
			}),
			setWindowSize: jasmine.createSpy('setting window size'),
			getCssProperty: jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
				callback(null, 10);
			})
		};

		callbackMock = function() {};
		callbackMock.fail = jasmine.createSpy('Callback fail');
		callbackMock.fail.reset();

		mockery.registerAllowable(basedir + 'features/step_definitions/css.js');

		mockery.registerMock('../support/world.js', worldMock);
		mockery.registerMock('../support/imagetest', imageTestMock);
		mockery.registerMock('../support/css-utils', utilsMock);
		mockery.registerMock('assert', assertMock);
		mockery.registerMock('../support/selectors.js', selectorsMock);

		mockery.enable();
		CSSSteps = require(basedir + 'features/step_definitions/css.js');

		CSSSteps.apply(cucumberMock);

	});

	afterEach(function() {
		mockery.disable();
		mockery.deregisterAll();
	});

	describe('cucumber test loading', function() {

		it('should register all Given and Then matchers', function() {
			//expect(cucumberMock.Given).toHaveBeenCalledWith(/^the window size is "([^"]*)" by "([^"]*)"$/, jasmine.any(Function));
			expect(cucumberMock.Then).toHaveBeenCalledWith(/^"([^"]*)" should have "([^"]*)" of "([^"]*)"$/, jasmine.any(Function));
			expect(cucumberMock.Then).toHaveBeenCalledWith(/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/, jasmine.any(Function));
			expect(cucumberMock.Then).toHaveBeenCalledWith(/^"([^"]*)" should look the same as before$/, jasmine.any(Function));
		});
	});
	describe('Test step', function() {
		xit('"should set window size"', function() { // moved this step to generics. must create test file for them
			cucumberGivens['/^the window size is "([^"]*)" by "([^"]*)"$/'].apply(cucumberMock);
			expect(cucumberMock.setWindowSize).toHaveBeenCalled();
		});

		describe('"<selector> should have <property> of <value>"', function() {
			it('should match exact colours', function() {
				cucumberMock.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
					callback(null, 'rgb(10, 10, 10)');
				});

				cucumberThens['/^"([^"]*)" should have "([^"]*)" of "([^"]*)"$/'].call(cucumberMock, 'mockElementName', 'mockProperty', 'rgb(10, 10, 10)', callbackMock);
				expect(cucumberMock.getCssProperty).toHaveBeenCalledWith('mock > selector', 'mockProperty', jasmine.any(Function));
				expect(assertMock.equal).toHaveBeenCalled();
				expect(callbackMock.fail).not.toHaveBeenCalled();
			});
			it('should not match different colours', function() {
				cucumberMock.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
					callback(null, 'rgb(10, 10, 100)');
				});

				cucumberThens['/^"([^"]*)" should have "([^"]*)" of "([^"]*)"$/'].call(cucumberMock, 'mockElementName', 'mockProperty', 'rgb(10, 10, 10)', callbackMock);
				expect(cucumberMock.getCssProperty).toHaveBeenCalledWith('mock > selector', 'mockProperty', jasmine.any(Function));
				expect(assertMock.equal).toHaveBeenCalled();
				expect(callbackMock.fail).toHaveBeenCalled();
			});
		});

		describe('"<selector> should have <property> of <comparator> than <value>"', function() {
			it('should pass when the comparison is true', function() {
				cucumberMock.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
					callback(null, 8);
				});


				cucumberThens['/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/'].call(cucumberMock, 'mockElementName', 'mockProperty', 'less', '9', callbackMock);
				expect(cucumberMock.getCssProperty).toHaveBeenCalled();
				expect(assertMock.ok).toHaveBeenCalled();
				expect(callbackMock.fail).not.toHaveBeenCalled();
			});
			it('should cope with floating point values', function() {
				cucumberMock.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
					callback(null, 26.6667);
				});


				cucumberThens['/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/'].call(cucumberMock, 'mockElementName', 'mockProperty', 'greater', '26', callbackMock);
				expect(cucumberMock.getCssProperty).toHaveBeenCalled();
				expect(assertMock.ok).toHaveBeenCalled();
				expect(callbackMock.fail).not.toHaveBeenCalled();
			});
			it('should fail when the comparison is false', function() {
				cucumberMock.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
					callback(null, 8);
				});

				cucumberThens['/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/'].call(cucumberMock, 'mockElementName', 'mockProperty', 'greater', '9', callbackMock);
				expect(cucumberMock.getCssProperty).toHaveBeenCalled();
				expect(assertMock.ok).toHaveBeenCalled();
				expect(callbackMock.fail).toHaveBeenCalled();
			});
		});

	});

});
