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

    fluid.defaults("c2lc.tests.incrementAsync", {
        gradeNames: "c2lc.actionHandler",
        modelPath: null, // To be provided
        invokers: {
            handleAction: {
                funcName: "c2lc.tests.incrementAsync.handleAction",
                args: [
                    "{arguments}.0", // interpreter
                    "{that}.options.modelPath"
                ]
            }
        }
    });

    c2lc.tests.incrementAsync.handleAction = function (interpreter, modelPath) {
        var togo = fluid.promise();
        setTimeout(function () {
            interpreter.applier.change(modelPath, fluid.get(interpreter.model, modelPath) + 1);
            togo.resolve();
        }, 0);
        return togo;
    };

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

    jqUnit.asyncTest("Stepping an empty program leaves the program counter at 0", function () {
        jqUnit.expect(2);
        var interpreter = c2lc.interpreter();
        jqUnit.assertEquals("Program counter is initially 0", 0, interpreter.model.programCounter);
        interpreter.step().then(function () {
            jqUnit.assertEquals("Program counter at 0 after step", 0, interpreter.model.programCounter);
            jqUnit.start();
        });
    });

    jqUnit.asyncTest("Run an empty program", function () {
        jqUnit.expect(1);
        var interpreter = c2lc.interpreter();
        interpreter.run().then(function () {
            jqUnit.assertFalse("Program has stopped running",
                interpreter.model.isRunning);
            jqUnit.start();
        });
    });

    jqUnit.asyncTest("Step a program with 1 action", function () {
        jqUnit.expect(5);

        var interpreter = c2lc.tests.interpreterWithIncrement({
            model: {
                program: ["increment-x"],
                x: 10
            }
        });

        jqUnit.assertEquals("Program counter is initially 0", 0, interpreter.model.programCounter);
        jqUnit.assertEquals("x is initially 10", 10, interpreter.model.x);
        interpreter.step().then(function () {
            jqUnit.assertEquals("Program counter is 1 after step", 1, interpreter.model.programCounter);
            jqUnit.assertEquals("x is 11 after step", 11, interpreter.model.x);
            // Test step at end of program
            interpreter.step().then(function () {
                jqUnit.assertEquals("Program counter remains at 1 after step at end of program", 1, interpreter.model.programCounter);
                jqUnit.start();
            });
        });
    });

    jqUnit.asyncTest("Run a program with 1 action", function () {
        jqUnit.expect(2);

        var interpreter = c2lc.tests.interpreterWithIncrement({
            model: {
                program: ["increment-x"],
                x: 10
            }
        });

        interpreter.run().then(function () {
            jqUnit.assertFalse("Program has stopped running",
                interpreter.model.isRunning);
            jqUnit.assertEquals("x is 11 after run", 11, interpreter.model.x);
            jqUnit.start();
        });
    });

    jqUnit.asyncTest("Step a program with 2 actions", function () {
        jqUnit.expect(7);

        var interpreter = c2lc.tests.interpreterWithIncrement({
            model: {
                program: ["increment-x", "increment-x"],
                x: 10
            }
        });

        jqUnit.assertEquals("Program counter is initially 0", 0, interpreter.model.programCounter);
        jqUnit.assertEquals("x is initially 10", 10, interpreter.model.x);
        interpreter.step().then(function () {
            jqUnit.assertEquals("Program counter is 1 after step", 1, interpreter.model.programCounter);
            jqUnit.assertEquals("x is 11 after step", 11, interpreter.model.x);
            interpreter.step().then(function () {
                jqUnit.assertEquals("Program counter is 2 after step", 2, interpreter.model.programCounter);
                jqUnit.assertEquals("x is 12 after step", 12, interpreter.model.x);
                // Test step at end of program
                interpreter.step().then(function () {
                    jqUnit.assertEquals("Program counter remains at 2 after step at end of program", 2, interpreter.model.programCounter);
                    jqUnit.start();
                });
            });
        });
    });

    jqUnit.asyncTest("Step a program with 2 actionHandlers", function () {
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
        interpreter.step().then(function () {
            jqUnit.assertEquals("Program counter is 1 after step", 1, interpreter.model.programCounter);
            jqUnit.assertEquals("x is 11 after step", 11, interpreter.model.x);
            jqUnit.assertEquals("y is 21 after step", 21, interpreter.model.y);
            jqUnit.start();
        });
    });

    jqUnit.asyncTest("Run program with mix of sync and async actionHandlers", function () {
        jqUnit.expect(8);

        var interpreter = c2lc.interpreter({
            model: {
                program: ["increment", "increment", "increment"],
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
                    type: "c2lc.tests.incrementAsync",
                    options: {
                        modelPath: "y"
                    }
                }
            },
            modelListeners: {
                programCounter: {
                    funcName: "c2lc.tests.checkInterpreterModelAtStep",
                    args: [
                        "{change}.value",
                        {
                            0: {
                                x: 10,
                                y: 20
                            },
                            1: {
                                x: 11,
                                y: 21
                            },
                            2: {
                                x: 12,
                                y: 22
                            },
                            3: {
                                x: 13,
                                y: 23
                            }
                        },
                        "{that}.model"
                    ]
                }
            }
        });

        interpreter.run().then(function () {
            jqUnit.assertFalse("Program has stopped running",
                interpreter.model.isRunning);
            jqUnit.assertEquals("Program counter is 3 after run", 3,
                interpreter.model.programCounter);
            jqUnit.assertEquals("x is 13 after run", 13, interpreter.model.x);
            jqUnit.assertEquals("y is 23 after run", 23, interpreter.model.y);
            jqUnit.start();
        });
    });

    c2lc.tests.checkInterpreterModelAtStep = function (programCounter, expectedModels, actualModel) {
        jqUnit.assertLeftHand("Check interpreter model",
            expectedModels[programCounter],
            actualModel);
    };

    jqUnit.asyncTest("Step a program with an unknown action", function () {
        jqUnit.expect(1);

        var interpreter = c2lc.interpreter({
            model: {
                program: ["unknown-action"]
            }
        });

        interpreter.step().then(function () {
            jqUnit.fail("Promise should have been rejected");
            jqUnit.start();
        }, function (e) {
            jqUnit.assertEquals("Promise rejection expected", "Unknown action: unknown-action", e.message);
            jqUnit.start();
        });
    });

})();
