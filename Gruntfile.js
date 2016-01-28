module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Merge files
        concat: {
          options: {
            separator: ';',
          },
          dist: {
            src: [
                'bower_components/jquery/dist/jquery.js',
                'js/thirdparty/modernizr/modernizr-2.6.2-min.js',
                'bower_components/foundation-sites/dist/foundation.min.js',
                'js/thirdparty/offcanvas/offcanvas.jquery.js',
                'bower_components/pickadate/lib/picker.js',
                'bower_components/pickadate/lib/picker.date.js',
                'bower_components/jquery-auto-complete/jquery.auto-complete.js'
            ],
            dest: 'js/global-plugins.js'
          },
        },

        // Minify
        uglify: {
          my_target: {
            files: {
              'js/global-plugins.min.js': [
                  'js/bhrjs/global-plugins.js'
              ],
              'js/hotel.min.js': [
                  'js/bhrjs/hotel.js'
              ],
              'js/home.min.js': [
                  'js/bhrjs/home.js'
              ],
              'js/slideshow.min.js': [
                  'js/bhrjs/slideshow.js'
              ],
              'js/giftcards.min.js': [
                  'js/bhrjs/giftcards.js'
              ]
            }
          }
        },

        // Spriting
        svgstore: {
          options: {
            prefix : '',
            cleanup: true,
            inheritviewbox: true,
            symbol: {
                preserveAspectRatio: "xMidYMid meet",
                width: "100%"
            },
            formatting : {
              indent_size : 2
            }
          },
          default : {
            files: {
              'images/svg/sprite.svg': ['images/svg/source/*.svg']
            }
          }
        },

        // SASS Compile
        sass: {
            options: {
                outputStyle: 'expanded',
                sourceMap: true,
                includePaths: [
                    'bower_components/foundation-sites/scss'
                    // 'bower_components/motion-ui/src'
                ]
            },
            dist: {
                files: {
                    'css/style.css': 'sass/style.scss',
                    'css/typography.css': 'sass/typography.scss',
                    'css/editor.css': 'sass/editor.scss'
                }
            }
        },

        postcss: {
            options: {
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    sourcesContent: false
                },
                processors: [
                    require('autoprefixer')({
                        browsers: [
                            'last 2 versions',
                            'ie >= 8'
                        ]
                    })
                ]
            },
            dist: {
                src: 'css/*.css'
            }
        },

        cssnano: {
            options: {
                sourcemap: true
            },
            dist: {
                files: {
                    'css/style.css': 'css/style.css',
                    'css/editor.css': 'css/editor.css',
                    'css/typography.css': 'css/typography.css'
                }
            }
        },

        // Watch Tasks
        watch: {
          css: {
            files: [
                'sass/*.scss',
                'sass/**/*.scss'
            ],
            tasks: [
                'sass',
                'postcss'
            ],
            options: {
              spawn: false
            }
          },
          // js: {
          //   files: ['**/*.js'],
          //   tasks: ['jshint', 'concat'],
          //   options: {
          //     spawn: false
          //   }
          // },
          svg: {
            files: ['images/svg/pre/*.svg'],
            tasks: ['svgstore'],
            options: {
              spawn: false
            }
          }
        }

    });

    // Default task(s).
    grunt.registerTask('sassy', ['sass','postcss']);
    grunt.registerTask('spritey', ['svgstore']);

};
