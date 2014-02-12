module.exports = (grunt) ->
    grunt.initConfig
        uglify:
            options:
                mangle: true #shorten variable names
                compressed: true #remove whitespace
                sourceMap: "distribution/application.map" # add a sourcemap
                banner: "/* WikiMap 2014/*\n" # add a message at the top of file
            someTarget:
                # this is an example of a single target task, ie targets 1 file
                src: "destination/application.js" # the file that concat takes
                dest: "distribution/application.min.js"
        jshint:
            options:
                jshintrc: ".jshintrc" # options are in a seperate .jshintrc file (can get to be a pretty long list) or can just put them in here like these commented out below
                # eqeqeq: true # set to always use triple equals
                # curly: true # set to always use curlys, even for 1 line "if" statements
                # undef: true # always use the var keyword for variable
                # unused: true # if a variable is not used
            jshintTarget: 
                src: "src/*.js" # since jshint only evaluates the files and throws errors, no need for a destination file
        concat:
            options:
                separator: ";"
            concatTarget: 
                src: ["src/application.js", "src/util.js"] # takes these two files and concats them into 1 file. places this file in dest
                dest: "destination/application.js"
        watch:
            scripts:
                files: ["src/*.js"]
                tasks: ["jshint"]
            coffee:
                files: ["coffee/*.coffee"] # watched files
                tasks: ["coffee"] # task to run on them
            css:
                files: ["sass/*.scss"] # watched files
                tasks: ["compass"] # task to run on them
        autoprefixer:
            options:
                browsers: ['last 2 version', 'ie 8', 'ie 9']
        compass:
            dist:
                options:
                    sourcemap: true
                    noLineComments: true
                    sassDir: 'sass'
                    cssDir: 'css'
        coffee:
            options:
                bare: false # wrapper function?
                join: false 
                separator: ";"
                sourceMap: true
            coffeeTarget:
                # since we want to compile all files in a directory, we don't know what all thier names are so we won't know what the destination file name will be, so we use this format to dynamically name them
                expand: true #expand the file path
                cwd: 'coffee/' #Current Working Directory(source of files to compile)
                src: '*.coffee' # actual files we are targeting
                dest: "lib/" # destination for compiled .js files
                ext: ".js" # the extension to add to every compiled file
        nodeunit: # unit testing, since all it's doing is running our tests, there really aren't any options that need to be passed so we just have the target, but, there's no destination file either so no need to make an object so just set it directly
            nodeunitTarget: 'test/*_test.js' # run on all files with the format name_test.js
        clean:
            cleanTarget: ['distribution', 'lib'] # these are files that we might want to delete everytime


    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-nodeunit'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-compass'
    grunt.loadNpmTasks 'grunt-autoprefixer'

    # when called "default", will only run "grunt" on the command line. so what we do is chain a bunch of tasks together in an array. If one fails, the process stops
    grunt.registerTask "default", ['jshint', 'concat', 'uglify', 'compass', 'autoprefixer']
    # "reboot" is arbitrary name, we run clean first, then run default (above).
    grunt.registerTask "reboot", ['clean', 'default']