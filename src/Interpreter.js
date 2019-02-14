var fluid = fluid || require("infusion"); // eslint-disable-line no-undef
var jQuery = fluid.registerNamespace("jQuery");

(function ($, fluid) {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    fluid.defaults("c2lc.actionHandler", {
        gradeNames: "fluid.component",
        invokers: {
            handleAction: "fluid.notImplemented"
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
            step: {
                funcName: "c2lc.interpreter.step",
                args: "{that}"
            }
        }
    });

    c2lc.interpreter.step = function (interpreter) {
        if (interpreter.model.programCounter < interpreter.model.program.length) {
            var action = interpreter.model.program[interpreter.model.programCounter];
            var actionHandler = interpreter.options.actions[action];
            if (actionHandler) {
                actionHandler.handleAction(interpreter);
                interpreter.applier.change("programCounter", interpreter.model.programCounter + 1);
            }
            // TODO: Complain, unknown action
        }
    };

})(jQuery, fluid);
