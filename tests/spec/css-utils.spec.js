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

  describe('colour detection', function() {
    it('identifies a hex colour', function() {
      expect(CSSUtils.isColor('#ABCDEF')).toBe(true);
    });
    it('identifies an RGB colour', function() {
      expect(CSSUtils.isColor('rgb(255,0,12)')).toBe(true);
    });
    it('identifies an RGBa colour', function() {
      expect(CSSUtils.isColor('rgba(123,23,12)')).toBe(true);
    });
    it('identifies an HSL colour', function() {
      expect(CSSUtils.isColor('hsl(10, 50%, 45%)')).toBe(true);
    });
    it('identifies an HSLa colour', function() {
      expect(CSSUtils.isColor('hsla(10, 10%, 1%, 0.1)')).toBe(true);
    });
  });

  describe('converts colours to RGBa', function() {
    it('converts a hex colour', function() {
      expect(CSSUtils.toRgba('#ABCDEF')).toEqual('rgba(171,205,239,1)');
    });
    it('converts an RGB colour', function() {
      expect(CSSUtils.toRgba('rgb(12,23,34)')).toEqual('rgba(12,23,34,1)');
    });
    it('converts an RGBa colour', function() {
      expect(CSSUtils.toRgba('rgba(12,23,34,1)')).toEqual('rgba(12,23,34,1)');
    });
    it('converts an HSL colour', function() {
      expect(CSSUtils.toRgba('hsl(12,23%,34%)')).toEqual('rgba(106,74,66,1)');
    });
    it('converts an HSLa colour', function() {
      expect(CSSUtils.toRgba('hsla(12,23%,34%, 1)')).toEqual('rgba(106,74,66,1)');
    });
  });
});