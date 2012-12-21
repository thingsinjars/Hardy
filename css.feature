Feature: Navigation
    As a Web Designer
    I would like to test my CSS

    Scenario: Frozen DOM test
        Given I go to "/empty.html"
         Then the "Main title" should have "font size" of "150px"
          And the "Main title" should have "color" of "#FF6600"
          And run

    Scenario: Image Diff Test
        Given I go to "/empty.html"
         Then the "Page body" should look the same
          And run
