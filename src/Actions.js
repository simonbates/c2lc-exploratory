/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

var fluid = fluid || require("infusion"); // eslint-disable-line no-undef
var jQuery = fluid.registerNamespace("jQuery");

(function ($, fluid) {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    fluid.defaults("c2lc.actions.log", {
        gradeNames: "c2lc.actionHandler",
        message: null, // To be provided
        invokers: {
            handleAction: {
                funcName: "console.log",
                args: [
                    "{that}.options.message"
                ]
            }
        }
    });

    fluid.defaults("c2lc.actions.increment", {
        gradeNames: "c2lc.actionHandler",
        modelPath: null, // To be provided
        invokers: {
            handleAction: {
                funcName: "c2lc.actions.increment.handleAction",
                args: [
                    "{arguments}.0", // interpreter
                    "{that}.options.modelPath"
                ]
            }
        }
    });

    c2lc.actions.increment.handleAction = function (interpreter, modelPath) {
        interpreter.applier.change(modelPath, fluid.get(interpreter.model, modelPath) + 1);
    };

})(jQuery, fluid);
