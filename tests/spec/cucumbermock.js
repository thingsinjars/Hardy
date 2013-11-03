'use strict';

// Not a complete mock of cucumber but good enough for our needs
var Cucumber = function() {

  var mock = {
    givens: [],
    whens: [],
    thens: []
  };
  mock.Given = jasmine.createSpy('Given').andCallFake(function(matcher, callback) {
    mock.givens[matcher] = callback;
  });
  mock.When = jasmine.createSpy('When').andCallFake(function(matcher, callback) {
    mock.whens[matcher] = callback;
  });
  mock.Then = jasmine.createSpy('Then').andCallFake(function(matcher, callback) {
    mock.thens[matcher] = callback;
  });

  return mock;
};

module.exports = Cucumber;