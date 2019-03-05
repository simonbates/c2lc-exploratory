/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

(function () {

    "use strict";

    var textSyntax = fluid.registerNamespace("c2lc.textSyntax");

    textSyntax.read = function (text) {
        if (text.trim().length === 0) {
            return [];
        }
        return text.trim().split(/\s+/);
    };

    textSyntax.print = function (program) {
        return program.join(" ");
    };

})();
