/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* global jqUnit */

(function () {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    fluid.defaults("c2lc.tests.turtleGraphicsTestTree", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            turtleGraphics: {
                type: "c2lc.turtleGraphics",
                container: ".c2lc-graphics"
            },
            turtleGraphicsTester: {
                type: "c2lc.tests.turtleGraphicsTester"
            }
        }
    });

    fluid.defaults("c2lc.tests.turtleGraphicsTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Turtle Graphics Tests",
            tests: [
                {
                    expect: 18,
                    name: "Check turtle motion",
                    sequence: [
                        {
                            funcName: "c2lc.tests.checkTurtle",
                            args: [0, 0, 0, "{turtleGraphics}"]
                        },
                        {
                            func: "{turtleGraphics}.forward",
                            args: [10]
                        },
                        {
                            changeEvent: "{turtleGraphics}.applier.modelChanged",
                            path: "location",
                            listener: "c2lc.tests.checkTurtle",
                            args: [0, -10, 0, "{turtleGraphics}"]
                        },
                        {
                            func: "{turtleGraphics}.left",
                            args: [90]
                        },
                        {
                            changeEvent: "{turtleGraphics}.applier.modelChanged",
                            path: "directionDegrees",
                            listener: "c2lc.tests.checkTurtle",
                            args: [0, -10, 270, "{turtleGraphics}"]
                        },
                        {
                            func: "{turtleGraphics}.forward",
                            args: [10]
                        },
                        {
                            changeEvent: "{turtleGraphics}.applier.modelChanged",
                            path: "location",
                            listener: "c2lc.tests.checkTurtle",
                            args: [-10, -10, 270, "{turtleGraphics}"]
                        },
                        {
                            func: "{turtleGraphics}.right",
                            args: [90]
                        },
                        {
                            changeEvent: "{turtleGraphics}.applier.modelChanged",
                            path: "directionDegrees",
                            listener: "c2lc.tests.checkTurtle",
                            args: [-10, -10, 0, "{turtleGraphics}"]
                        },
                        {
                            func: "{turtleGraphics}.forward",
                            args: [10]
                        },
                        {
                            changeEvent: "{turtleGraphics}.applier.modelChanged",
                            path: "location",
                            listener: "c2lc.tests.checkTurtle",
                            args: [-10, -20, 0, "{turtleGraphics}"]
                        }
                    ]
                }
            ]
        }]
    });

    c2lc.tests.checkTurtle = function (expectedX, expectedY, expectedDirection, turtleGraphics) {
        jqUnit.assertEquals("location x", expectedX, turtleGraphics.model.location.x);
        jqUnit.assertEquals("location y", expectedY, turtleGraphics.model.location.y);
        jqUnit.assertEquals("direction", expectedDirection, turtleGraphics.model.directionDegrees);
    };

})();
