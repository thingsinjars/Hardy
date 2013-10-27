/**
 * Image utility functions that rely on GhostKnife and GhostDiff
 */
var spawn = require('child_process').spawn;
var environment = { stdio: 'inherit' };

/**
 * Crop the image using Ghostknife.
 * @param sourceImageFile The source image path to crop.
 * @param targetImagePath The target (cropped) image path.
 * @param cropRect The cropping area with x,y,width,height
 * @param callback Invoked with no args upon successful, or an error.
 */
exports.cropImage = function(sourceImagePath, targetImagePath, cropRect, callback)   {

    //console.log("cropImage with", binaryPath + '/lib/GhostKnife/ghostknife', [sourceImagePath, cropRect.x, cropRect.y, cropRect.width, cropRect.height, 3000, 10000, targetImagePath]);
    var binaryPath = process.env.BINARYPATH;
    var imgcrp = spawn(binaryPath + '/lib/GhostKnife/ghostknife',
        [sourceImagePath, cropRect.x, cropRect.y, cropRect.width, cropRect.height, 3000, 10000, targetImagePath],
        environment);
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
 * @param imagePath1 The first image path to compare
 * @param imagePath2 The second image path to compare
 * @param callback Invoked with true if visually equivalent, false otherwise.
 */
exports.compareImages = function(imagePath1, imagePath2, callback) {

    // But instead, we have to spawn the global imagediff because the node one is acting weird
    var binaryPath = process.env.BINARYPATH;
    var imgdf = spawn(binaryPath + '/lib/GhostDiff/ghostdiff', [imagePath1, imagePath2]);
    imgdf.on('exit', function(code) {
        callback( code === 0 )
    });
}
