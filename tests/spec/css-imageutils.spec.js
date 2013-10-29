/* CSS Steps Tests
 */

var CSSSteps, basedir;

basedir = '../../';

var mockery = require('mockery');

describe('CSS Imageutils Steps: ', function() {

	var worldMock, imageTestMock, utilsMock, imageUtilsMock, assertMock, selectorsMock, cucumberMock, cucumberThens, cucumberGivens, callbackMock;

	beforeEach(function() {

		worldMock = {}; // Might not need this
		eventsMock = {};
		colorsMock = {};
		colorlogMock = {};
		loggerMock = jasmine.createSpy('logger').andReturn(colorlogMock);
		configMock = jasmine.createSpy('config loader');

		imageTestMock = {
			init: jasmine.createSpy('initialising imageTest'),
			screenshot: jasmine.createSpy('taking screenshot')
		};
		gmImageUtilsMock = {
			isAvailable: jasmine.createSpy('is GraphicsMagick available').andCallFake(function(callback) {
				callback(false);
			}),
			cropImage: jasmine.createSpy('GM Utils cropImage')
		};
		ghostImageUtilsMock = {
			isAvailable: jasmine.createSpy('initialising imageTest'),
			cropImage: jasmine.createSpy('Ghost Utils cropImage')
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

		mockery.registerAllowable(basedir + 'features/step_definitions/css.js');

		mockery.registerMock('../support/world.js', worldMock);
		mockery.registerMock('../support/gm-image-utils', gmImageUtilsMock);
		mockery.registerMock('../support/ghost-image-utils', ghostImageUtilsMock);
		mockery.registerMock('../support/imagetest', imageTestMock);
		mockery.registerMock('../support/css-utils', utilsMock);
		mockery.registerMock('assert', assertMock);
		mockery.registerMock('../support/selectors.js', selectorsMock);

		mockery.registerMock('events', eventsMock);
		mockery.registerMock('./colors', colorsMock);
		mockery.registerMock('../support/config.js', configMock);
		mockery.registerMock('../support/logger', loggerMock);
		mockery.registerMock('colorlog', colorlogMock);


		mockery.enable();
	});

	afterEach(function() {
		mockery.disable();
		mockery.deregisterAll();
	});

	describe('imageutil loading when GraphicsMagick is available', function() {
		beforeEach(function() {
			gmImageUtilsMock.isAvailable = jasmine.createSpy('is GraphicsMagick available').andCallFake(function(callback) {
				callback(true);
			});

			CSSSteps = require(basedir + 'features/step_definitions/css.js');

			CSSSteps.apply(cucumberMock);
		});

		it('should check for graphicsmagick', function() {
			expect(gmImageUtilsMock.isAvailable).toHaveBeenCalledWith(jasmine.any(Function));
		});

		it('should use graphicsmagick', function() {
			cucumberThens['/^"([^"]*)" should look the same as before$/'].apply(cucumberMock);
			expect(imageTestMock.init).toHaveBeenCalledWith(jasmine.objectContaining({cropImage: gmImageUtilsMock.cropImage}));
		});
	});

	describe('imageutil loading when GraphicsMagick is not available', function() {
		beforeEach(function() {
			gmImageUtilsMock.isAvailable = jasmine.createSpy('is GraphicsMagick available').andCallFake(function(callback) {
				callback(false);
			});

			CSSSteps = require(basedir + 'features/step_definitions/css.js');

			CSSSteps.apply(cucumberMock);
		});
		it('should check for graphicsmagick', function() {
			expect(gmImageUtilsMock.isAvailable).toHaveBeenCalledWith(jasmine.any(Function));
		});

		it('should not use graphicsmagick', function() {
			cucumberThens['/^"([^"]*)" should look the same as before$/'].apply(cucumberMock);
			expect(imageTestMock.init).not.toHaveBeenCalledWith(jasmine.objectContaining({cropImage: gmImageUtilsMock.cropImage}));
		});

		it('should use ghostutils', function() {
			cucumberThens['/^"([^"]*)" should look the same as before$/'].apply(cucumberMock);
			expect(imageTestMock.init).toHaveBeenCalledWith(jasmine.objectContaining({cropImage: ghostImageUtilsMock.cropImage}));
		});
	});
});