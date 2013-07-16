function hardyCLI() {
    //Usage:
    // hardy --browser=chrome,phantomjs,ie features/
    // hardy selenium start
    // hardy selenium stop
    // hardy init

    var http = require("http"),
        fs = require('fs'),
        path = require('path'),
        spawn = require('child_process').spawn,
        argParser = require("./argumentParser"),
        VERSION = require('../package.json').version,
        PROPERTIES,
        browsersToTest,
        testFolder,
        numberOfRuns, currentRun,
        hardyPath = path.resolve(require.main.filename, '../..') + '/',
        testPath,
        lockFile = hardyPath + '.seleniumlock';


    function init(properties) {
        console.log('Hardy v' + VERSION);

        PROPERTIES = properties || argParser(process.argv);

        // If we've failed for some reason
        if (PROPERTIES.fail) {
            printMessageAndExit('', 1, true);
        } else {

            // If this is simply a call to initialise the current directory with default test setup
            if (PROPERTIES.init) {

                // Check it hasn't already got files in it
                if (fs.existsSync('selectors/') || fs.existsSync('screenshots/')) {
                    printMessageAndExit('Cannot init a non-empty directory', 1);

                } else {
                    // If the directory is empty, create the default empty files
                    createTestFolder();
                }

            } else {
                // Not just initialising a new folder

                //First check if Selenium is running
                PROPERTIES.seleniumPID = getSeleniumPID();

                http.get("http://127.0.0.1:4444/wd/hub", seleniumIsRunning)
                    .on('error', seleniumIsNotRunning);

            }

        }
    }

    function createTestFolder() {
        fs.writeFile('test.feature', "", function(err) {
            if (err) {
                printMessageAndExit(err, 1);
            } else {
                fs.mkdirSync('screenshots');
                fs.writeFile('selectors.js', "module.exports = {};", function(err) {
                    if (err) {
                        printMessageAndExit(err, 1);
                    } else {
                        printMessageAndExit("Test folder created");
                    }
                });
                printMessageAndExit();
            }
        });
    }

    function controlNotRunningSelenium() {
        if (PROPERTIES.seleniumAction === 'start') {
            var selenium = spawn('java', ['-jar', hardyPath + 'bin/selenium-server-standalone-2.32.0.jar']);
            fs.writeFile(lockFile, selenium.pid, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    printMessageAndExit("Selenium running: [" + selenium.pid + "]");
                }
            });
        } else if (PROPERTIES.seleniumAction === 'stop') {
            printMessageAndExit('Selenium stopped');
        } else {
            printMessageAndExit('Unrecognised Selenium command', 1, true);
        }
    }

    function controlRunningSelenium() {
        if (PROPERTIES.seleniumAction === 'stop') {
            if (PROPERTIES.seleniumPID) {
                fs.unlinkSync(lockFile);
                process.kill(PROPERTIES.seleniumPID, 'SIGHUP');
                printMessageAndExit('Selenium stopped');
            } else {
                printMessageAndExit('Cannot control external Selenium');
            }

            // Is it a call to start selenium (even though it is already running)?
        } else if (PROPERTIES.seleniumAction === 'start') {
            printMessageAndExit('Selenium already running [' + PROPERTIES.seleniumPID + ']');

            // command is 'hardy selenium somethingElse', Ignore.
        } else {
            printMessageAndExit('Unrecognised Selenium command', 1, true);
        }
    }

    function getSeleniumPID() {
        // is this our Selenium?
        if (fs.existsSync(lockFile)) {
            return fs.readFileSync(lockFile);
        }
        return false;
    }

    function seleniumIsRunning(res) {

        // Selenium is running

        // is this our Selenium?
        if (!PROPERTIES.seleniumPID) {
            console.log('Using external selenium.');
        }

        // is this a call to stop selenium?
        if (PROPERTIES.selenium) {
            controlRunningSelenium();
        } else {
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

            testFolder = process.argv[process.argv.length - 1];
            testPath = path.resolve(testFolder);
            browsersToTest = PROPERTIES.browser.split(',');
            numberOfRuns = browsersToTest.length;
            currentRun = 0;
            exitCode = 0;

            browsersToTest.forEach(buildChildProcess);
        }
    }

    function buildChildProcess(browser) {
        var optionsArray = [];

        // Output style of Cucumber
        optionsArray.push("-f=progress");

        // Get Cucumber to load our CSS test helpers and world files first
        optionsArray.push("-r=" + hardyPath + 'features/');

        // Now load any test-folder local step files
        if (fs.existsSync(testPath + "/step_definitions/")) {
            optionsArray.push("-r=" + testPath + "/step_definitions/");
        }

        // Load test-folder local selector mapping files
        if (fs.existsSync(testPath + "/selectors/")) {
            optionsArray.push("--selectorsPath=" + testPath + "/selectors/");
        }

        // Set the WebDriverJS logLevel if it has been supplied
        if (PROPERTIES.logLevel && PROPERTIES.logLevel !== 'silent') {
            optionsArray.push("--logLevel=" + PROPERTIES.logLevel);
        }

        // Need to loop over the specified browsers
        optionsArray.push("--browser=" + browser);

        // This is the path to the globally installed Hardy
        optionsArray.push("--binaryPath=" + hardyPath);

        // Path to the local test folder
        optionsArray.push("--testPath=" + testPath);

        // Where to find our *.feature files
        optionsArray.push(testPath);


        if(PROPERTIES.logLevel === 'debug') {
            console.log(hardyPath + 'node_modules/cucumber/bin/cucumber.js', optionsArray, {
                cwd: testPath,
                stdio: 'inherit'
            });
        }

        // Spawn all the different browsers into separate child processes
        // but pipe the stdio and stderr back to the parent.
        var testRun = spawn(hardyPath + 'node_modules/cucumber/bin/cucumber.js', optionsArray, {
            cwd: testPath,
            stdio: 'inherit'
        });
        testRun.on('exit', makeNext(browser));
    }

    function seleniumIsNotRunning(e) {
        // Selenium is not running, is this a call to start it?
        if (PROPERTIES.selenium) {

            // If it isn't running, get rid of any incorrect lockfiles
            if (PROPERTIES.seleniumPID) {
                fs.unlinkSync(lockFile);
            }

            controlNotRunningSelenium();
        } else {
            printMessageAndExit("Selenium not running: " + e.message, 1);
        }
    }

    function printMessageAndExit(optionalMessage, exitCode, usage) {
        if (optionalMessage) {
            console.log(optionalMessage);
        }
        if (exitCode) {
            if (usage) {
                console.log('Usage:');
                console.log('hardy --browser=chrome,phantomjs,ie features/');
                console.log('hardy selenium start');
                console.log('hardy selenium stop');
                console.log('hardy init');
            }
            return process.exit(exitCode);
        }
        // console.log(PROPERTIES);
        process.exit(0);
    }

    // Helper to make the main thread wait for the children to finish before
    // deciding on its own error code.
    function makeNext(browser) {
        return function next(code) {
            exitCode += code;
            currentRun++;
            if (code === 0) {
                // Add Browser name here
                console.log(browser + ' success');
            } else {
                console.log(browser + ' fail');
            }
            if (currentRun == numberOfRuns) {
                process.exit(exitCode);
            }
        };
    }

    return {
        PROPERTIES: PROPERTIES,
        init: init,
        printMessageAndExit: printMessageAndExit
    };
}

module.exports = hardyCLI();
