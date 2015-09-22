module.exports = function (grunt) {

    // autoloader for other module
    //require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),

        'meta': {
            'jsFilesForTesting': [
                'bower_components/',
                'test/**/*Spec.js'
            ]
        },

        'karma': {
            'development': {
                'configFile': 'karma.conf.js',
                'options': {
                    'files': [
                        '<%= meta.jsFilesForTesting %>',
                        'source/**/*.js'
                    ]
                }
            },

            'dist': {
                'options': {
                    'configFile': 'karma.conf.js',
                    'files': [
                        '<%= meta.jsFilesForTesting %>',
                        'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
                    ]
                }
            },

            'minified': {
                'options': {
                    'configFile': 'karma.conf.js',
                    'files': [
                        '<%= meta.jsFilesForTesting %>',
                        'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js'
                    ]
                }
            }
        },

        'jshint': {
            'beforeConcat': ['source/**/*.js']
        },

        'concat': {
            'dist': {
                'src': ['source/**/*.js'],
                'dest': 'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
            }
        },

        'uglify': {
            'options': {
                'mangle': false
            },  
            'dist': {
                'files': {
                    'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js': ['dist/<%= pkg.namelower %>-<%= pkg.version %>.js']
                }
            }
        },

        'jsdoc': {
            'src': ['source/**/*.js'],
            'options': {
                'destination': 'doc'
            }
        },

        'jshint': {
            'options': {
                'jshintrc': '.jshintrc'
            },
            'all' : [
                'source/**/*.js'
            ]
        },

        'watch': {
            'dev': {
                'files': [
                    'source/**/*.js',
                    '!bower_components/**',
                    '!node_modules/**'
                ],
                'tasks': ['jshint'],
                'options': {
                    //'livereload': true
                }
            },
            'other': {
                'files': [
                    '**/*.html',
                    '**/*.css',
                ],
                'options': {
                    //'livereload': true
                }
            }
        }
    });

    grunt.registerTask('test', ['karma:development']);
    grunt.registerTask('build', [
        'jshint',
        'karma:development',
        'concat',
        'karma:dist',
        'uglify',
        'karma:minified',
        'jsdoc'
    ]);
    grunt.registerTask('wdev', [
        //'jshintdev',
        'watch'
    ]);

};