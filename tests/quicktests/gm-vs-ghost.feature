Feature: Quick test

Scenario: Quickly testing new features

Given I visit "http://localhost:8000/fixtures/static.html"
Then "ul" should look the same as before

Given I visit "http://localhost:8000/fixtures/static.html"
Then "ul li" should look the same as before

Given I visit "http://localhost:8000/fixtures/static.html"
Then "ul" should look the same as before
And "ul li" should look the same as before

Given I visit "http://localhost:8000/fixtures/static.html"
Then "ul li" should look the same as before
And "ul" should look the same as before

Given I visit "http://localhost:8000/fixtures/static.html"
Then "ul" should look the same as before
And "ul li" should look the same as before
And "ul" should look the same as before

Given I visit "http://localhost:8000/fixtures/static.html"
Then "ul li" should look the same as before
And "ul" should look the same as before
And "ul li" should look the same as before
