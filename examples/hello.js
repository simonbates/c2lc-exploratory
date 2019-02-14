/* eslint-env node */

"use strict";

var fluid = require("infusion");

require("../src/Interpreter.js");
require("../src/Actions.js");

var c2lc = fluid.registerNamespace("c2lc");

var interpreter = c2lc.interpreter({
    model: {
        program: ["hello", "world"]
    },
    actions: {
        "hello": "{that}.helloHandler",
        "world": "{that}.worldHandler"
    },
    components: {
        helloHandler: {
            type: "c2lc.actions.log",
            options: {
                message: "hello"
            }
        },
        worldHandler: {
            type: "c2lc.actions.log",
            options: {
                message: "world"
            }
        }
    }
});

interpreter.step();
interpreter.step();
