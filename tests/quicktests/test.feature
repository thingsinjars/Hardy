Feature: Quick test

Scenario: Quickly testing new features

Given I visit "http://localhost:8000/fixtures/timeout.html"
Then "p" should have "color" of "rgba(0, 0, 0, 1)"

Given I visit "http://localhost:8000/fixtures/timeout.html"
And I wait for "3" seconds
Then "p" should have "color" of "rgba(255, 0, 0, 1)"

Given I visit "http://localhost:8000/fixtures/timeout.html"
And I wait for "div" to be present
Then "div" should have "background-color" of "rgba(0, 255, 0, 1)"

Given I visit "http://localhost:8000/fixtures/timeout.html"
Then "p" should look the same as before

Given I visit "http://localhost:8000/fixtures/timeout.html"
Then "p span" should look the same as before
