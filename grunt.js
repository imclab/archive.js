/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-coffee');
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*\n  <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("mmm d, yyyy") %>\n' +
      '<%= pkg.homepage ? "  <" + pkg.homepage + ">\n" : "" %>' +
      '  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
      '\n\n  Licensed under <%= _.pluck(pkg.licenses, "type").join(", ") %> license\n*/',
      pre: '(function(window, document, undefined){',
      post: '})(window,document);'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/index.html']
    },
    coffee: {
      compile: {
        files: {
          'build/archive.js': ['src/*.coffee', 'src/**/*.coffee'] // compile and concat into single file
        }
      }
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<banner:meta.pre>', 'build/archive.js', '<banner:meta.post>'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {}
  });



  // Default task.

  grunt.registerTask('default', 'coffee concat qunit min');

};
