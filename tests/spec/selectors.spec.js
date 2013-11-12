/* Selectors map Tests
 */

var SelectorMapping,
  beforeTest = require('./beforetests'),
  moduleUnderTest = '../../features/support/selectors.js',
  mockery = require('mockery');

var mocks = {
  'path': {
    resolve: function() {
      return 'MOCKPATH';
    }
  },
  'MOCKPATH/selectors.js': {
    "test name": "mocked > selector",
    "other name": ".another .mocked .selector"
  }
};

describe('Selectors map: ', function() {

  console.log = jasmine.createSpy('Console log');

  beforeTest(mockery, mocks, moduleUnderTest);

  beforeEach(function() {
    process.env.TESTPATH = '';
  });

  describe('mapping names to selectors', function() {

    it('returns the selector associated with the name', function() {
      SelectorMapping = require(moduleUnderTest);
      expect(SelectorMapping('test name', 'TESTPATH')).toEqual('mocked > selector');
    });

    it('returns the original name if it is not in the map', function() {
      SelectorMapping = require(moduleUnderTest);
      expect(SelectorMapping('unmapped name', 'TESTPATH')).toEqual('unmapped name');
    });
  });

});
