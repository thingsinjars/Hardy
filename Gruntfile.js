module.exports = function(grunt) {
  grunt.initConfig({
    jasmine_node: {
      specFolders: ["./tests/spec"],
      specNameMatcher: "spec", // load only specs containing specNameMatcher
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath: "./tests/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('test', 'jasmine_node');
};
