Feature: Do a Search on HERE
  Using a web browser
  I want to perform a place search on HERE

  Scenario: HERE Place Search
    Given I visit "https://here.com/"
    When I enter 'cheese' into 'main search field'
    And I submit the form 'main search form'
    Then I should see place search results

  Scenario: HERE search layout
    Given I visit "http://here.com"
    Then "main search field" should have "width" of "176px"

  Scenario: HERE help layout
    Given I visit "http://here.com/help"
    And the window size is "1020px" by "780px"
    Then "platforms menu" should have "height" of less than "32px"