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

    fluid.defaults("c2lc.objectMethodActionHandler", {
        gradeNames: "c2lc.actionHandler",
        members: {
            targetObject: null // To be provided
        },
        method: null, // To be provided
        args: [],
        invokers: {
            handleAction: {
                funcName: "c2lc.objectMethodActionHandler.handleAction",
                args: [
                    "{that}.targetObject",
                    "{that}.options.method",
                    "{that}.options.args"
                ]
            }
        }
    });

    c2lc.objectMethodActionHandler.handleAction = function (targetObject, method, args) {
        // TODO: Catch exceptions and reject promise
        var togo = fluid.promise();
        targetObject[method].apply(targetObject, args);
        togo.resolve();
        return togo;
    };

})();
