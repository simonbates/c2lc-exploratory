/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

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
