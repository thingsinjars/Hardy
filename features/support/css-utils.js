module.exports = (function() {
    // This holds a few handy utilities for things like converting colors.
    //
    // When measured via computedStyles, most browsers return rgba
    // so we'll need to convert everything to rgba to measure it
    // without forcing all story files to be written with rgba in mind.
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