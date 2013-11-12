
/* Test the image utility fallbacks */

var mockery = require('mockery'),
cucumberMock = require('./cucumbermock'),
beforeTest = require('./beforetests'),
moduleUnderTest = '../../features/step_definitions/generic.js',
cucumber;

var CSSSteps;

var mocks = {
  '../support/selectors.js': function() {
    return 'mock > selector';
  }
};


describe('Generic WebDriverJS Steps: ', function() {

  beforeTest(mockery, mocks, moduleUnderTest);

  beforeEach(function() {
    cucumber = cucumberMock();

    callbackMock = function() {};
    callbackMock.fail = jasmine.createSpy('Callback fail');
    callbackMock.fail.reset();

    // Load our module for testing
    CSSSteps = require(moduleUnderTest);

    // Run the steps using cucumber
    CSSSteps.apply(cucumber);
  });


  it('should resize the browser window', function() {
    cucumber.setWindowSize = jasmine.createSpy('Brower resize');

    cucumber.givens['/^the window size is "([^"]*)" by "([^"]*)"$/'].call(cucumber, '100.1', '100.2', callbackMock);
    expect(cucumber.setWindowSize).toHaveBeenCalledWith(100, 100, jasmine.any(Function));
    expect(callbackMock.fail).not.toHaveBeenCalled();
  });

});
