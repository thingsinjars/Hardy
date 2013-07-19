Feature: Hardy acceptance test
As a developer, I want Hardy to be right when it tests things

  Scenario: Missing page
  Given I visit "http://hardy.io/test-x.html"
  Then "p" should have "font-size" of "28px"

  Scenario: Missing element
  Given I visit "http://hardy.io/test-x.html"
  Then "missing" should have "font-size" of "28px"

  Scenario: Valid element
  Given I visit "http://hardy.io/test-1.html"
  Then "p" should have "color" of "#ffffff"
  And "p > a" should have "color" of "#000000"

  Scenario: Selector map
  Given I visit "http://hardy.io/test-1.html"
  Then "floating div" should have "color" of "#ffffff"
  And "link" should have "color" of "#000000"

  Scenario: Comparison
  Given I visit "http://hardy.io/test-1.html"
  Then "p" should have "font-size" of less than "38px"

  Scenario: Failing comparison
  Given I visit "http://hardy.io/test-1.html"
  Then "p" should have "font-size" of greater than "38px"

  Scenario: Window resizing (big)
  Given I visit "http://hardy.io/test-1.html"
  And the window size is "1000px" by "1000px"
  Then "section" should have "height" of less than "300px"
  And "section" should have "height" of more than "100px"

  Scenario: Window resizing (big)
  Given I visit "http://hardy.io/test-1.html"
  And the window size is "500px" by "1000px"
  Then "section" should have "height" of less than "600px"
  And "section" should have "height" of more than "300px"