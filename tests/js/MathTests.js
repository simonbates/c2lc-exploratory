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

    jqUnit.module("Math Tests");

    jqUnit.test("c2lc.math.wrap", function () {
        jqUnit.expect(18);

        // [0, 10]

        jqUnit.assertEquals("(0, 10, 0)",   0, c2lc.math.wrap(0, 10, 0));
        jqUnit.assertEquals("(0, 10, 10)",  0, c2lc.math.wrap(0, 10, 10));
        jqUnit.assertEquals("(0, 10, 8)",   8, c2lc.math.wrap(0, 10, 8));
        jqUnit.assertEquals("(0, 10, 12)",  2, c2lc.math.wrap(0, 10, 12));
        jqUnit.assertEquals("(0, 10, 20)",  0, c2lc.math.wrap(0, 10, 20));
        jqUnit.assertEquals("(0, 10, 23)",  3, c2lc.math.wrap(0, 10, 23));
        jqUnit.assertEquals("(0, 10, -2)",  8, c2lc.math.wrap(0, 10, -2));
        jqUnit.assertEquals("(0, 10, -10)", 0, c2lc.math.wrap(0, 10, -10));
        jqUnit.assertEquals("(0, 10, -13)", 7, c2lc.math.wrap(0, 10, -13));

        // [-20, -10]

        jqUnit.assertEquals("(-20, -10, -20)", -20, c2lc.math.wrap(-20, -10, -20));
        jqUnit.assertEquals("(-20, -10, -10)", -20, c2lc.math.wrap(-20, -10, -10));
        jqUnit.assertEquals("(-20, -10, -12)", -12, c2lc.math.wrap(-20, -10, -12));
        jqUnit.assertEquals("(-20, -10, -8)",  -18, c2lc.math.wrap(-20, -10, -8));
        jqUnit.assertEquals("(-20, -10, 0)",   -20, c2lc.math.wrap(-20, -10, 0));
        jqUnit.assertEquals("(-20, -10, 13)",  -17, c2lc.math.wrap(-20, -10, 13));
        jqUnit.assertEquals("(-20, -10, -22)", -12, c2lc.math.wrap(-20, -10, -22));
        jqUnit.assertEquals("(-20, -10, -30)", -20, c2lc.math.wrap(-20, -10, -30));
        jqUnit.assertEquals("(-20, -10, -33)", -13, c2lc.math.wrap(-20, -10, -33));
    });

})();
