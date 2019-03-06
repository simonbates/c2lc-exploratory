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

    fluid.defaults("c2lc.textSyntax", {
        gradeNames: "fluid.component",
        invokers: {
            read: {
                funcName: "c2lc.textSyntax.read",
                args: ["{arguments}.0"] // text
            },
            print: {
                funcName: "c2lc.textSyntax.print",
                args: ["{arguments}.0"] // program
            }
        }
    });

    c2lc.textSyntax.read = function (text) {
        if (text.trim().length === 0) {
            return [];
        }
        return text.trim().split(/\s+/);
    };

    c2lc.textSyntax.print = function (program) {
        return program.join(" ");
    };

})();
