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

    jqUnit.test("c2lc.interpreter.parseActionKey", function () {
        jqUnit.expect(4);

        jqUnit.assertDeepEq("Non-namespaced action name", {
            actionName: "foo",
            namespace: undefined
        }, c2lc.interpreter.parseActionKey("foo"));

        jqUnit.assertDeepEq("Namespaced action", {
            actionName: "foo",
            namespace: "bar"
        }, c2lc.interpreter.parseActionKey("foo.bar"));

        try {
            c2lc.interpreter.parseActionKey("");
            jqUnit.fail("Exception should have been thrown");
        } catch (e) {
            jqUnit.assertEquals("Empty action key", "Empty action key not allowed", e.message);
        }

        try {
            c2lc.interpreter.parseActionKey("foo.bar.baz");
            jqUnit.fail("Exception should have been thrown");
        } catch (e) {
            jqUnit.assertEquals("Too many identifiers", "Bad action key: foo.bar.baz", e.message);
        }
    });

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

    jqUnit.test("Step a program with 2 actionHandlers", function () {
        jqUnit.expect(6);

        var interpreter = c2lc.interpreter({
            model: {
                program: ["increment"],
                x: 10,
                y: 20
            },
            actions: {
                "increment.x": "{that}.incrementXHandler",
                "increment.y": "{that}.incrementYHandler"
            },
            components: {
                incrementXHandler: {
                    type: "c2lc.actions.increment",
                    options: {
                        modelPath: "x"
                    }
                },
                incrementYHandler: {
                    type: "c2lc.actions.increment",
                    options: {
                        modelPath: "y"
                    }
                }
            }
        });

        jqUnit.assertEquals("Program counter is initially 0", 0, interpreter.model.programCounter);
        jqUnit.assertEquals("x is initially 10", 10, interpreter.model.x);
        jqUnit.assertEquals("y is initially 20", 20, interpreter.model.y);
        interpreter.step();
        jqUnit.assertEquals("Program counter is 1 after step", 1, interpreter.model.programCounter);
        jqUnit.assertEquals("x is 11 after step", 11, interpreter.model.x);
        jqUnit.assertEquals("y is 21 after step", 21, interpreter.model.y);
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
