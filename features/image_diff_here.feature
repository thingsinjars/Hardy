Feature: Do a Search on HERE
  Using a web browser
  I want visual consistency

  @imagediff
  Scenario: HERE News Page
    Given I visit "https://here.com/news"
    Then the "main header" should look the same as before