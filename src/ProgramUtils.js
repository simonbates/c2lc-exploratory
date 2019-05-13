/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* global c2lc */

(function () {

    "use strict";

    var programUtils = fluid.registerNamespace("c2lc.programUtils");

    programUtils.deleteStep = function (program, index) {
        program = fluid.makeArray(program);
        program.splice(index, 1);
        return program;
    };

    programUtils.expandProgram = function (program, length, fill) {
        program = fluid.makeArray(program);
        while (program.length < length) {
            program.push(fill);
        }
        return program;
    };

    programUtils.insert = function (program, index, action, fill) {
        program = c2lc.programUtils.expandProgram(program, index, fill);
        program.splice(index, 0, action);
        return program;
    };

    programUtils.overwrite = function (program, index, action, fill) {
        program = c2lc.programUtils.expandProgram(program, index + 1, fill);
        program[index] = action;
        return program;
    };

    programUtils.trimEnd = function (program, action) {
        program = fluid.makeArray(program);
        while ((program.length > 0)
            && (program[program.length - 1] === action)) {
            program.pop();
        }
        return program;
    };

})();
