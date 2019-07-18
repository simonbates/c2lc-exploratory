/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* global Handlebars */

// TODO: Put the template into a "handlebars" file and precompile

(function () {

    "use strict";

    var templates = fluid.registerNamespace("c2lc.templates");

    templates.programTextEditor = Handlebars.compile(
        "<label class='c2lc-programTextEditor-label'" +
        "    for='{{textareaId}}'>Program:</label>" +
        "<textarea class='c2lc-programTextEditor-textarea'" +
        "    id='{{textareaId}}' cols='40' rows='4'></textarea>" +
        "<div class='c2lc-programTextEditor-instructions'>" +
        "    Available actions: forward, left, right.<br>" +
        "    Write your program actions in the box above and separate them " +
        "    by spaces. For example, to draw a square, use: " +
        "    forward left forward left forward left forward left" +
        "</div>"
    );

})();
