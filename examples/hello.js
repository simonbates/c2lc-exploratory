/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

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
