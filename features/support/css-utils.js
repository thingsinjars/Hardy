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

    function hexToRgba(hex, opacity) {
        hex = hex.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);

        result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }

    function hslaToRgba(color) {
        var hue = 0,
            saturation = 0,
            lightness = 0,
            alpha = 1;
        var tmp = 0,
            sign = 1,
            frac = 0;
        for (var i = 0, j = 0, k = 0; i < color.length; i++) {
            var ch = color.charCodeAt(i);
            if (ch >= 48 && ch <= 57) { // '0'..'9'
                k = 1;
                if (frac > 0) {
                    tmp += frac * (ch - 48);
                    frac *= 0.1;
                } else {
                    tmp = tmp * 10 + (ch - 48);
                }
                continue;
            } else if (ch == 46) { // '.'
                frac = 0.1;
                continue;
            } else if (k === 0 && ch == 45) { // '-'
                sign = -1;
                continue;
            } else if (k === 1) {
                tmp *= sign;
                sign = 1;
                frac = 0;
                switch (j) {
                    case 0:
                        hue = (tmp % 360) / 360;
                        break;
                    case 1:
                        saturation = (tmp > 100 ? 100 : tmp) / 100;
                        break;
                    case 2:
                        lightness = (tmp > 100 ? 100 : tmp) / 100;
                        break;
                    case 3:
                        alpha = tmp;
                        break;
                }
                j++;
            }
            k = 0;
            tmp = 0;
            sign = 1;
        }
        var h = (hue / (1 / 6));
        var c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        var x = c * (1 - Math.abs((h % 2) - 1));
        switch (h | 0) {
            case 0:
                r = c;
                g = x;
                b = 0;
                break;
            case 1:
                r = x;
                g = c;
                b = 0;
                break;
            case 2:
                r = 0;
                g = c;
                b = x;
                break;
            case 3:
                r = 0;
                g = x;
                b = c;
                break;
            case 4:
                r = x;
                g = 0;
                b = c;
                break;
            case 5:
                r = c;
                g = 0;
                b = x;
                break;
        }
        var m = lightness - 0.5 * c;
        r += m;
        g += m;
        b += m;
        r = r * 255 | 0;
        g = g * 255 | 0;
        b = b * 255 | 0;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    function isRgb(color) {
        return (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).test(color);
    }

    function isRgba(color) {
        return (/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/).test(color);
    }

    function isHsla(color) {
        return (/^hsla?\((\d+(?:\.\d+)?)\%?,\s*(\d+(?:\.\d+)?)\%?,\s*(\d+(?:\.\d+)?)\%?(?:,\s*(\d+(?:\.\d+)?))?\)$/).test(color);
    }

    function isHex(color) {
        return (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i).test(color);
    }

    function isColor(color) {
        return isRgba(color) || isHsla(color) || isHex(color);
    }

    var toRgba = function(color) {
        if (isRgb(color)) {
            return color.replace(")",",1)").replace('rgb(', 'rgba(').replace(/\s/g,'');
        }
        if (isRgba(color)) {
            return color.replace(/\s/g,'');
        }
        if (isHsla(color)) {
            return hslaToRgba(color).replace(/\s/g,'');
        }
        if (isHex(color)) {
            return hexToRgba(color, 100).replace(/\s/g,'');
        }

    };

    var normalizeString = function(value) {
        return value.replace(/\s/g,'');
    };

    return {
        camelize: camelize,
        isColor: isColor,
        toRgba: toRgba,
        normalizeString: normalizeString
    };

}());
