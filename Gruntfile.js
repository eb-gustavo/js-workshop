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
        dest: 'dist/'
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

    devcode: {
      options: {
        html: true,
        js: false,
        css: false,
        clean: true,
        block: {
          open: 'devcode',
          close: 'endcode'
        },
        source: 'dist/',
        dest: 'dist/'
      },
      prod: {
        options: {
          env: 'production'
        }
      },
      dev: {
        options: {
          env: 'development'
        }
      }
    },

    open: {
      app: {
        path: 'http://localhost:3000/'
      }
    },

    watch: {
      html: {
        files: 'public/**/*.html',
        tasks: 'copy_dev'
      },
      js: {
        files: 'src/**/*.js',
        tasks: 'browserify'
      }
    },

    exec: {
      json_server: {
        cmd: 'node server.js'
      }
    },

    parallel: {
      prod: {
        options: {
          grunt: true
        },
        tasks: ['dist_prod', 'exec']
      },
      dev: {
        options: {
          grunt: true
        },
        tasks: ['dist_dev', 'watch', 'exec']
      }
    }
  });

  grunt.registerTask('default', ['parallel:prod']);
  grunt.registerTask('dev', ['parallel:dev']);
  grunt.registerTask('copy_prod', ['copy', 'devcode:prod']);
  grunt.registerTask('copy_dev', ['copy', 'devcode:dev']);
  grunt.registerTask('dist_prod', [
    'clean', 'browserify', 'bower', 'bower_concat', 'copy_prod', 'open'
  ]);
  grunt.registerTask('dist_dev', [
    'clean', 'browserify', 'bower', 'bower_concat', 'copy_dev', 'open'
  ]);
};
