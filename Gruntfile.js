/* jshint node: true */
module.exports = function (grunt) {
    "use strict";
    var dist_dir = 'dist',
    admin_dist_dir = dist_dir + '/admin',
    admin_assets_dist_dir = admin_dist_dir + '/assets',
    site_dist_dir = dist_dir + '/www',
    site_assets_dist_dir = site_dist_dir + '/assets';
    
    // Project configuration.
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
            '* Metis - <%=pkg.name %> v<%= pkg.version %>\n' +
            '* Author : <%= pkg.author.name %> \n' +
            '* Copyright <%= grunt.template.today("yyyy") %>\n' +
            '* Licensed under <%= pkg.licenses %>\n' +
            '*/\n',
        clean: {dist: ['dist']},
        less: {
            options: {
		banner: '<%= banner %>',
                metadata: 'src/*.{json,yml}',
// 		sourceMap: true,
//              sourceMapFilename: "dist/admin/assets/css/style.css.map",
//              sourceMapURL: 'style.css.map',
                paths: 'bower_components/bootstrap/less',
                imports: {
                    reference: ['mixins.less', 'variables.less']
                }
            },
            development: {
                files: [
                    {
                        src: ['src/assets/less/style.less'],
                        dest: admin_assets_dist_dir + '/css/main.css'
                    },
                    {
                        expand: true,
                        cwd: 'src/assets/less/pages',
                        src: ['*.less'],
                        dest: admin_assets_dist_dir + '/css/pages/',
                        ext: '.css'
                    }
                ]
            },
            production: {
                options: {
                    compress: true
                },
                files: [
                    {
                        src: ['src/assets/less/style.less'],
                        dest: admin_assets_dist_dir + '/css/main.min.css'
                    },
                    {
                        expand: true,
                        cwd: 'src/assets/less/pages',
                        src: ['*.less'],
                        dest: admin_assets_dist_dir + '/css/pages/',
                        ext: '.min.css'
                    }
                ]
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            main: {
                src: ['src/assets/js/app/*.js', 'src/assets/js/initS3Auth.js'],
                dest: admin_assets_dist_dir + '/js/main.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            main: {
                src: ['<%= concat.main.dest %>'],
                dest: admin_assets_dist_dir + '/js/main.min.js'
            },
            setupPage: {
                src: 'src/assets/js/pages/*.js',
                dest: admin_assets_dist_dir + '/js/pages/',
                expand: true,    // allow dynamic building
                flatten: true,   // remove all unnecessary nesting
                ext: '.min.js'   // replace .js to .min.js
            }
        },
        jshint: {
            options: {
                jshintrc: 'src/assets/js/.jshintrc'
            },
            main: {
                src: ['src/assets/js/*.js', 'src/assets/app/*.js', 
                      'src/assets/pages/*.js']
            }
        },
        assemble: {
            // Task-level options
            options: {
                flatten: true,
                postprocess: require('pretty'),
                assets: admin_assets_dist_dir,
                data: 'src/data/*.{json,yml}',
                partials: ['src/templates/partials/**/*.hbs'],
                helpers: 'src/helper/**/*.js',
                layoutdir: 'src/templates/layouts'
            },
            // site librelio.com
            site: {
                // Target-level options
                options: {
                    layout: 'site_default.hbs',
                    assets: site_assets_dist_dir
                },
                files: [
                    {expand: true, cwd: 'src/templates/site', src: ['*.hbs'], dest: site_dist_dir}
                ]
            },
            pages: {
                // Target-level options
                options: {
                    layout: 'default.hbs'
                },
                files: [
                    {expand: true, cwd: 'src/templates/pages', src: ['*.hbs'], dest: admin_dist_dir}
                ]
            },
            login: {
                options: {
                    layout: 'login.hbs'
                },
                files: [
                    {expand: true, cwd: 'src/templates/login', src: ['login.hbs'], dest: admin_dist_dir}
                ]
            },
            svg_editor: {
                files: [
                    {expand: true, cwd: 'src/templates/svgedit', src: ['svgedit.hbs'], dest: admin_dist_dir}
                ]
            },
            errors: {
                options: {
                    layout: 'errors.hbs'
                },
                files: [
                    {expand: true, cwd: 'src/templates/errors', src: ['*.hbs'], dest: admin_dist_dir}
                ]
            },
            countdown: {
                options: {
                    layout: 'countdown.hbs'
                },
                files: [
                    {expand: true, cwd: 'src/templates/countdown', src: ['*.hbs'], dest: admin_dist_dir}
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/assets/css',
                        src: ['./**/*.*'],
                        dest: admin_assets_dist_dir + '/css'
                    },
                    {
                        expand: true,
                        cwd: 'src/assets/js',
                        src: ['./*.js', './pages/*.js'],
                        dest: admin_assets_dist_dir + '/js'
                    },
                    {
                        expand: true,
                        cwd: 'src/assets/lib',
                        src: ['./**/*', './*.*','./*/*.*','./*/css/*.*','./*/img/*.*','./*/js/**/*.*','./datatables/**/*.*',],
                        dest: admin_assets_dist_dir + '/lib'
                    },
                    {
                        expand: true,
                        cwd: 'src/assets/img',
                        src: ['./**/*.*'],
                        dest: admin_assets_dist_dir + '/img'
                    },
                    {
                        expand: true,
                        cwd: 'src/assets/submodule',
                        src: ['./*/*.*','./*/css/*.*','./*/build/css/bootstrap3/*.*','./*/js/*.*','./*/src/js/*.*','./*/build/js/*.*','./*/reader/**/*.*','./*/themes/**'],
                        filter: 'isFile',
                        dest: admin_assets_dist_dir + '/lib'
                    },
                    {
                        expand: true,
                        cwd: 'src/ember',
                        src: ['*.html'],
                        dest: admin_dist_dir
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/assemble-less/node_modules/less/dist/',
                        src: ['less-1.6.3.min.js'],
                        dest: admin_assets_dist_dir + '/lib'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery/dist',
                        src: ['./**/jquery*.min.*'],
                        dest: admin_assets_dist_dir + '/lib'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/d3',
                        src: ['d3.min.js'],
                        dest: admin_assets_dist_dir + '/lib'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist/',
                        src: ['./**/*.*'],
                        dest: admin_assets_dist_dir + '/lib/bootstrap'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/font-awesome/',
                        src: ['./css/*.*', './fonts/*.*'],
                        dest: admin_assets_dist_dir + '/lib/Font-Awesome'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/gmaps/',
                        src: ['./**/gmaps.js'],
                        dest: admin_assets_dist_dir + '/lib/gmaps'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/html5shiv/dist',
                        src: ['./html5shiv.js'],
                        dest: admin_assets_dist_dir + '/lib/html5shiv',
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/respond/dest',
                        src: ['./respond.min.js'],
                        dest: admin_assets_dist_dir + '/lib/respond'
                    },
		            {
                        expand: true,
                        cwd: 'src/assets/less',
                        src: ['./**/theme.less'],
                        dest: admin_assets_dist_dir + '/less'
                    },
		            {
		                expand: true,
		                cwd: 'node_modules/epiceditor/epiceditor',
		                src: ['./**/*.*'],
		                dest: admin_assets_dist_dir + '/lib/epiceditor'
		            },
                    {
                       expand: true,
                     cwd: 'node_modules/screenfull/dist/',
                     src: ['./**/*.*'],
                     dest: admin_assets_dist_dir + '/lib/screenfull/'
                    },
                    /* copy site assets */
                    {
                        expand: true,
                        cwd: 'bower_components/html5shiv/dist',
                        src: ['./html5shiv.js'],
                        dest: site_assets_dist_dir + '/lib/html5shiv'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/respond/dest',
                        src: ['./respond.min.js'],
                        dest: site_assets_dist_dir + '/lib/respond'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/font-awesome/fonts/',
                        src: ['*'],
                        dest: site_assets_dist_dir + '/fonts'
                    },
                    {
                        expand: true,
                        cwd: 'src/site_assets/css',
                        src: ['*.css'],
                        dest: site_assets_dist_dir + '/css'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery/dist',
                        src: ['./**/jquery*.min.*'],
                        dest: site_assets_dist_dir + '/lib'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist/',
                        src: ['./**/*.*'],
                        dest: site_assets_dist_dir + '/lib/bootstrap'
                    },
                    {
                        expand: true,
                        cwd: 'src/site_assets/lib',
                        src: ['./**/*'],
                        dest: site_assets_dist_dir + '/lib'
                    },
                    {
                        expand:  true,
                        cwd: 'src/site_assets/js',
                        src: ['*.js'],
                        dest: site_assets_dist_dir + '/js'
                    },
                    {
                        expand: true,
                        cwd: 'src/site_assets/img',
                        src: ['./**/*.*'],
                        dest: site_assets_dist_dir + '/img'
                    }   
                ]
            }
        },

        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['dist-js']
            },
            css: {
                files: ['**/*.css'],
                tasks: ['copy']
            },
            assemble: {
                files: ['**/*.hbs', '**/*.html'],
                tasks: ['assemble']
            },
            js: {
                files: 'js/*.js',
                tasks: [ 'uglify' ]
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('assemble-less');


    //grunt.loadNpmTasks('grunt-recess');
    // remove grunt-recess modules. because not supported my code

    grunt.loadNpmTasks('assemble');

    // Test task.
    //grunt.registerTask('test', ['jshint', 'qunit']);

    // JS distribution task.
    grunt.registerTask('dist-js', ['concat', 'jshint', 'uglify']);

    
    // Full distribution task.
    grunt.registerTask('dist', ['clean', 'copy', 'less', 'dist-js']);

    // Default task.
    //grunt.registerTask('default', ['test', 'dist']);

    grunt.registerTask('default', ['dist', 'assemble']);

};
