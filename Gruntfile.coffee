module.exports = (grunt) ->
    grunt.initConfig
        # building our dev code.
        compass:
            dist:
                options:
                    config: 'config.rb'
                    sourcemap: false
                    noLineComments: true
        autoprefixer:
            options:
                browsers: ['last 2 version', 'ie 8', 'ie 9']
        haml:
            dist:
                files:
                    'index.html': 'index.haml' # 'destination': 'source'
        coffee:
            options:
                bare: false # wrapper function?
                join: false 
                separator: ";"
                sourcemap: false
            coffeeTarget:
                # since we want to compile all files in a directory, we don't know what all thier names are so we won't know what the destination file name will be, so we use this format to dynamically name them
                expand: true #expand the file path
                cwd: 'coffee/' #Current Working Directory(source of files to compile)
                src: '*.coffee' # actual files we are targeting
                dest: "caffinatedjs/" # destination for compiled .js files
                ext: ".js" # the extension to add to every compiled file

        # checking for JavaScript errors
        jshint:
            all: ['./js/MindMap.js', './js/WikiSearch.js']

        # prepping the code for deployment.
        concat:
            options:
                separator: "\r\n"
            concatTarget: 
                src: ["js/*.js", "js/*.js"] # takes these two files and concats them into 1 file. places this file in dest
                dest: "concated/application.js"
        uglify:
            options:
                mangle: true #shorten variable names
                compressed: true #remove whitespace
                sourcemap: "minified/application.map" # add a sourcemap
                banner: "/* WikiMap 2014*/\n" # add a message at the top of file
            someTarget:
                # this is an example of a single target task, ie targets 1 file
                src: "concated/application.js" # the file that concat takes
                dest: "minified/application.min.js"
        clean:
            cleanTarget: ['minified', 'caffinatedjs'] # these are files that we might want to delete everytime

        #unit testing
        jasmine: 
              src: 'js/**/*.js' # Your project's source files
              specs: 'specs/**/*spec.js' # Your Jasmine spec files
              # helpers: 'specs/helpers/*.js' # Your spec helper files

        watch:
            options:
                livereload: true
            scripts:
                files: ["js/*.js"]
                tasks: ["concat", "uglify"]
            coffee:
                files: ["coffee/*.coffee"] # watched files
                tasks: ["coffee"] # task to run on them
            css:
                files: ["scss/*.scss"] # watched files
                tasks: ["compass"] # task to run on them
            haml:
                files: ["./*.haml"] # watched files
                tasks: ["haml"] # task to run on them
            nodeunit:
                files: ["test/*_test.js"] # watched files
                tasks: ["nodeunit"] # task to run on them

    # loading all the dependencies
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-nodeunit'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-compass'
    grunt.loadNpmTasks 'grunt-contrib-haml'
    grunt.loadNpmTasks 'grunt-autoprefixer'

    # if you type "grunt" on the command line, you get the "default" task.
    # this chains together the tasks in the array; if one fails, the process stops
    grunt.registerTask "default", ['concat', 'uglify', 'compass', 'autoprefixer', 'haml', 'jshint']

    # "reboot" is arbitrary name, we run clean first, then run default (above).
    grunt.registerTask "reboot", ['clean', 'default']