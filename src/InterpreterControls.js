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
            onStep: null
        },
        listeners: {
            "onCreate.renderControls": {
                "this": "{that}.container",
                method: "html",
                args: ["{that}.options.markup.controls"]
            },
            "onCreate.registerStepClickHandler": {
                priority: "after:renderControls",
                "this": "{that}.dom.stepButton",
                method: "click",
                args: ["{that}.events.onStep.fire"]
            }
        },
        selectors: {
            stepButton: ".c2lc-interpreterControls-step"
        },
        markup: {
            controls: "<button class='c2lc-interpreterControls-step'>Step</button>"
        }
    });

})();
