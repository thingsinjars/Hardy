/* Hardy CLI Tests
 */

var HardyCLI, basedir;

basedir = '../../';

var mockery = require('mockery');

describe('HardyCLI: ', function() {

	var fsMock, httpMock, child_processMock;

	(function() {
		console.log = jasmine.createSpy('Console log');
		process.exit = jasmine.createSpy('process exit');
		process.kill = jasmine.createSpy('process kill');
	})();

	beforeEach(function() {
		mockery.registerAllowable(basedir + 'bin/hardy-CLI');
		fsMock = {
			existsSync: jasmine.createSpy('fs.exists').andReturn(false),
			writeFile: jasmine.createSpy('fs.creating file').andCallFake(function(filename, content, callback) {
				callback();
			}),
			writeFileSync: jasmine.createSpy('fs.creating file sync'),
			mkdirSync: jasmine.createSpy('fs.mkdirSync'),
			readFileSync: jasmine.createSpy('fs.readFileSync').andReturn('1234'),
			unlinkSync: jasmine.createSpy('fs.unlinkSync').andReturn('1234')
		};

		httpMock = {
			get: function() {return httpMock;},
			on: function() {return httpMock;}
		};

		child_processMock = {
			spawn: jasmine.createSpy('child_process.spawn').andReturn({pid: '999', on: jasmine.createSpy('registering on process exit')})
		};

	});

	describe('HardyCLI arguments', function() {

		it('Fails early if argument parsing has failed', function() {
			HardyCLI = require(basedir + 'bin/hardy-CLI');
			HardyCLI.init({
				fail: true
			});
			expect(console.log).toHaveBeenCalledWith('Usage:');
			expect(process.exit).toHaveBeenCalledWith(1);
		});
	});

	describe('hardy init', function() {

		beforeEach(function() {
			mockery.registerAllowable(basedir + 'bin/hardy-CLI');
			mockery.registerAllowable('http');
			mockery.registerAllowable('path');
			mockery.registerAllowable('child_process');
			mockery.registerAllowable('./argumentParser');
			mockery.registerAllowable('../package.json');
		});

		afterEach(function() {
			mockery.disable();
			mockery.deregisterAll();
		});

		it('initialises an empty directory with test files', function() {
			var HardyCLI;

			fsMock.existsSync = jasmine.createSpy('fs.exists').andReturn(false);

			mockery.registerMock('fs', fsMock);
			mockery.enable({useCleanCache: true });
			HardyCLI = require(basedir + 'bin/hardy-CLI');


			HardyCLI.init({
				init: true
			});

			expect(fsMock.existsSync).toHaveBeenCalled();
			expect(console.log).toHaveBeenCalledWith("Directory initialised");
			expect(process.exit).toHaveBeenCalledWith(0);

		});

		it('Refuses to initialise a non-empty directory', function() {
			var HardyCLI;

			fsMock.existsSync = jasmine.createSpy('fs.exists').andReturn(true);

			mockery.registerMock('fs', fsMock);
			mockery.enable({
				useCleanCache: true
			});
			HardyCLI = require(basedir + 'bin/hardy-CLI');

			HardyCLI.init({
				init: true
			});

			expect(console.log).toHaveBeenCalledWith('Cannot init a non-empty directory');
			expect(process.exit).toHaveBeenCalledWith(1);

		});

		it('Cleans the screenshot directory', function() {
			var HardyCLI;

			fsMock.existsSync = jasmine.createSpy('fs.exists').andReturn(true);

			mockery.registerMock('fs', fsMock);
			mockery.enable({
				useCleanCache: true
			});
			HardyCLI = require(basedir + 'bin/hardy-CLI');

			HardyCLI.init({
				clean: true
			});

			expect(console.log).toHaveBeenCalledWith("Directory initialised");
			expect(process.exit).toHaveBeenCalledWith(1);

		});

		it('reads the Selenium lock', function() {
			var HardyCLI;

			fsMock.existsSync =  jasmine.createSpy('fs.exists').andReturn(true);
			fsMock.readFileSync =  jasmine.createSpy('fs.readFileSync').andReturn('1234');

			mockery.registerMock('fs', fsMock);
			mockery.registerMock('child_process', child_processMock);

			mockery.enable({useCleanCache: true});
			HardyCLI = require(basedir + 'bin/hardy-CLI');

			HardyCLI.init();

			expect(fsMock.existsSync).toHaveBeenCalled();
			expect(fsMock.readFileSync).toHaveBeenCalled();

		});
	});

	describe('Selenium control', function() {

		var seleniumProperties;

		beforeEach(function() {
			console.log.reset();
			mockery.registerAllowable('path');
			mockery.registerAllowable('./argumentParser');
			mockery.registerAllowable('../package.json');

			seleniumProperties = {
				seleniumPID: '1234',
				selenium: true,
				seleniumAction: 'start'
			};
		});

		afterEach(function() {
			mockery.disable();
			mockery.deregisterAll();
		});


		it('starts selenium when selenium is not running', function() {
			httpMock.on = function(state, fail) {fail();};

			mockery.registerMock('fs', fsMock);
			mockery.registerMock('http', httpMock);
			mockery.registerMock('child_process', child_processMock);

			mockery.enable({useCleanCache: true});
			HardyCLI = require(basedir + 'bin/hardy-CLI');

			HardyCLI.init(seleniumProperties);

			expect(console.log).toHaveBeenCalledWith("Selenium started: [999]");

		});
		it('stops selenium', function() {
			httpMock.get = function(url, success) {success(); return httpMock;};
			httpMock.on = function(state, fail) {fail();};
			fsMock.existsSync = function(lockFile) {return true;};

			seleniumProperties.seleniumAction = 'stop';

			mockery.registerMock('fs', fsMock);
			mockery.registerMock('http', httpMock);
			mockery.registerMock('child_process', child_processMock);

			mockery.enable({useCleanCache: true});
			HardyCLI = require(basedir + 'bin/hardy-CLI');

			HardyCLI.init(seleniumProperties);

			expect(console.log).toHaveBeenCalledWith("Selenium stopped");
		});
		it('cannot stop external selenium', function() {
			httpMock.get = function(url, success) {success(); return httpMock;};
			httpMock.on = function(state, fail) {};
			fsMock.existsSync = function(lockFile) {return false;};

			seleniumProperties.seleniumAction = 'stop';
			delete seleniumProperties.seleniumPID;

			mockery.registerMock('fs', fsMock);
			mockery.registerMock('http', httpMock);
			mockery.registerMock('child_process', child_processMock);

			mockery.enable({useCleanCache: true});
			HardyCLI = require(basedir + 'bin/hardy-CLI');

			HardyCLI.init(seleniumProperties);

			expect(console.log).toHaveBeenCalledWith("Cannot control external Selenium");
		});
	});
});
