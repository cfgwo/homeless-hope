/**
 * Created by eweng on 12/21/2014.
 */


module.exports = function(grunt){
    'use strict';
    var globalConfig = {
        bower_dir: 'bower_components',
        src: 'assets',
        dest: '.'
    };

    grunt.initConfig({
        globalConfig:globalConfig,
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * Homeless help v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' */\n',

        // COPY LIB FILES TO ASSETS FOLDERS
        bowercopy:{
            options:{
                srcPrefix:'<%= globalConfig.bower_dir %>'
            },

            // Copy Javascript files
            scripts:{
                options:{
                    destPrefix: '<%= globalConfig.src %>/js/'
                },

                files:{
                    'libs/jquery.js' : 'jquery/dist/jquery.js',
                    'bootstrap/' :  'bootstrap/dist/js'
                }
            },

            // Copy LESS files
            less: {
                options: {
                    destPrefix: '<%= globalConfig.src %>/less'
                },
                files:{
                    'bootstrap/' :  'bootstrap/less',
                    'bootstrap.less': 'bootstrap/less/bootstrap.less'
                }
            }
        },

        // MERGE CUSTOM JS FILES INTO APP.JS
        concat:{
            js:{
                src:['<%= globalConfig.src %>/js/pre/**/*.js'],
                dest:'<%= globalConfig.src %>/js/app.js'
            }
        },
        // MINIFY JS FILE
        uglify:{
            options: {
              /*  banner: '! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> ',*/
                beautify : {
                    beautify: false,
                    ascii_only: true,
                    quote_keys: true
                }
            },
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        src: ['**/*.js', '!**/pre/**', '!**/*.min.js'],
                        dest: '<%= globalConfig.dest %>/js',
                        cwd: '<%= globalConfig.src %>/js',
                        extDot: 'last',
                        ext: '.min.js'
                    }
                ]
            },
            static_mappings:{
                src:['**/*.js', '**/*.min.js', '**/*.backup.js'],
                dest:'<%= globalConfig.dest %>/js'
            }
        },

        // LESS FILE COMPILATION
        less:{
            development:{
                options: {
                    banner: '<%= banner %>',
                    compress:false,
                    yuicompress:true,
                    optimization:2
                },
                files:{
                    "<%= globalConfig.src %>/css/bootstrap.css": "<%= globalConfig.src %>/less/bootstrap.less",
                    "<%= globalConfig.src %>/css/mySiteStyles.css": "<%= globalConfig.src %>/less/mySiteStyles.less"
                  /*  "<%= globalConfig.src %>/css/awesome.css": "<%= globalConfig.src %>/less/font-awesome.less",
                    "<%= globalConfig.src %>/css/custom.css": "<%= globalConfig.src %>/less/custom.less",
                    "<%= globalConfig.src %>/css/overrides.css": "<%= globalConfig.src %>/less/overrides.less"*/
                }
            }
        },

        // MINIFY CSS
        'cssmin': {
            minify: {
                expand: true,
                src: ['*.css', '!*.min.css'],
                dest: '<%= globalConfig.dest %>/css/',
                cwd: '<%= globalConfig.src %>/css/',
                extDot: 'last',
                ext: '.min.css'
            }
        },

        // WATCH FILES FOR CHANGES
        watch:{
            // Recompile Javascript
            script:{
                files:['<%= globalConfig.src %>/js/pre/**/*.js'],
                tasks:["concat", "uglify:dynamic_mappings"]
            },

            // Recompile less to css
            less: {
                files:["<%= globalConfig.src %>/less/*.less"],
                tasks:["less", "cssmin"]
            },
            css: {
                options: {livereload: true},
                files: ['<%= globalConfig.src %>/css/**/*.css']
            },
            html: {
                options: {livereload: true},
                files: ['**.html']
            }
        },
        clean:{
            build:'build',
            temp: 'build/temp'
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('copy', ['bowercopy']);
    grunt.registerTask('default', ['concat', 'uglify:dynamic_mappings', 'less','cssmin','watch']);
    grunt.registerTask('dist-less', ['less','cssmin']);
    grunt.registerTask('dist-js', ['uglify:dynamic_mappings']);
    grunt.registerTask('dist-watch', ['watch']);
    /* grunt.registerTask('build', ['clean:build', 'concat','uglify', 'clean:temp']);*/
    /* grunt.registerTask('default', ['less', 'cssmin', 'watch']);*/
    /* grunt.registertask('hello', function(){
        console.log('hello world grunt!');
    });*/
};
