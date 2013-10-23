module.exports = function () {
    process.setMaxListeners(0);
    console.log('Generic Steps Loaded');
    var selectors = require('../support/selectors.js');
    var windowSizeIs;

    /* "<Given> I visit <url>" */
    this.Given(/^I visit "([^"]*)"$/, function (url, callback) {
        try {
            this.init().url(url, callback);
        } catch(o_O) {
            callback.fail(o_O);
        }
    });

    /* "<Given> I wait for <N> seconds" */
    this.Given(/^I wait for "([^"]*)" seconds$/, function (seconds, callback) {
        this.pause(seconds*1000, callback);
    });

    /* "<Given> I wait for <selector> to be present" */ /* ! Maximum of 30 seconds ! */
    this.Given(/^I wait for "([^"]*)" to be present$/, function (selector, callback) {
        selector = selectors(selector);
        this.waitFor(selector, 5000, function (err, result) {
            if(err) {
                return callback.fail(JSON.stringify(err));
            }
            callback();
        });
    });

    // "<Given> the window size is <width> by <height>"
    // Set the browser window size to the specified one
    windowSizeIs = function(width, height, callback) {
        width = parseInt(width, 10);
        height = parseInt(height, 10);
        this.setWindowSize(width, height, callback);
    };
    this.Given(/^the window size is "([^"]*)" by "([^"]*)"$/, windowSizeIs);

    /* "<When> I enter <text> into <selector>" */
    this.When(/^I enter '(.*)' into '(.*)'$/, function (text, selector, callback) {
        selector = selectors(selector);
        this.waitFor(selector, 1000, function (err, result) {
            if(err) {
                return callback.fail(JSON.stringify(err));
            }
            return this.setValue(selector, text, callback);
        });
    });

    /* "<When> I submit the form <selector>" */
    this.When(/^I submit the form '(.*)'$/, function (selector, callback) {
        selector = selectors(selector);
        this.submitForm(selector, callback);
    });

};