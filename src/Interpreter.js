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
        }
    });

    fluid.defaults("c2lc.interpreter", {
        gradeNames: "fluid.modelComponent",
        actions: {},
        model: {
            program: [],
            programCounter: 0
        },
        invokers: {
            reset: {
                funcName: "c2lc.interpreter.reset",
                args: "{that}"
            },
            step: {
                funcName: "c2lc.interpreter.step",
                args: "{that}"
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
        interpreter.applier.change("programCounter", 0);
    };

    c2lc.interpreter.step = function (interpreter) {
        if (interpreter.model.programCounter < interpreter.model.program.length) {
            if (interpreter.model.programCounter === 0) {
                interpreter.events.onStart.fire();
            }
            var action = interpreter.model.program[interpreter.model.programCounter];
            var actionHandlers = c2lc.interpreter.lookUpActionHandlers(interpreter, action);
            if (actionHandlers.length === 0) {
                throw new Error("Unknown action: " + action);
            } else {
                c2lc.interpreter.callActionHandlers(interpreter, actionHandlers);
                interpreter.applier.change("programCounter", interpreter.model.programCounter + 1);
            }
        }
    };

    c2lc.interpreter.lookUpActionHandlers = function (interpreter, action) {
        // Simple linear search, we can change to something faster if needed
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

    c2lc.interpreter.callActionHandlers = function (interpreter, actionHandlers) {
        fluid.each(actionHandlers, function (actionHandler) {
            actionHandler.handleAction(interpreter);
        });
    };

})();
