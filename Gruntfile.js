/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* eslint-env node, es6 */

"use strict";

var child_process = require("child_process");
var fs = require("fs");
var path = require("path");

module.exports = function (grunt) {
    grunt.config.init({
        clean: {
            build: ["build"]
        },
        handlebars: {
            compileAll: {
                files: {
                    "gen/Templates.js": [
                        "src/ProgramTextEditorTemplate.handlebars"
                    ]
                }
            }
        },
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: ".",
                        src: [
                            "node_modules/infusion/dist/infusion-all.js",
                            "src/**",
                            "icons/**",
                            "index.html",
                            "manifest.json",
                            "ServiceWorker.js",
                            "c2lc.css"
                        ],
                        dest: "build"
                    }
                ]
            }
        },
        connect: {
            devServer: {
                options: {
                    hostname: "127.0.0.1",
                    port: 8081
                }
            }
        },
        watch: {
            handlebars: {
                files: ["**/*.handlebars"],
                tasks: ["handlebars:compileAll"]
            }
        },
        lintAll: {
            sources: {
                js: ["*.js", "!gen/*.js"],
                json: ["*.json"]
            }
        }
    });

    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("createNojekyll",
        "Create an empty build/.nojekyll file",
        function () {
            grunt.file.write("build/.nojekyll", "");
        }
    );

    grunt.registerMultiTask("handlebars",
        "Compile Handlebars templates",
        function () {
            for (const output in this.data.files) {
                fs.mkdirSync(path.dirname(output), { recursive: true });
                let sources = this.data.files[output];
                let command = `npx handlebars ${sources.join(" ")} --output ${output}`;
                child_process.execSync(command);
            }
        }
    );

    grunt.registerTask("build", "Build the project for deployment to a web server", [
        "clean:build", "copy:build", "createNojekyll"
    ]);
    grunt.registerTask("lint", "Perform lint checks", ["lint-all"]);
    grunt.registerTask("start", "Run a local dev web server", [
        "handlebars:compileAll",
        "connect:devServer",
        "watch:handlebars"
    ]);

    grunt.registerTask("default", ["build"]);
};
