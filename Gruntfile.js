/* eslint-env node */

"use strict";

module.exports = function (grunt) {
    grunt.config.init({
        lintAll: {
            sources: {
                js: ["*.js"],
                json: ["*.json"]
            }
        }
    });

    grunt.loadNpmTasks("gpii-grunt-lint-all");

    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);

    grunt.registerTask("default", ["lint"]);
};
