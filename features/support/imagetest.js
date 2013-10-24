// Mostly ported from PhantomCSS
// For a better implementation, use that:
// https://github.com/Huddle/PhantomCSS
//
// Reworked here to work with any Selenium-powered browser

var fs = require('fs');
var _tolerance = 64;
var _root = '.';
var _count = 0;
var webdriver;
var exitStatus;
var platform = require('os').platform();
var _processRoot = process.cwd();

exports.screenshot = screenshot;
exports.compare = compare;
exports.init = init;

function init(options) {
    webdriver = options.webdriver || {};
    _root = options.screenshotRoot || _root;
    _processRoot = options.processRoot || _processRoot;
    _fileNameGetter = options.fileNameGetter || _fileNameGetter;
}

function _fileNameGetter(_root, selector) {
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
    var filename = _fileNameGetter(_root, selector);
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

                    // Spawn a separate process to crop the image to the size and position of the element
                    // console.log(_processRoot + '/lib/GhostKnife/ghostknife', [tempFile, where.x, where.y, size.width, size.height, 3000, 10000, filename]);
                    var spawn = require('child_process').spawn,
                    imgcrp = spawn(_processRoot + '/lib/GhostKnife/ghostknife', [tempFile, where.x, where.y, size.width, size.height, 3000, 10000, filename]);
                    imgcrp.on('exit', function(code) {
                        if (code === 0) {
                            callback(null, {status: /\.diff\./.test(filename)?'success':'firstrun', value: filename});
                        } else {
                            callback(new Error("Error cropping image via ghostknife: " + code));
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
        // But instead, we have to spawn the global imagediff because the node one is acting weird
        var spawn = require('child_process').spawn,
            imgdf = spawn(_processRoot + '/lib/GhostDiff/ghostdiff', [filename, baseFile]);
        imgdf.on('exit', function(code) {
            if (code === 0) {
                callback();
            } else {
                callback.fail(new Error("Images don't match: " + filename));
            }
        });
    }
}

module.exports = exports;