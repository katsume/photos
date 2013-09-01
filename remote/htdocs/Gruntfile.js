module.exports = function(grunt) {

	grunt.initConfig({
		sass: {
			dist: {
				files: {
					"./client/shared/css/index.css": "./client/shared/scss/index.scss",
					"./viewer/shared/css/index.css": "./viewer/shared/scss/index.scss"
				}
			}
		},
		watch: {
			css: {
				files: [
					"./client/shared/scss/*.scss",
					"./viewer/shared/scss/*.scss"
				],
				tasks: ["sass"]
			}
		},
		requirejs: {
			client: {
				options: {
					appDir: "./client",
					baseUrl: "shared/js",
					mainConfigFile: "./client/shared/js/index.js",
					dir: "./dist/client",
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
			},
			viewer: {
				options: {
					appDir: "./viewer",
					baseUrl: "shared/js",
					mainConfigFile: "./viewer/shared/js/index.js",
					dir: "./dist/viewer",
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
				host: "133.242.150.215",
				recursive: true,
				syncDest: true,
				exclude: [".svn", ".DS_Store", "build.txt"]
			},
			client: {
				options: {
					src: "./dist/client",
					dest: "/var/www/htdocs/pprc"
				}
			},
			viewer: {
				options: {
					src: "./dist/viewer",
					dest: "/var/www/htdocs/pprc"
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

	grunt.registerTask("default", [
		"watch"
	]);

	grunt.registerTask("client", [
		"requirejs:client",
		"rsync:client"
	]);

	grunt.registerTask("viewer", [
		"requirejs:viewer",
		"rsync:viewer"
	]);
};

