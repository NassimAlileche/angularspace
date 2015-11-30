'use strict';

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

        'sources': {
            'dev': [
                'source/app/**/*.js',
            ],
            'tests': [
                'test/**/*Spec.js',
            ]
        },

        'meta': {
            'jsFilesForTesting': [
                'bower_components/jquery/dist/jquery.js',
                'bower_components/bootstrap/dist/js/bootstrap.js',
                'bower_components/angular/angular.js',
                'bower_components/angular-route/angular-route.min.js',
                'bower_components/angular-messages/angular-messages.min.js',
                'bower_components/bootstrap-ui/dist/ui-bootstrap-tpls-0.12.0.js',
                //'bower_components/angular-sanitize/angular-sanitize.js',
                //'bower_components/angular-mocks/angular-mocks.js',
                //'bower_components/restangular/dist/restangular.js',
                //'bower_components/underscore/underscore.js',
                '<%= sources.tests %>'
            ]
        },

        'karma': {
            'development': {
                'configFile': 'karma.conf.js',
                'options': {
                    'files': [
                        '<%= meta.jsFilesForTesting %>',
                        '<%= sources.dev %>'
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
            'beforeConcat': [
                '<%= sources.dev %>'
            ],
            
            'watch': {
                'options': {
                    'jshintrc': '.jshintrc'
                },
                'all' : [
                    '<%= sources.dev %>'
                ]
            },
        },

        'concat': {
            'dist': {
                'src': [ '<%= sources.dev %>' ],
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
            'src': [ '<%= sources.dev %>' ],
            'options': {
                'destination': 'doc'
            }
        },

        'watch': {
            'dev': {
                'files': [
                    '<%= sources.dev %>',
                    '!bower_components/**',
                    '!node_modules/**'
                ],
                'tasks': ['jshint:watch'],
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

    grunt.registerTask('test', [
        'karma:development'
    ]);
    
    grunt.registerTask('build', [
        'jshint:beforeConcat',
        'karma:development',
        'concat',
        'karma:dist',
        'uglify',
        'karma:minified',
        'jsdoc'
    ]);

    grunt.registerTask('wdev', [
        'jshint:watch',
        'watch'
    ]);
    
    grunt.registerTask('readpkg', [
        'uglify'
    ]);
    
};