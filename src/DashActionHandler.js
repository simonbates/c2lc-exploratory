/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

(function () {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    fluid.defaults("c2lc.dashActionHandler", {
        gradeNames: "c2lc.actionHandler",
        operation: null, // To be provided
        components: {
            dashDriver: null // To be provided
        },
        invokers: {
            handleAction: {
                funcName: "c2lc.dashActionHandler.handleAction",
                args: ["{that}"]
            }
        }
    });

    c2lc.dashActionHandler.handleAction = function (actionHandler) {
        if (actionHandler.dashDriver.model.connectionState === "connected") {
            actionHandler.dashDriver[actionHandler.options.operation].apply();
        }
    };

})();
