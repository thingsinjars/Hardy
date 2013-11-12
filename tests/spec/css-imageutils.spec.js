/* Test the image utility fallbacks */

var mockery = require('mockery'),
  cucumberMock = require('./cucumbermock'),
  beforeTest = require('./beforetests'),
  moduleUnderTest = '../../features/step_definitions/css.js',
  cucumber;

var CSSSteps;

var mocks = {
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
  '../support/ghost-image-utils': {
    isAvailable: jasmine.createSpy('initialising imageTest'),
    cropImage: jasmine.createSpy('Ghost Utils cropImage')
  },
  '../support/selectors.js': function() {
    return 'mock > selector';
  }
};

describe('CSS Imageutils Steps: ', function() {

  beforeTest(mockery, mocks, moduleUnderTest);

  beforeEach(function() {
    cucumber = cucumberMock();
  });

  describe('imageutil loading when GraphicsMagick is available', function() {
    beforeEach(function() {
      mocks['../support/gm-image-utils'].isAvailable = jasmine.createSpy('is GraphicsMagick available').andCallFake(function(callback) {
        callback(true);
      });

      CSSSteps = require(moduleUnderTest);

      CSSSteps.apply(cucumber);
    });

    it('should check for graphicsmagick', function() {
      expect(mocks['../support/gm-image-utils'].isAvailable).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should use graphicsmagick', function() {
      cucumber.thens['/^"([^"]*)" should look the same as before$/'].apply(cucumber);
      expect(mocks['../support/imagetest'].init).toHaveBeenCalledWith(jasmine.objectContaining({
        cropImage: mocks['../support/gm-image-utils'].cropImage
      }));
    });
  });

  describe('imageutil loading when GraphicsMagick is not available', function() {
    beforeEach(function() {
      mocks['../support/gm-image-utils'].isAvailable = jasmine.createSpy('is GraphicsMagick available').andCallFake(function(callback) {
        callback(false);
      });

      CSSSteps = require(moduleUnderTest);

      CSSSteps.apply(cucumber);
    });
    it('should check for graphicsmagick', function() {
      expect(mocks['../support/gm-image-utils'].isAvailable).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should not use graphicsmagick', function() {
      cucumber.thens['/^"([^"]*)" should look the same as before$/'].apply(cucumber);
      expect(mocks['../support/imagetest'].init).not.toHaveBeenCalledWith(jasmine.objectContaining({
        cropImage: mocks['../support/gm-image-utils'].cropImage
      }));
    });

    it('should use ghostutils', function() {
      cucumber.thens['/^"([^"]*)" should look the same as before$/'].apply(cucumber);
      expect(mocks['../support/imagetest'].init).toHaveBeenCalledWith(jasmine.objectContaining({
        cropImage: mocks['../support/ghost-image-utils'].cropImage
      }));
    });
  });
});