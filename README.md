Hardy
===

GhostStory 2: The Ghostening
---

Hardy (formerly GhostStory) is a collection of CSS testing steps and a boilerplate testing setup to get you up-and-running with automated CSS testing as quickly as possible. Tests are written in Cucumber and use Selenium. Hardy runs on Node.js and therefore all the example CSS test helpers are written in JS. The functionality behind them can easily be reused in any test setup, whether your tests are written in Java, Ruby or anything else.

This is a refactor of the original GhostStory project to run against Selenium using WebDriverJS. The original collection of CSS testing steps were written specifically for CasperJS and PhantomJS but now that PhantomJS supports the WebDriver protocol, we're now going via Selenium so that tests can be run against any browser.

The structure of this project and the webdriverjs bindings are from [WebDriverJS](https://github.com/camme/webdriverjs).

![image](extra/assets/small-logo.png)

Dependencies
---

### Selenium

Makes the whole thing go.

### PhantomJS

Aside from being extremely handy as a potential test browser, GhostStory relies on PhantomJS for its image processing. If you aren't planning on doing any image diff tests, you can skip it.

---

## CSS test steps available:

### `Then "element" should have "CSS property" of "value"`

Measures the current value of the property and asserts against the expected value

### `Then "element" should have "CSS property" of [more|greater|less] than "value"`

Measures the current value of the property and compares against the expected value

### `Then "element" should look the same as before`

Renders an image of the element for image diff testing. The first time this step is used, it will fail and generate a base reference image.

## CSS test steps to be made:

### `Then "element" should have "CSS property" of "value" or "value" [or "value"]*`

## General steps available:

### `Given the window size is "width" by "height"`

### `Given I visit "(https?:\/\/.*\..*)"`

### `When I enter "text" into "selector"`

### `When I submit the form "selector"`

### `Then I should see "text" in the element "selector"`

There are obviously many more generic steps missed but they should be straightforward to add.

## Custom Steps

Add these in a module in the `features/step_definitions` folder.


Using
===

Start selenium

    java -jar bin/selenium-server-standalone-2.32.0.jar

This should work with any recent version of Selenium. I've only tested with 2.32 so far.

Specify test properties in the file `features/support/testproperties.js` or explicitly on the command-line.

    ./node_modules/cucumber/bin/cucumber.js --browser=phantomjs
    ./node_modules/cucumber/bin/cucumber.js --browser=chrome
    ./node_modules/cucumber/bin/cucumber.js --browser='internet explorer'

Note: If you want to test in chrome, you'll also need the ChromeDriver package. Consult the Selenium wiki for more.

Uses the selectors/selectors.js files to map human descriptions of elements to CSS selectors

## File structure



  * features/*.feature - the story files you want to run.
  * support/teardown.js - closes the browser after each scenario
  * support/testproperties.json - Configuration stuffs
  * support/world.js - This is the bootstrapper for WebDriverJS, be careful!
  * step_definitions/generic.js - Good place to keep testwide step definitions, such as "I click <id>"
  * step_definitions/*.js - Other step definitions, ideally you should have a 1-1 relationship between feature file and specific definitions as the complimentary .js file