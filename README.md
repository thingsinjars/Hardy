[Hardy](http://hardy.io/)
===

(The Not-quite-ready-yet release)
---

_This is almost entirely working but not 100%. If you spot a problem, please [file an issue](https://github.com/thingsinjars/Hardy/issues)._

[Hardy](http://hardy.io/) is a collection of CSS testing steps and a boilerplate testing setup to get you up-and-running with automated CSS testing as quickly as possible. Tests are written in Cucumber and use Selenium. Hardy runs on Node.js and therefore all the example CSS test helpers are written in JS. The functionality behind them can easily be reused in any test setup, whether your tests are written in Java, Ruby or anything else.

This is a refactor of the original GhostStory project to run against Selenium using WebDriverJS. The original collection of CSS testing steps were written specifically for CasperJS and PhantomJS but now that PhantomJS supports the WebDriver protocol, we're now going via Selenium so that tests can be run against any browser.

The structure of this project and the WebDriverJS bindings are from [WebDriverJS](https://github.com/camme/webdriverjs).

![image](https://raw.github.com/thingsinjars/hardy.io/94b2744df96f17020ba17bfcf279ba52907a4abf/assets/small-logo.png)

Read more at [Hardy.io](http://hardy.io/).

Installation
---

The recommended way to install Hardy is via [npm](https://npmjs.org/):

    npm install -g hardy

This will install Hardy as a global node module and put an executable `hardy` in your path. It will also include a local version of [Selenium v2.32.0]((http://docs.seleniumhq.org/) in case you don't have that already and a local copy of [PhantomJS v1.9.0]((http://phantomjs.org/)) for image diff test processing.

_NOTE: Currently, the local install of PhantomJS will not be available for testing against unless you add it to your path._

For best results, you'll also need a Selenium–capable browser. Firefox supports the WebDriver protocol by default so without specifying otherwise, tests will be run against Firefox. [PhantomJS](http://phantomjs.org/) also supports WebDriver.

To run tests against Chrome, you will need to install [ChromeDriver](https://code.google.com/p/selenium/wiki/ChromeDriver).

To run tests against Internet Explorer, you will need [InternetExplorerDriver](https://code.google.com/p/selenium/wiki/InternetExplorerDriver).

To run Selenium at all, you'll need [Java](http://java.com/en/download/index.jsp).

Finally, for (significantly) faster visual image compares, install GraphicsMagick.  On OSX:

    brew install graphicsmagick

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
    
The tests are automatically run on every commit to the main repo. Currently building on Travis CI:

[![Build Status](https://travis-ci.org/thingsinjars/Hardy.png)](https://travis-ci.org/thingsinjars/Hardy)

Travis Integration
---

To include Hardy in a Travis CI pipeline, import it as a devDependency:

    npm install --save-dev hardy

Add the following to your .travis.yml:

    before_script:
      - export DISPLAY=:99.0
      - sh -e /etc/init.d/xvfb start
      - node_modules/hardy/bin/hardy selenium start
      - {BUILD YOUR STATIC SITE HERE}
      - python -m SimpleHTTPServer&
    
And finally, add this to your package.json `scripts` object:

    "scripts": {
      "test": "node_modules/hardy/bin/hardy --browser=firefox,phantom <PATH TO YOUR TEST FOLDER>"
    },

For more detail, read the [continuous integration guide on the Hardy site](http://hardy.io/continuous-integration.html).
