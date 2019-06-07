module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            compile: {
                options: {
                    presets: ["@babel/preset-env"],
                },
                files: {
                    "build/compiled.js": "public/electron.js",
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'build/main.js': ['build/compiled.js']
                }
            }
        },
        clean: ['build/compiled.js','build/electron.js']
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', ['babel', 'uglify','clean']);
};
