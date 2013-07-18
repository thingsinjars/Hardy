module.exports = function() {
    console.log('CSS Steps Loaded');
    this.World = require('../support/world.js');
    var imageTest = require('../support/imagetest'),
        utils = require('../support/css-utils'),
        assert = require('assert'),
        selectors = require('../support/selectors.js');
    var shouldHavePropertyOfValue, windowSizeIs, shouldHavePropertyOfComparatorThanValue, shouldLookTheSameAsBefore;

    /* "<Then> the <element> should have <property> of <value>" */
    // Map the given name to the selector then find that element in the page
    // The measured value of the property should be the one we expect
    shouldHavePropertyOfValue = function(elementName, property, value, callback) {
        var elementSelector = selectors(elementName);
        var message = '"' + elementName + '" should have ' + property + ' of ' + value;
        if (utils.isColor(value)) {
            value = utils.toRgba(value);
        }
        this.getCssProperty(elementSelector, property, function(err, measuredValue) {
            if (err) {
                if (typeof err === "object") {
                    err = err.type + ': ' + err.orgStatusMessage + ': "' + elementSelector + '"';
                }
                // console.error("Hardy :: Failed to get CSS property, ", err);
                // console.error("Hardy :: Could not find element '%s'", elementSelector);
                return callback.fail(err);
            }

            message += ", measured: " + measuredValue;

            measuredValue = utils.normalizeString(measuredValue);

            try {
                assert.equal(measuredValue, value, message);
            } catch (e) {
                return callback.fail(e.message);
            }

            callback();
        });
    };
    this.Then(/^"([^"]*)" should have "([^"]*)" of "([^"]*)"$/, shouldHavePropertyOfValue);

    // "<Given> the window size is <width> by <height>"
    // Set the browser window size to the specified one
    windowSizeIs = function(width, height, callback) {
        width = parseInt(width, 10);
        height = parseInt(height, 10);
        this.setWindowSize(width, height, callback);
    };
    this.Given(/^the window size is "([^"]*)" by "([^"]*)"$/, windowSizeIs);

    //    "<Then> the <element> should have <property> of <comparator> than <value>"
    // Map the given name to the selector then find that element in the page
    // The measured value of the property should be more than or less than the one provided
    shouldHavePropertyOfComparatorThanValue = function(elementName, property, comparator, value, callback) {
        var elementSelector = selectors(elementName);


        var message = elementName + ' should have ' + property + ' of ' + comparator + ' than ' + value;

        value = parseInt(value, 10);

        // Special case for width and height which, if unset, default to auto
        // A few other things do as well but these are the most common.
        if (property === 'width' || property === 'height') {
            this.getSize(elementSelector, function(err, measuredValue) {
                if (err) {
                    callback.fail(err);
                }
                measuredValue = measuredValue[property];
                // compare(value, measuredValue, message, callback);
                measuredValue = parseInt(measuredValue, 10);
                message += ' (' + measuredValue + ')';
                if (comparator === 'less') {
                    try {
                        assert.ok(measuredValue < value, message);
                    } catch (e) {
                        return callback.fail(e.message);
                    }
                } else {
                    try {
                        assert.ok(measuredValue > value, message);
                    } catch (e) {
                        return callback.fail(e.message);
                    }
                }
                callback();
            });
        } else {
            this.getCssProperty(elementSelector, property, function(err, measuredValue) {
                if (err) {
                    callback.fail(err);
                }
                measuredValue = parseInt(measuredValue, 10);
                message += ' (' + measuredValue + ')';
                if (comparator === 'less') {
                    try {
                        assert.ok(measuredValue < value, message);
                    } catch (e) {
                        return callback.fail(e.message);
                    }
                } else {
                    try {
                        assert.ok(measuredValue > value, message);
                    } catch (e) {
                        return callback.fail(e.message);
                    }
                }

                callback();
            });
        }
    };
    this.Then(/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/, shouldHavePropertyOfComparatorThanValue);

    /* Image Diff test */
    shouldLookTheSameAsBefore = function(elementName, callback) {
        var elementSelector = selectors(elementName);
        imageTest.init({
            screenshotRoot: process.env['TESTPATH'] + '/screenshots',
            processRoot: process.env['BINARYPATH'],
            webdriver: this
        });
        imageTest.screenshot(elementSelector, function(err, result) {
            if (err) {
                callback.fail(err);
            }
            if (result.status === 'firstrun') {
                callback.fail(new Error("First time this test has been run. New test cases have been created."));
            }
            imageTest.compare(result.value, callback);
        });
    };
    this.Then(/^"([^"]*)" should look the same as before$/, shouldLookTheSameAsBefore);
};