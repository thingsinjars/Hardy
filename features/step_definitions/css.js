module.exports = function() {
    console.log('CSS Steps Loaded');
    this.World = require('../support/world.js');
    var imageTest = require('../support/imagetest');
    var utils = require('../support/css-utils');
    var assert = require('assert');
    var selectors = require('../support/selectors.js');

    /* "<Then> the <element> should have <property> of <value>" */
    // Map the given name to the selector then find that element in the page
    // The measured value of the property should be the one we expect
    this.Then(/^"([^"]*)" should have "([^"]*)" of "([^"]*)"$/, function(elementName, property, value, callback) {

        var elementSelector = selectors(elementName);

        var message = elementName + ' should have ' + property + ' of ' + value;

        if(utils.isColor(value)) {
            value = utils.toRgba(value);
        }

        this.getCssProperty(elementSelector, property, function(err, measuredValue) {
            if (err) {
                console.log("Fail, ", err);
                callback.fail(err);
            }

            assert.equal(measuredValue, value, message);
            callback();

        });

    });

    // "<Given> the window size is <width> by <height>"
    // Set the browser window size to the specified one
    this.Given(/^the window size is "([^"]*)" by "([^"]*)"$/, function(width, height, callback) {
        width = parseInt(width, 10);
        height = parseInt(height, 10);
        this.setWindowSize(width, height, callback);
    });

    //    "<Then> the <element> should have <property> of <comparator> than <value>"
    // Map the given name to the selector then find that element in the page
    // The measured value of the property should be more than or less than the one provided
    this.Then(/^"([^"]*)" should have "([^"]*)" of ([^"]*) than "([^"]*)"$/, function(elementName, property, comparator, value, callback) {
        var elementSelector = selectors(elementName);


        var message = elementName + ' should have ' + property + ' of ' + comparator + ' than ' + value;

        value = parseInt(value, 10);

        // Special case for width and height which, if unset, default to auto
        // A few other things do as well but these are the most common.
        if(property === 'width' || property === 'height') {
            this.getSize(elementSelector, function(err, measuredValue) {
                if (err) {
                    callback.fail(err);
                }

                message += ' (' + measuredValue[property] + ')';

                if(comparator === 'less') {
                    assert(measuredValue[property] < value, message);
                } else {
                    assert(measuredValue[property] > value, message);
                }

                callback();

            });

        } else {
            this.getCssProperty(elementSelector, property, function(err, measuredValue) {
                if (err) {
                    callback.fail(err);
                }

                message += ' (' + measuredValue + ')';

                if(comparator === 'less') {
                    assert(measuredValue < value, message);
                } else {
                    assert(measuredValue > value, message);
                }

                callback();

            });


        }

    });

    /* Image Diff test */
    this.Then(/^the "([^"]*)" should look the same as before$/, function(elementName, callback) {
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

    });



};