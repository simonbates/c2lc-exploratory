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

    fluid.defaults("c2lc.actionHandler", {
        gradeNames: "fluid.component",
        invokers: {
            handleAction: "fluid.notImplemented"
                // Params: interpreter
                // Returns: May optionally return a Promise if the action is asynchronous
        }
    });

    fluid.defaults("c2lc.interpreter", {
        gradeNames: "fluid.modelComponent",
        actions: {},
        model: {
            program: [],
            programCounter: 0,
            isRunning: false
        },
        invokers: {
            reset: {
                funcName: "c2lc.interpreter.reset",
                args: "{that}"
            },
            run: {
                funcName: "c2lc.interpreter.startRun",
                args: "{that}"
                // Returns: Promise
            },
            step: {
                funcName: "c2lc.interpreter.step",
                args: "{that}"
                // Returns: Promise
            }
        },
        events: {
            onStart: null
        },
        modelListeners: {
            program: {
                func: "{that}.reset"
            }
        }
    });

    c2lc.interpreter.reset = function (interpreter) {
        interpreter.applier.change("isRunning", false);
        interpreter.applier.change("programCounter", 0);
    };

    c2lc.interpreter.atEnd = function (interpreter) {
        return interpreter.model.programCounter >= interpreter.model.program.length;
    };

    c2lc.interpreter.startRun = function (interpreter) {
        var togo = fluid.promise();
        c2lc.interpreter.reset(interpreter);
        interpreter.applier.change("isRunning", true);
        c2lc.interpreter.continueRun(interpreter, togo);
        return togo;
    };

    c2lc.interpreter.continueRun = function (interpreter, runPromise) {
        if (interpreter.model.isRunning) {
            if (c2lc.interpreter.atEnd(interpreter)) {
                interpreter.applier.change("isRunning", false);
                runPromise.resolve();
            } else {
                c2lc.interpreter.step(interpreter).then(function () {
                    c2lc.interpreter.continueRun(interpreter, runPromise);
                });
            }
        } else  {
            runPromise.resolve();
        }
    };

    // Returns: A Promise representing completion of the step
    c2lc.interpreter.step = function (interpreter) {
        var togo = fluid.promise();
        if (c2lc.interpreter.atEnd(interpreter)) {
            // We're at the end, nothing to do
            togo.resolve();
        } else {
            if (interpreter.model.programCounter === 0) {
                interpreter.events.onStart.fire();
            }
            var action = interpreter.model.program[interpreter.model.programCounter];
            var actionHandlers = c2lc.interpreter.lookUpActionHandlers(interpreter, action);
            if (actionHandlers.length === 0) {
                // Unknown action
                togo.reject(new Error("Unknown action: " + action));
            } else {
                // When the action handlers have completed,
                // increment the programCounter and resolve the step Promise
                c2lc.interpreter.callActionHandlers(interpreter, actionHandlers).then(function () {
                    interpreter.applier.change("programCounter", interpreter.model.programCounter + 1);
                    togo.resolve();
                }, function (error) {
                    console.log(error.name);
                    console.log(error.message);
                    togo.reject(error);
                });
            }
        }
        return togo;
    };

    c2lc.interpreter.lookUpActionHandlers = function (interpreter, action) {
        // Do a simple linear search through options.actions.
        // We can change to something faster if needed (such as processing
        // options.actions at onCreate and building a structure optimized for
        // lookup). If I process options.actions at onCreate I could also catch
        // bad action keys sooner.
        var actionHandlers = [];
        fluid.each(interpreter.options.actions, function (actionHandler, actionKey) {
            if (c2lc.interpreter.parseActionKey(actionKey).actionName === action) {
                actionHandlers.push(actionHandler);
            }
        });
        return actionHandlers;
    };

    c2lc.interpreter.parseActionKey = function (actionKey) {
        if (actionKey.trim().length === 0) {
            throw new Error("Empty action key not allowed");
        }

        var parts = actionKey.trim().split(".");

        if (parts.length === 1) {
            return {
                actionName: parts[0],
                namespace: undefined
            };
        } else if (parts.length === 2) {
            return {
                actionName: parts[0],
                namespace: parts[1]
            };
        }

        throw new Error("Bad action key: " + actionKey);
    };

    // Returns: A Promise representing the completion of all of the
    // action handlers
    c2lc.interpreter.callActionHandlers = function (interpreter, actionHandlers) {
        var actionValues = [];
        fluid.each(actionHandlers, function (actionHandler) {
            actionValues.push(actionHandler.handleAction(interpreter));
        });
        return fluid.promise.sequence(actionValues);
    };

})();
