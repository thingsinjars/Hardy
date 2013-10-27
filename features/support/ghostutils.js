/**
 * Image utility functions that rely on GhostKnife and GhostDiff
 */
var spawn = require('child_process').spawn;
var environment = { stdio: 'inherit' };

/**
 * Crop the image using Ghostknife.
 * @param sourceImageFile The filename to the source image.
 * @param targetImageFile The filename to the target image
 * @param cropRect The cropping area with x,y,width,height
 * @param callback Invoked with No args if successful, or error.
 */
exports.cropImage = function(sourceImageFile, targetImageFile, cropRect, callback)   {

    // Spawn a separate process to crop the image to the size and position of the element
    //console.log("cropImage with", binaryPath + '/lib/GhostKnife/ghostknife', [sourceImageFile, cropRect.x, cropRect.y, cropRect.width, cropRect.height, 3000, 10000, targetImageFile]);
    var binaryPath = process.env.BINARYPATH;
    var imgcrp = spawn(binaryPath + '/lib/GhostKnife/ghostknife', [sourceImageFile, cropRect.x, cropRect.y, cropRect.width, cropRect.height, 3000, 10000, targetImageFile], environment);
    imgcrp.on('exit', function(code) {
        if (code === 0) {
            callback();
        }
        else
        {
            callback(new Error("Error cropping image via ghostknife: " + code));
        }
    });
}

/**
 * Visually compare two images using GhostDiff
 * @param imageFile1 The first image
 * @param imageFile2 The second image
 * @param callback Invoked with true if visually equivalent, false otherwise.
 */
exports.compareImages = function(imageFile1, imageFile2, callback) {

    // But instead, we have to spawn the global imagediff because the node one is acting weird
    var binaryPath = process.env.BINARYPATH;
    imgdf = spawn(binaryPath + '/lib/GhostDiff/ghostdiff', [imageFile1, imageFile2]);
    imgdf.on('exit', function(code) {
        callback( code === 0 )
    });
}
