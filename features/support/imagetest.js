// Mostly ported from PhantomCSS
// For a better implementation, use that:
// https://github.com/Huddle/PhantomCSS
//
// Reworked here to work with any Selenium-powered browser

var fs = require('fs');
var _root = '.';
var _count = 0;
var webdriver;
var platform = require('os').platform();
var logger = require("./logger")();
var _cropImage, _compareImages, _createImageDiff;

exports.screenshot = screenshot;
exports.compare = compare;
exports.init = init;

function init(options) {
    webdriver = options.webdriver || {};
    _root = options.screenshotRoot || _root;
    _fileNameGetter = options.fileNameGetter || _fileNameGetter;
    _cropImage = options.cropImage;
    _compareImages = options.compareImages;
    _createImageDiff = options.createImageDiff;
}

function _fileNameGetter(_root, selector, webdriver) {
    // Possibly use selector here for filename
    selector = selector.replace(/[\#\.\s:>]/g,'');

    var name = _root + "/" + platform + "_" + webdriver.desiredCapabilities.browserName + '_' + selector + '_' + _count++;

    if (fs.existsSync(name + '.png')) {
        return name + '.diff.png';
    } else {
        return name + '.png';
    }
}

// If we're grabbing the whole page, just use webdriver default
function screenshot(selector, callback) {
    var filename = _fileNameGetter(_root, selector, webdriver);
    if(typeof selector === "function") {
        // No selector passed, capture the whole page
        // selector is actually the callback
        return webdriver.saveScreenshot(filename, selector);
    }

    // Need to do some extra work
    captureSelector(filename, selector, callback);
}

function captureSelector(filename, selector, callback) {
    // First, grab the whole page
    webdriver.screenshot(function(err, result) {
        if(err) {
            return callback("Error capturing screenshot: " + err.orgStatusMessage, result);
        }

        // Second, find out where the element is
        webdriver.getLocation(selector, function(err, where) {
            if(err) {
                return callback("Error getting location for selector: \"" + selector + "\" : " + err.orgStatusMessage, result);
            }
            // Third, find out how big the element is
            webdriver.getSize(selector, function(err, size) {
                if(err) {
                    return callback("Error getting size for selector: \"" + selector + "\" : " + err.orgStatusMessage, result);
                }

                // Fourth, save the fullsize image
                var buffer = new Buffer(result.value, 'base64'),
                    tempFile = _root + '/tmp/'+process.pid+'.png';

                fs.writeFile(tempFile, buffer, 'base64', function(err) {

                    if(err) {
                        return callback("Error saving screenshot to temp file: " + tempFile, tempFile);
                    }

                    _cropImage(tempFile, filename, { x:where.x, y:where.y, width:size.width, height:size.height }, function(res) {
                        if (res instanceof Error) {
                            callback(res);
                        }
                        else {
                            callback(null, {status: /\.diff\./.test(filename)?'success':'firstrun', value: filename});
                        }
                    });
                });
            });
        });
    });
}

// Create two image objects using the reference file and 
// current test render then use imagediff to compare them
function compare(filename, callback) {
    var baseFile = filename.replace('.diff', '');

    if (!fs.existsSync(baseFile)) {
        return callback(new Error(baseFile + " does not exist"));
    } else {
        _compareImages(baseFile, filename, function(res) {
            if (res === true) { // visually equal
                callback();
            } else {  // not visually equal
                if (_createImageDiff) {  // create a visual difference file and then fail
                    generateImageDiff(baseFile, filename, callback);
                } else {
                    invokeMismatchFailure(callback, baseFile);

                }
            }
        });
    }
}

// Create a visual difference file for the two files.
function generateImageDiff(baseFile, newFile, callback) {

    var visDiffFile = newFile.replace(".diff", ".visdiff");  // Eventually, we should come up with better names

    _createImageDiff(baseFile, newFile, visDiffFile, function(err)  {
        if (err) {
            callback.fail("Error creating visual diff file: " + err);
        }
        else
        {
            logger.warning("\tImages do not match. Generated visual difference file: " +  visDiffFile);
            invokeMismatchFailure(callback, baseFile);
        }
    });
}

function invokeMismatchFailure(callback, baseFile) {
    callback.fail(new Error("Generated image does not match baseline: " + baseFile) );
}

module.exports = exports;