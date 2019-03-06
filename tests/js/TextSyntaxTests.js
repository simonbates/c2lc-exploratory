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

    jqUnit.module("Text Syntax Tests");

    jqUnit.test("Read", function () {
        jqUnit.expect(4);
        var syntax = c2lc.textSyntax();
        jqUnit.assertDeepEq("Empty string", [], syntax.read(""));
        jqUnit.assertDeepEq("Single word", ["foo"], syntax.read("foo"));
        jqUnit.assertDeepEq("Single word with whitespace",
            ["foo"],
            syntax.read("  foo  "));
        jqUnit.assertDeepEq("Multiple words",
            ["foo", "bar", "baz"],
            syntax.read(" foo  bar   baz "));
    });

    jqUnit.test("Print", function () {
        jqUnit.expect(3);
        var syntax = c2lc.textSyntax();
        jqUnit.assertEquals("Empty program", "", syntax.print([]));
        jqUnit.assertEquals("Single action",
            "foo",
            syntax.print(["foo"]));
        jqUnit.assertEquals("Multiple actions",
            "foo bar baz",
            syntax.print(["foo", "bar", "baz"]));
    });

})();
