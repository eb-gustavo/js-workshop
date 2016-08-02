module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: [
      'dist/'
    ],

    browserify: {
      app: {
        src: 'src/index.js',
        dest: 'dist/bundle.js'
      }
    },

    bower: {
      install: {
        options: {
          cleanTargetDir: true,
          copy: false
        }
      }
    },

    bower_concat: {
      all: {
        dest: {
          'js': 'dist/vendor.js',
          'css': 'dist/vendor.css'
        },
        include: [
          'codemirror',
          'bootstrap',
          'jquery'
        ],
        exclude: [
          'modernizr'
        ],
        dependencies: {
          'bootstrap': 'jquery'
        },
        bowerOptions: {
          relative: false
        },
        mainFiles: {
          bootstrap: [
            'dist/js/bootstrap.js',
            'dist/css/bootstrap.css'
          ],
          codemirror: [
            'lib/codemirror.js',
            'mode/javascript/javascript.js',
            'lib/codemirror.css'
          ]
        }
      }
    },

    copy: {
      index: {
        expand: true,
        cwd: 'public',
        src: '**',
        dest: 'dist/',
        options: {
          process: function(content) {
            return content;
          }
        }
      },
      fonts: {
        files: [{
          src: [
            'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
            'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
            'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
          ],
          dest: 'dist/fonts/',
          cwd: '.',
          expand: true,
          flatten: true
        }]
      },
    },

    open: {
      app: {
        path: 'http://localhost:3000/'
      }
    },

    watch: {
      html: {
        files: 'public/**/*.html',
        tasks: 'copy'
      },
      js: {
        files: 'src/**/*.js',
        tasks: 'browserify'
      }
    },

    exec: {
      json_server: {
        cmd: './node_modules/.bin/json-server db.json --static ./dist --routes routes.json'
      }
    },

    parallel: {
      prod: {
        tasks: [
          {
            grunt: true,
            args: ['dist']
          }, {
            grunt: true,
            args: ['exec']
          }
        ]
      },
      dev: {
        tasks: [
          {
            grunt: true,
            args: ['dist']
          }, {
            grunt: true,
            args: ['watch']
          }, {
            grunt: true,
            args: ['exec']
          }
        ]
      }
    }
  });

  grunt.registerTask('default', ['parallel:prod']);
  grunt.registerTask('dev', ['parallel:dev']);
  grunt.registerTask('dist', ['clean', 'browserify', 'bower', 'bower_concat', 'copy', 'open']);
};
