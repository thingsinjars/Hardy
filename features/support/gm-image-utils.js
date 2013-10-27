/**
 * Image utility functions that rely on GraphicsMagick
 */
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var environment = { stdio: 'inherit' };
var gm = require('gm');

/**
 * Determine if GraphicsMagick is available.
 * @param callback Invoked with true if available; false otherwise.
 */
exports.isAvailable = function(callback) {
   exec('gm version', function(error, stdout, stderr) {
       callback( error === null );
   });
}


/**
 * Crop the image using GraphicsMagick
 * @param sourceImagePath The source image path to crop
 * @param targetImagePath The target (cropped) image path
 * @param cropRect The cropping area with x,y,width,height
 * @param callback Invoked with no args if successful. or error.
 */
exports.cropImage = function(sourceImagePath, targetImagePath, cropRect, callback)   {

    gm(sourceImagePath)
        .crop(cropRect.width, cropRect.height, cropRect.x, cropRect.y)
        .write(targetImagePath, function(err) {
            if (err) {
                callback(new Error("Error cropping image via GraphicsMagick: " + err));
            }
            else
            {
                callback();
            }
        });
}

/**
 * Visually compare two images using GraphicsMagick
 * @param imagePath1 The first image path to compare
 * @param imagePath2 The second image path to compare
 * @param callback Invoked with true if visually equivalent, false if not. Error upon an error.
 */
exports.compareImages = function(imagePath1, imagePath2, callback) {

    var tolerance = 0.0;  // this means exactly equal
    gm.compare(imagePath1, imagePath2, tolerance, function (err, isEqual, equality, raw) {
        if (err) {
            callback(err);
        }
        else {
            callback(isEqual);
        }
    });

}


/**
 * Create an image showing the visual differences of two images using GraphicsMagick.
 * @param imagePath1 The first image path to compare
 * @param imagePath2 The second image path to compare
 * @param targetImagePath The target image path for the created visual difference image
 * @param callback Invoked with no args if successful. or error.
 */
exports.createImageDiff = function(imagePath1, imagePath2, targetImagePath, callback) {

    gm.compare( imagePath1, imagePath2, { file: targetImagePath }, function(err, isEqual, equality, raw) {

        if (err) {
            callback(err);
        }
        else {
            callback();
        }
    });
}
