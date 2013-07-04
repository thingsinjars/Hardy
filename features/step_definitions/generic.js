module.exports = function () {
    process.setMaxListeners(0);
    console.log('Generic Steps Loaded');
    this.World = require('../support/world.js');
    var selectors = require('../selectors/selectors.js');

    /* "<Given> I visit <url>" */
    this.Given(/^I visit "(https?:\/\/.*\..*)"$/, function (url, callback) {
        this.init().url(url, callback);
    });

    /* "<When> I enter <text> into <selector>" */
    this.When(/^I enter '(.*)' into '(.*)'$/, function (text, selector, callback) {
        selector = selectors[selector] || selector;
        this.waitFor(selector, 1000, function (err, result) {
            if(err) {
                return callback.fail(err);
            }
            return this.setValue(selector, text, callback);
        });
    });

    /* "<When> I submit the form <selector>" */
    this.When(/^I submit the form '(.*)'$/, function (selector, callback) {
        selector = selectors[selector] || selector;
        this.submitForm(selector, callback);
    });

    /* "<Then> I should see <text> in the element <selector>" */
    this.Then(/^I should see '(.*)' in the element '(.*)'$/, function (text, selector, callback) {
        selector = selectors[selector] || selector;

        this.waitFor(selector, 1000, function (result) {
            // if (result.status !== 0) return callback.fail(new Error('Element ' + inputId + ' was not found after 2s'));

            // this.getText(inputId, function(text) {
            //     text = ('' + text.value).match(/^We've found ([\d,]+) repository results$/);
            //     text = parseInt(text[1].replace(/,/g, ''), 10);

            //     // Fail this test if the search results are null
            //     if (text === 0 || isNaN(text)) return callback.fail(new Error('Expected to see some results, but saw 0 (captured result count is ' + number + ')'));

            //     // Pass and say about it.
            //     console.log('(Saw ' + text + ' results)');
            //     return callback();

            // });
        });
    });
};