/* CSS Steps Tests
 */

var CSSUtils, basedir;

basedir = '../../';
// isColor, toRgba, camelize

CSSUtils = require(basedir + 'features/support/css-utils.js');

describe('CSS Utilities: ', function() {

  describe('Camelize', function() {

    it('correctly Camelizes a lower-case string', function() {
      expect(CSSUtils.camelize('this-is-a-lowercase-hyphenated-string')).toEqual("thisIsALowercaseHyphenatedString");
    });
    it('correctly Camelizes a camelized string', function() {
      expect(CSSUtils.camelize('thisIsACamelizedString')).toEqual("thisIsACamelizedString");
    });
  });
});
