module.exports = function() {
    console.log('CSS Steps Loaded');
    this.World = require('../support/world.js');
    var imageTest = require('../support/imagetest'),
        utils = require('../support/css-utils'),
        assert = require('assert'),
        selectors = require('../support/selectors.js'),
        config = require('../support/config.js');
    var shouldHavePropertyOfValue, shouldHavePropertyOfValueOrValue,
        shouldHaveOffsetPropertyOfValue, shouldHavePropertyOfComparatorThanValue,
        shouldLookTheSameAsBefore;

    /* "<Then> the <element> should have <property> of <value>" */
    // Map the given name to the selector then find that element in the page
    // The measured value of the property should be the one we expect
    shouldHavePropertyOfValue = function(elementName, property, value, callback) {
        var elementSelector = selectors(elementName);
        var message = '"' + elementName + '" should have ' + property + ' of ' + value;

        // Ensure we're comparing the same units
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

            // The browser may report fonts with quotes which don't make it through
            // from the test file (because of the RegEx). Get rid of quotes on both sides
            if (/font-/.test(property)) {
                measuredValue = measuredValue.replace(/"/g, "'");
                value = value.replace(/"/g, "'");
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

    /* "<Then> the <element> should have <property> of <value>( or <value>)" */
    // Map the given name to the selector then find that element in the page
    // The measured value of the property should be within the list provided
    shouldHavePropertyOfValueOrValue = function() {
        var elementName = arguments[0],
            property = arguments[1],
            callback = arguments[arguments.length - 1],
            values = Array.prototype.slice.call(arguments, 2, arguments.length - 1),
            i, l, callCount;


        callCount = values.length;

        function orCallback(err, result) {
            if (err) {
                return callback.fail(err);
            }
            callCount--;
            if (callCount === 0) {
                callback(null, result);
            }
        }
        orCallback.fail = callback.fail;
        for (i = 0, l = values.length; i < l; i++) {
            shouldHavePropertyOfValue(elementName, property, value, orCallback);
        }
    };
    this.Then(/^"([^"]*)" should have "([^"]*)" of "([^"]*)"( or "([^"]*)")+$/, shouldHavePropertyOfValueOrValue);

    /* "<Then> <element> should have offset <top|left> of <value>" */
    // Calculates the exact offset of the element regardless of the specified styles
    shouldHaveOffsetPropertyOfValue = function(elementName, property, value, callback) {
        var elementSelector = selectors(elementName),
            message = '"' + elementName + '" should have offset ' + property + ' of ' + value,
            index = property === 'top' ? 'y' : 'x';

        value = value.replace(/px/, '');

        this.getLocation(elementSelector, function(err, measuredValue) {
            if (err) {
                if (typeof err === "object") {
                    err = JSON.stringify(err);
                }
                console.error("Hardy :: Failed to execute script, ", err);
                return callback.fail(err);
            }

            message += ", measured: " + measuredValue[index];

            try {
                assert.equal(measuredValue[index], value, message);
            } catch (e) {
                return callback.fail(e.message);
            }

            callback();
        });
    };
    this.Then(/^"([^"]*)" should have offset "([^"]*)" of "([^"]*)"$/, shouldHaveOffsetPropertyOfValue);

    //    "<Then> the <element> should have <property> of <comparator> than <value>"
    // Map the given name to the selector then find that element in the page
    // The measured value of the property should be more than or less than the one provided
    shouldHavePropertyOfComparatorThanValue = function(elementName, property, comparator, value, callback) {
        var elementSelector = selectors(elementName);


        var message = elementName + ' should have ' + property + ' of ' + comparator + ' than ' + value;

        value = parseFloat(value, 10);

        // Special case for width and height which, if unset, default to auto
        // A few other things do as well but these are the most common.
        if (property === 'width' || property === 'height') {
            this.getSize(elementSelector, function(err, measuredValue) {
                if (err) {
                    callback.fail(err);
                }
                measuredValue = measuredValue[property];
                // compare(value, measuredValue, message, callback);
                measuredValue = parseFloat(measuredValue, 10);
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
                measuredValue = parseFloat(measuredValue, 10);
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
            screenshotRoot: process.env.TESTPATH + '/screenshots',
            processRoot: process.env.BINARYPATH,
            webdriver: this,
            fileNameGetter: config('fileNameGetter') || false
        });
        imageTest.screenshot(elementSelector, function(err, result) {
            if (err) {
                return callback.fail(err);
            }
            if (result.status === 'firstrun') {
                console.log("\n -- Notice: --");
                console.log(" First time this test with selector named:'" + elementName + "' has been run and new test cases have been created");
                return callback();
            } else {
                imageTest.compare(result.value, callback);
            }
        });
    };
    this.Then(/^"([^"]*)" should look the same as before$/, shouldLookTheSameAsBefore);
};
