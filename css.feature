Feature: Navigation
    As a Web Designer
    I would like to test my CSS

    Scenario: CSS
        Given I go to "/empty.html"
         Then the "Main title" should have "font size" of "150px"
          And the "Main title" should have "color" of "#FF6600"
          And run
