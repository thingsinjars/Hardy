Hardy
===

Hardy is a collection of CSS testing steps and a boilerplate testing setup to get you up-and-running with automated CSS testing as quickly as possible. Tests are written in Cucumber and use Selenium. Hardy runs on Node.js and therefore all the example CSS test helpers are written in JS. The functionality behind them can easily be reused in any test setup, whether your tests are written in Java, Ruby or anything else.

This is a refactor of the original GhostStory project to run against Selenium using WebDriverJS. The original collection of CSS testing steps were written specifically for CasperJS and PhantomJS but now that PhantomJS supports the WebDriver protocol, we're now going via Selenium so that tests can be run against any browser.

The structure of this project and the WebDriverJS bindings are from [WebDriverJS](https://github.com/camme/webdriverjs).

![image](https://raw.github.com/thingsinjars/hardy.io/master/assets/small-logo.png)

Installation
---

The recommended way to install Hardy is via [npm](https://npmjs.org/):

    npm install -g hardy

This will install Hardy as a global node module and put an executable `hardy` in your path. It will also include a local version of [Selenium v2.32.0]((http://docs.seleniumhq.org/) in case you don't have that already and a local copy of [PhantomJS v1.9.0]((http://phantomjs.org/)) for image diff test processing.

For best results, you'll also need a Selenium–capable browser. Firefox supports the WebDriver protocol by default so without specifying otherwise, tests will be run against Firefox. [PhantomJS](http://phantomjs.org/) also supports WebDriver.

To run tests against Chrome, you will need to install [ChromeDriver](https://code.google.com/p/selenium/wiki/ChromeDriver).

To run tests against Internet Explorer, you will need [InternetExplorerDriver](https://code.google.com/p/selenium/wiki/InternetExplorerDriver).

Getting started
---

For full details on how to get started with Hardy, check out the documentation at [hardy.io](http://hardy.io/)

Commands / usage
---

    hardy init
      initialises an empty test directory

    hardy selenium start
      starts the local selenium server (essential before tests)

    hardy selenium stop
      stops the local selenium server

    hardy .
      run all the tests in the current folder with the default browser (Firefox)

    hardy --browser=phantomjs .
      specify the browser to test with

    hardy --browser=phantomjs,chrome .
      specify multiple browsers to test with

Tests
---

To verify Hardy is working as it should, unit and acceptance tests are available. They can be run via [Grunt](http://gruntjs.com/) from the project root:

    grunt unit
    grunt acceptance

    # Or, to run both:
    grunt test