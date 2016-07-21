module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    clean: [
      'dist/'
    ],

    browserify: {
      app: {
        src: [
          'src/index.js'
        ],
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
          bootstrap: ['dist/css/bootstrap.css']
        }
      }
    },

    copy: {
      index: {
        expand: true,
        cwd: 'public',
        src: '**',
        dest: 'dist/',
      },
      fonts: {
        files: [{
          src: [
            'bower_components/bootstrap/dist/fonts/' +
              'glyphicons-halflings-regular.ttf',
            'bower_components/bootstrap/dist/fonts/' +
              'glyphicons-halflings-regular.woff',
            'bower_components/bootstrap/dist/fonts/' +
              'glyphicons-halflings-regular.woff2'
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
        files: ['public/**/*.html'],
        tasks: ['copy'],
      },
    },

    exec: {
      json_server: {
        cmd: './node_modules/.bin/json-server db.json --static ./dist --routes routes.json',
      }
    },

    parallel: {
      all_the_things: {
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

  grunt.registerTask('default', ['parallel']);
  grunt.registerTask('bower_dist', ['bower', 'bower_concat'])
  grunt.registerTask('dist', ['clean', 'browserify', 'bower_dist', 'copy', 'open']);
};
