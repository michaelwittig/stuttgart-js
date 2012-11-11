module.exports = function(grunt) {

    grunt.initConfig({

	requirejs: {
	    dir: 'build/',
	    appDir: 'static/',
	    baseUrl: 'js',
	    mainConfigFile: 'static/js/main.js',
	    inlineText: true,
	    pragmasOnSave: {
		// excludeHbsParser: true,
		// excludeHbs: true,
		// excludeAfterBuild: true
	    },
	    paths: {
		jquery: 'empty:',
		leaflet: 'empty:',
		'socket.io': 'empty:'
	    },
	    modules: [
		{
		    name: "main"
		}
	    ]
	},
	watch: {
	    files: [],
	    tasks: ''
	}

    });

    grunt.loadNpmTasks('grunt-requirejs');

    grunt.registerTask('build', 'requirejs');
    grunt.registerTask('b', 'requirejs');

};