module.exports = function(grunt) {
  grunt.initConfig({
    jasmine_node: {
      specNameMatcher: "spec", // load only specs containing specNameMatcher
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      captureExceptions: true,
      jUnit: {
        report: false,
        savePath: "./tests/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    },
    shell: {
      full: {
        command: './test.sh',
        options: {
          stdout: true,
          execOptions: {
            cwd: './tests/acceptance'
          }
        }
      },
      phantom: {
        command: './phantom.sh',
        options: {
          stdout: true,
          execOptions: {
            cwd: './tests/acceptance'
          }
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'features/**/*.js', 'bin/**/*.js', 'tests/spec/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('unit', 'jasmine_node');
  grunt.registerTask('acceptance', 'shell:full');
  grunt.registerTask('phantom', 'shell:phantom');
  grunt.registerTask('test', ['jasmine_node', 'shell:full']);

  grunt.loadNpmTasks('grunt-contrib-jshint');

};
