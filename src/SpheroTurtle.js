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

    fluid.defaults("c2lc.spheroTurtle", {
        gradeNames: "fluid.modelComponent",
        model: {
            connectionState: "{spheroDriver}.model.connectionState",
            headingDegrees: 0
        },
        invokers: {
            connect: {
                func: "{spheroDriver}.connect"
            },
            forward: {
                func: "{spheroDriver}.roll",
                args: [0x20, "{that}.model.headingDegrees"]
            },
            left: {
                funcName: "c2lc.spheroTurtle.left",
                args: [
                    "{that}",
                    "{arguments}.0" // amountDegrees
                ]
            },
            right: {
                funcName: "c2lc.spheroTurtle.right",
                args: [
                    "{that}",
                    "{arguments}.0" // amountDegrees
                ]
            }
        },
        components: {
            spheroDriver: {
                type: "c2lc.spheroDriver"
            }
        }
    });

    c2lc.spheroTurtle.left = function (spheroTurtle, amountDegrees) {
        spheroTurtle.applier.change("headingDegrees", c2lc.math.wrap(0, 360, spheroTurtle.model.headingDegrees - amountDegrees));
        return spheroTurtle.spheroDriver.roll(0, spheroTurtle.model.headingDegrees);
    };

    c2lc.spheroTurtle.right = function (spheroTurtle, amountDegrees) {
        spheroTurtle.applier.change("headingDegrees", c2lc.math.wrap(0, 360, spheroTurtle.model.headingDegrees + amountDegrees));
        return spheroTurtle.spheroDriver.roll(0, spheroTurtle.model.headingDegrees);
    };

})();
