/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

(function () {

    "use strict";

    fluid.defaults("c2lc.interpreterControls", {
        gradeNames: "fluid.viewComponent",
        events: {
            onRun: null,
            onStep: null,
            onRestart: null
        },
        listeners: {
            "onCreate.renderControls": {
                "this": "{that}.container",
                method: "html",
                args: ["{that}.options.markup.controls"]
            },
            "onCreate.registerRunClickHandler": {
                priority: "after:renderControls",
                "this": "{that}.dom.runButton",
                method: "click",
                args: ["{that}.events.onRun.fire"]
            },
            "onCreate.registerStepClickHandler": {
                priority: "after:renderControls",
                "this": "{that}.dom.stepButton",
                method: "click",
                args: ["{that}.events.onStep.fire"]
            },
            "onCreate.registerRestartClickHandler": {
                priority: "after:renderControls",
                "this": "{that}.dom.restartButton",
                method: "click",
                args: ["{that}.events.onRestart.fire"]
            }
        },
        selectors: {
            runButton: ".c2lc-interpreterControls-run",
            stepButton: ".c2lc-interpreterControls-step",
            restartButton: ".c2lc-interpreterControls-restart"
        },
        markup: {
            controls: "<button class='c2lc-interpreterControls-run'>Run</button><button class='c2lc-interpreterControls-step'>Step</button><button class='c2lc-interpreterControls-restart'>Restart</button>"
        }
    });

})();
