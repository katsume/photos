module.exports = function(grunt) {

	grunt.initConfig({
		requirejs: {
			viewer: {
				options: {
					appDir: "./src",
					baseUrl: "shared/js",
					mainConfigFile: "./src/shared/js/index.js",
					dir: "./dist",
//					optimize: "none",
					optimizeCss: "standard",
					findNestedDependencies: true,
					removeCombined: true,
					modules: [
						{
							name: "index",
							exclude: [
								"socket.io"
							]
						}
					],
					fileExclusionRegExp: /^ﾂ･.|scss/
				}
			}
		},
		rsync: {
			options: {
				host: "219.94.250.49",
				recursive: true,
				syncDest: false,
				syncDestIgnoreExcl: true,
				exclude: [".svn", ".DS_Store", "build.txt", "post_images"]
			},
			viewer: {
				options: {
					src: "./dist/",
					dest: "/var/www/immi.katsu.me/htdocs/viewer"
				}
			}
		}
	});

	var package= grunt.file.readJSON('package.json');
	for(var task in package.devDependencies) {
		if(task.match(/^grunt-/)!==null) {
			grunt.loadNpmTasks(task);
		}
	}

	grunt.registerTask("deploy", [
		"requirejs",
		"rsync"
	]);
};

