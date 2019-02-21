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
        connect: {
            devServer: {
                options: {
                    hostname: "127.0.0.1",
                    port: 8081,
                    keepalive: true
                }
            }
        },
        lintAll: {
            sources: {
                js: ["*.js"],
                json: ["*.json"]
            }
        }
    });

    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.loadNpmTasks("grunt-contrib-connect");

    grunt.registerTask("lint", "Perform lint checks", ["lint-all"]);
    grunt.registerTask("serve", "Run local dev web server", ["connect:devServer"]);

    grunt.registerTask("default", ["serve"]);
};
