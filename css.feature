Feature: Navigation
    As a Web Designer
    I would like to test my CSS

    Scenario: Frozen DOM test
        Given I go to "/index.html"
         Then the "Main title" should have "font size" of "32px"
          And the "Main title" should have "color" of "rgb(0, 0, 0)"
          And run

    Scenario: Image Diff Test
        Given I go to "/1.html"
         Then the "Page body" should look the same
          And run
