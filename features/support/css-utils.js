module.exports = (function() {
    // This holds a few handy value comparison utilities.
    // console.log('CSS Utils Steps Loaded');
    // this.World = require('../support/world.js');

    var exports = {};


    // Returns the JS property version of the supplied CSS property

    function camelize(str) {
        return str.replace(/[\s\-](\w)/g, function(str, letter) {
            return letter.toUpperCase();
        });
    }

    var normalizeString = function(value) {
        return value.replace(/\s/g, '');
    };

    return {
        camelize: camelize,
        normalizeString: normalizeString
    };

}());
