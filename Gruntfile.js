module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			options: {
				separator: "\n",
				stripBanners: true
			},
			dist: {
				src: [
					"scripts/tdd.js",
					"scripts/core-extensions/Function.js",
					"scripts/core-extensions/Object.js",
					"scripts/core-extensions/Array.js",
					"scripts/core-extensions/Number.js",
					"scripts/core-extensions/Set.js",
					"scripts/core-extensions/Math.js",
					"scripts/core-extensions/Map.js",
					"scripts/data-structures/Grid.js",
					"scripts/data-structures/Tree.js",
					"scripts/data-structures/Sequence.js",
					"scripts/data-structures/Graph.js",
					"scripts/data-structures/DirectedGraph.js",
					"scripts/Vector.js",
					"scripts/DOM.js"
				],
				dest: "utils.js",
			},
			tests: {
				src: "tests/**/*.js",
				dest: "tests.js"
			}
		},
		watch: {
			scripts: {
				files: ["tests/**/*.js", "scripts/**/*.js"],
				tasks: ["concat"],
				options: {
					debounceDelay: 250,
				},
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["concat"]);
};
