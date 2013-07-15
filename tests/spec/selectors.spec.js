/* Selectors map Tests
 */

var SelectorMapping, basedir;

basedir = '../../';

var mockery = require('mockery');

describe('Selectors map: ', function() {

	var pathMock, processMock, selectorMap;

	console.log = jasmine.createSpy('Console log');

	beforeEach(function() {
		pathMock = {
			resolve: function() {return 'MOCKPATH'}
		};
		process.env['TESTPATH'] = '';
		selectorMap = {
			"test name": "mocked > selector",
			"other name": ".another .mocked .selector"
		};
		mockery.registerMock('path', pathMock);
		mockery.registerMock('MOCKPATH/selectors.js', selectorMap);
		mockery.registerAllowable(basedir + 'features/support/selectors.js');
		mockery.enable({useCleanCache: true });
	});

	afterEach(function() {
		mockery.disable();
		mockery.deregisterAll();
	});

	describe('mapping names to selectors', function() {

		it('returns the selector associated with the name', function() {
			SelectorMapping = require(basedir + 'features/support/selectors.js');
			expect(SelectorMapping('test name', 'TESTPATH')).toEqual('mocked > selector');
		});

		it('returns the original name if it is not in the map', function() {
			SelectorMapping = require(basedir + 'features/support/selectors.js');
			expect(SelectorMapping('unmapped name', 'TESTPATH')).toEqual('unmapped name');
		});
	});

});