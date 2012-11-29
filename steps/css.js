module.exports = function () {
    this.World = require('../support/world.js').World;

    selectors = {
        "Main title": "h1"
    };

    var camelize = function (str) {
        return str.replace(/[\s\-](\w)/g, function(str, letter){
            return letter.toUpperCase();
        });
    };

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


    
    this.Then(/^the "([^"]*)" should have "([^"]*)" of "([^"]*)"$/, measureStyle);
};

