/* CSS Steps Tests
 */

var mockery = require('mockery'),
  cucumberMock = require('./cucumbermock'),
  beforeTest = require('./beforetests'),
  moduleUnderTest = '../../features/step_definitions/css.js',
  cucumber;

var CSSSteps;

var mocks = {
  '../support/css-utils': {
    isColor: jasmine.createSpy('initialising imageTest').andReturn(true),
    toRgba: jasmine.createSpy('convert to RGBa').andCallFake(function(a) {
      return a;
    }),
    normalizeString: jasmine.createSpy('normalizing CSS values').andCallFake(function(a) {
      return a;
    })
  },
  '../support/imagetest': {
    init: jasmine.createSpy('initialising imageTest'),
    screenshot: jasmine.createSpy('taking screenshot')
  },
  '../support/gm-image-utils': {
    isAvailable: jasmine.createSpy('is GraphicsMagick available').andCallFake(function(callback) {
      callback(false);
    }),
    cropImage: jasmine.createSpy('GM Utils cropImage')
  },
  '../support/selectors.js': function() {
    return 'mock > selector';
  },
  'assert': {
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
  }
};

describe('CSS Steps: ', function() {

  var cucumber, webDriver, callbackMock;


  // Load our external mocks and register spies
  beforeTest(mockery, mocks, moduleUnderTest);

  beforeEach(function() {

    // Load our Cucumber mock
    cucumber = cucumberMock();

    // In the context of the tests, the `this` object is a compound
    // cucumber/webdriver object
    webDriver = cucumber;

    // Add webdriver spies to the object
    webDriver.setWindowSize = jasmine.createSpy('setting window size');
    webDriver.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
      callback(null, 10);
    });

    // Declare internal mocks here (as opposed to external ones above)
    callbackMock = function() {};
    callbackMock.fail = jasmine.createSpy('Callback fail');
    callbackMock.fail.reset();

    // Load our module for testing
    CSSSteps = require(moduleUnderTest);

    // Run the steps using cucumber
    CSSSteps.apply(cucumber);

  });

  describe('cucumber test loading', function() {

    it('should register all Given and Then matchers', function() {
      expect(cucumber.Then).toHaveBeenCalledWith(/^"([^"]*)" should have "([^"]*)" of "([^"]*)"$/, jasmine.any(Function));
      expect(cucumber.Then).toHaveBeenCalledWith(/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/, jasmine.any(Function));
      expect(cucumber.Then).toHaveBeenCalledWith(/^"([^"]*)" should look the same as before$/, jasmine.any(Function));
    });
  });

  describe('Test step', function() {

    describe('"<selector> should have <property> of <value>"', function() {

      it('should match exact colours', function() {
        cucumber.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
          callback(null, 'rgb(10, 10, 10)');
        });

        cucumber.thens['/^"([^"]*)" should have "([^"]*)" of "([^"]*)"$/'].call(cucumber, 'mockElementName', 'mockProperty', 'rgb(10, 10, 10)', callbackMock);
        expect(cucumber.getCssProperty).toHaveBeenCalledWith('mock > selector', 'mockProperty', jasmine.any(Function));
        expect(mocks['assert'].equal).toHaveBeenCalled();
        expect(callbackMock.fail).not.toHaveBeenCalled();
      });

      it('should not match different colours', function() {
        cucumber.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
          callback(null, 'rgb(10, 10, 100)');
        });

        cucumber.thens['/^"([^"]*)" should have "([^"]*)" of "([^"]*)"$/'].call(cucumber, 'mockElementName', 'mockProperty', 'rgb(10, 10, 10)', callbackMock);
        expect(cucumber.getCssProperty).toHaveBeenCalledWith('mock > selector', 'mockProperty', jasmine.any(Function));
        expect(mocks['assert'].equal).toHaveBeenCalled();
        expect(callbackMock.fail).toHaveBeenCalled();
      });

    });

    describe('"<selector> should have <property> of <comparator> than <value>"', function() {

      it('should pass when the comparison is true', function() {
        cucumber.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
          callback(null, 8);
        });


        cucumber.thens['/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/'].call(cucumber, 'mockElementName', 'mockProperty', 'less', '9', callbackMock);
        expect(cucumber.getCssProperty).toHaveBeenCalled();
        expect(mocks['assert'].ok).toHaveBeenCalled();
        expect(callbackMock.fail).not.toHaveBeenCalled();
      });

      it('should cope with floating point values', function() {
        cucumber.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
          callback(null, 26.6667);
        });


        cucumber.thens['/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/'].call(cucumber, 'mockElementName', 'mockProperty', 'greater', '26', callbackMock);
        expect(cucumber.getCssProperty).toHaveBeenCalled();
        expect(mocks['assert'].ok).toHaveBeenCalled();
        expect(callbackMock.fail).not.toHaveBeenCalled();
      });

      it('should fail when the comparison is false', function() {
        cucumber.getCssProperty = jasmine.createSpy('measure CSS property from browser instance').andCallFake(function(elementSelector, property, callback) {
          callback(null, 8);
        });

        cucumber.thens['/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/'].call(cucumber, 'mockElementName', 'mockProperty', 'greater', '9', callbackMock);
        expect(cucumber.getCssProperty).toHaveBeenCalled();
        expect(mocks['assert'].ok).toHaveBeenCalled();
        expect(callbackMock.fail).toHaveBeenCalled();
      });

    });
  });
});