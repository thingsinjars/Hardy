'use strict';

// Simplify running the tests by registering all mocks beforehand and cleaning up all spies afterwards

function preTest(mockery, mocks, moduleUnderTest, writingMode) {

  // This runs before every test. It re-registers the mocks.
  beforeEach(function() {
    mockery.registerAllowable(moduleUnderTest);

    for (var mock in mocks) {
      if (mocks.hasOwnProperty(mock)) {
        mockery.registerMock(mock, mocks[mock]);
      }
    }

    // Set this to true when writing new tests so that you
    // Know what dependencies are supposed to be mocked
    mockery.enable({
      warnOnUnregistered: !! writingMode
    });
  });

  afterEach(function() {

    // Loop over the supplied obect to reset its spies.
    // We have to do this because Jasmine doesn't have
    // a sandbox mode
    function unSpy(spyHolder) {
      for (var spy in spyHolder) {
        if (spyHolder.hasOwnProperty(spy)) {
          if (spyHolder[spy] instanceof Function) {
            if (spyHolder[spy].reset) {
              spyHolder[spy].reset();
            }
          } else if (spyHolder[spy] instanceof Object) {
            unSpy(spyHolder[spy]);
          }
        }
      }
    }
    unSpy(mocks);

    // Reset all mocks
    mockery.disable();
    mockery.deregisterAll();
  });
}

module.exports = preTest;
