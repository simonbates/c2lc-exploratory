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

    fluid.defaults("c2lc.tests.interpreterWithIncrement", {
        gradeNames: "c2lc.interpreter",
        actions: {
            "increment-x": "{that}.incrementXHandler"
        },
        components: {
            incrementXHandler: {
                type: "c2lc.actions.increment",
                options: {
                    modelPath: "x"
                }
            }
        }
    });

    jqUnit.module("Interpreter Tests");

    jqUnit.test("Default interpreter has an empty program", function () {
        jqUnit.expect(2);
        var interpreter = c2lc.interpreter();
        jqUnit.assertEquals("Program has length 0", 0, interpreter.model.program.length);
        jqUnit.assertEquals("Program counter is 0", 0, interpreter.model.programCounter);
    });

    jqUnit.test("Stepping an empty program leaves the program counter at 0", function () {
        jqUnit.expect(2);
        var interpreter = c2lc.interpreter();
        jqUnit.assertEquals("Program counter is initially 0", 0, interpreter.model.programCounter);
        interpreter.step();
        jqUnit.assertEquals("Program counter at 0 after step", 0, interpreter.model.programCounter);
    });

    jqUnit.test("Step a program with 1 action", function () {
        jqUnit.expect(5);

        var interpreter = c2lc.tests.interpreterWithIncrement({
            model: {
                program: ["increment-x"],
                x: 10
            }
        });

        jqUnit.assertEquals("Program counter is initially 0", 0, interpreter.model.programCounter);
        jqUnit.assertEquals("x is initially 10", 10, interpreter.model.x);
        interpreter.step();
        jqUnit.assertEquals("Program counter is 1 after step", 1, interpreter.model.programCounter);
        jqUnit.assertEquals("x is 11 after step", 11, interpreter.model.x);
        // Test step at end of program
        interpreter.step();
        jqUnit.assertEquals("Program counter remains at 1 after step at end of program", 1, interpreter.model.programCounter);
    });

    jqUnit.test("Step a program with 2 actions", function () {
        jqUnit.expect(7);

        var interpreter = c2lc.tests.interpreterWithIncrement({
            model: {
                program: ["increment-x", "increment-x"],
                x: 10
            }
        });

        jqUnit.assertEquals("Program counter is initially 0", 0, interpreter.model.programCounter);
        jqUnit.assertEquals("x is initially 10", 10, interpreter.model.x);
        interpreter.step();
        jqUnit.assertEquals("Program counter is 1 after step", 1, interpreter.model.programCounter);
        jqUnit.assertEquals("x is 11 after step", 11, interpreter.model.x);
        interpreter.step();
        jqUnit.assertEquals("Program counter is 2 after step", 2, interpreter.model.programCounter);
        jqUnit.assertEquals("x is 12 after step", 12, interpreter.model.x);
        // Test step at end of program
        interpreter.step();
        jqUnit.assertEquals("Program counter remains at 2 after step at end of program", 2, interpreter.model.programCounter);
    });

    jqUnit.test("Step a program with an unknown action", function () {
        jqUnit.expect(1);

        var interpreter = c2lc.interpreter({
            model: {
                program: ["unknown-action"]
            }
        });

        try {
            interpreter.step();
            jqUnit.fail("Exception should have been thrown");
        } catch (e) {
            jqUnit.assertEquals("Exception expected", "Unknown action: unknown-action", e.message);
        }
    });

})();
