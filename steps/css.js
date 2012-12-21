module.exports = function () {
    this.World = require('../support/world.js').World;

    selectors = {
        "Main title": "h1",
        "Page body": "body"
    };

    var camelize = function (str) {
        return str.replace(/[\s\-](\w)/g, function(str, letter){
            return letter.toUpperCase();
        });
    };

    // Map the given name to the selector then find that element in the page
    // The measured value of the property should be the one we expect
    this.Then(/^the "([^"]*)" should have "([^"]*)" of "([^"]*)"$/, measureStyle);
    function measureStyle(elementName, property, value, callback) {
        var elementSelector = selectors[elementName];
        property = camelize(property);

        this.spooky.then([{
            elementName: elementName,
            elementSelector: elementSelector,
            property: property,
            value: value
        }, function () {
            var measuredValue = this.evaluate(function(elementSelector, property) {
                var element = document.querySelector(elementSelector),
                    computedStyles = document.defaultView.getComputedStyle(element),
                    measuredValue = computedStyles[property];
                    return measuredValue;
            }, {elementSelector: elementSelector,property: property});
            this.test.assertEquals(measuredValue, value, elementName + ' should have ' + property + ' of "' + value + '" (measured: ' + measuredValue + ')');

        }]);
        callback();
    }


    // This uses PhantomCSS to render images of the page which in turn uses
    // js-imagediff to calculate diffs
    this.Then(/^the "([^"]*)" should look the same$/, compareImages);
    function compareImages(elementName, callback) {
        var elementSelector = selectors[elementName];

        this.spooky.then([{
            elementSelector: elementSelector
        }, function () {
            var casper = this,
                testUrl = this.getCurrentUrl(),
                css = require('./examples/cucumber/features/support/phantomcss.js');

            css.init({
                casper: casper,
                screenshotRoot: './screenshots',
                libraryRoot: './examples/cucumber/features/support',
                testRunnerUrl: './examples/cucumber/features/support/testRunner.html'
            });
            css.screenshot('body');
            css.compareAll();
            this.test.assertEquals(css.getExitStatus(), 0, testUrl + " does not match the previous test run");
        }]);

        callback();
    }

    /* To save future confusion:
     * The format of these steps is:
     *
     * this.Then(/^regex matching the "parameters" "from" the cucumber "sentence"$/, functionName);
     *
     * function functionName(parameters, from, sentence, callbackFn) {
     *  var statement;
     *
     *  this.spooky.then([{
     *    passed: parameters,
     *    to: be,
     *    accessible: withinCasper
     *  }, function () {
     *    // this is run within Casper
     *    // In this context, 'this' refers to Casper
     *
     *  }]);
     *
     *  callback();
     * }
     *
     *
     *
     *
     *
     */

};