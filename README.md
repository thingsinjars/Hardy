GhostStory
===

A collection of cucumber steps for automated CSS testing with [SpookyJS](https://github.com/WaterfallEngineering/SpookyJS), [CasperJS](http://casperjs.org/), [PhantomJS](http://phantomjs.org/), [PhantomCSS](http://github.com/Huddle/PhantomCSS) and [Node.JS](http://nodejs.org/).

Steps
===

The steps implemented so far cover basic calculated styles and image diffs.

    Then the "Element descriptor" should have "property" of "value"
    Then the "Element descriptor" should look the same as before

Here, "Element descriptor" is the human-readable name of the element you are testing. These are mapped to CSS selectors in the 'selectors.json' file

Read more about CSS testing at http://csste.st/ or read the slides introducing GhostStory at http://csste.st/slides/

Installation
====

The easiest way to install and run this is to use [this modified version of SpookyJS](https://github.com/thingsinjars/SpookyJS). Feel free to carry on with the steps below instead, however.


  This includes a fork of [PhantomCSS](http://github.com/thingsinjars/PhantomCSS) as a submodule. To pull it in, check this project out using 

      git clone --recursive git://github.com/thingsinjars/GhostStory.git


  1. Download SpookyJS
     1. `git clone https://github.com/WaterfallEngineering/SpookyJS.git`

  2. Install SpookyJS dependencies
     1. `cd SpookyJS`
     2. `npm install`

  3. Copy the folders from GhostStory into `SpookyJS/Examples/cucumber/features/`

  4. Run the cucumber.js make step
     1. `make cucumber.js`
