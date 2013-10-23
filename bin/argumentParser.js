module.exports = function (argv) {

    // We will fill up this object with the outcome of various argv tests
    // then send it back to the main script
    var PROPERTIES = {
        fail: false,
        browser: 'firefox',
        logLevel: 'silent',
        reportFormat: 'progress',  // cucumber report format
        configFile : ''
    };

    // Cannot run hardy without arguments
    if (process.argv.length < 3) {
        PROPERTIES.fail = true;
    } else {

        // If this is simply a call to initialise the current directory with default test setup
        if (process.argv[2] === 'init') {
            PROPERTIES.init = true;
        // Remove all existing screenshots from image diffs
        } else if (process.argv[2] === 'clean') {
            PROPERTIES.clean = true;
        // Not just initialising a new folder
        } else {
            if (process.argv[2] === 'selenium') {
                PROPERTIES.selenium = true;
                if(process.argv[3] === 'start') {
                    PROPERTIES.seleniumAction = 'start';
                } else if(process.argv[3] === 'stop') {
                    PROPERTIES.seleniumAction = 'stop';
                } else {
                    PROPERTIES.fail = true;
                }
            }

            process.argv.forEach(function(arg) {
                arg = arg.match(/^--([A-Za-z]+)=(.*)/);

                // Only look for --[PROPERTY] style args, everything else can be forgotten
                if (arg === null || !arg[1]) return;


                // If the JSON file has the argument to override, then override it.
                if (PROPERTIES.hasOwnProperty(arg[1])) {
                    PROPERTIES[arg[1]] = arg[2];

                    // Otherwise proclaim that it is an unrecognised argument
                } else {
                    console.log('Unrecognised argument ' + arg[1]);
                }

            });



        }
    }
    return PROPERTIES;
};
