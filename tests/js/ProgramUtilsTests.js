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
    fluid.registerNamespace("c2lc.tests");

    c2lc.tests.checkProgramEdit = function (inputBefore, expected, inputAfter, result) {
        jqUnit.assertEquals("Input length not changed", inputBefore.length,
            inputAfter.length);
        jqUnit.assertDeepEq("Input content not changed", inputBefore, inputAfter);
        jqUnit.assertEquals("Expected length", expected.length, result.length);
        jqUnit.assertDeepEq("Expected content", expected, result);
    };

    jqUnit.module("Program Utils Tests");

    jqUnit.test("c2lc.programUtils.deleteStep", function () {
        jqUnit.expect(28);

        var testCases = [
            { input: [], index: 0, expected: [] },
            { input: [], index: 2, expected: [] },
            { input: ["foo"], index: 0, expected: [] },
            { input: ["foo"], index: 1, expected: ["foo"] },
            { input: ["foo"], index: 2, expected: ["foo"] },
            { input: ["foo", "bar", "baz"], index: 0, expected: ["bar", "baz"] },
            { input: ["foo", "bar", "baz"], index: 1, expected: ["foo", "baz"] }
        ];

        fluid.each(testCases, function (testCase) {
            var input = fluid.makeArray(testCase.input);
            var result = c2lc.programUtils.deleteStep(input, testCase.index);
            c2lc.tests.checkProgramEdit(testCase.input, testCase.expected,
                input, result);
        });
    });

    jqUnit.test("c2lc.programUtils.expandProgram", function () {
        jqUnit.expect(28);

        var testCases = [
            { input: [], length: 0, expected: [] },
            { input: [], length: 1, expected: ["fill1"] },
            { input: [], length: 2, expected: ["fill1", "fill1"] },
            { input: ["foo"], length: 0, expected: ["foo"] },
            { input: ["foo"], length: 1, expected: ["foo"] },
            { input: ["foo"], length: 2, expected: ["foo", "fill1"] },
            { input: ["foo"], length: 3, expected: ["foo", "fill1", "fill1"] }
        ];

        fluid.each(testCases, function (testCase) {
            var input = fluid.makeArray(testCase.input);
            var result = c2lc.programUtils.expandProgram(input,
                testCase.length, "fill1");
            c2lc.tests.checkProgramEdit(testCase.input, testCase.expected,
                input, result);
        });
    });

    jqUnit.test("c2lc.programUtils.insert", function () {
        jqUnit.expect(24);

        var testCases = [
            { input: [], index: 0, expected: ["action1"] },
            { input: [], index: 2, expected: ["fill1", "fill1", "action1"] },
            { input: ["foo"], index: 0, expected: ["action1", "foo"] },
            { input: ["foo"], index: 1, expected: ["foo", "action1"] },
            { input: ["foo"], index: 2, expected: ["foo", "fill1", "action1"] },
            { input: ["foo", "bar"], index: 1, expected: ["foo", "action1", "bar"] }
        ];

        fluid.each(testCases, function (testCase) {
            var input = fluid.makeArray(testCase.input);
            var result = c2lc.programUtils.insert(input, testCase.index,
                "action1", "fill1");
            c2lc.tests.checkProgramEdit(testCase.input, testCase.expected,
                input, result);
        });
    });

    jqUnit.test("c2lc.programUtils.overwrite", function () {
        jqUnit.expect(24);

        var testCases = [
            { input: [], index: 0, expected: ["action1"] },
            { input: [], index: 2, expected: ["fill1", "fill1", "action1"] },
            { input: ["foo"], index: 0, expected: ["action1"] },
            { input: ["foo"], index: 1, expected: ["foo", "action1"] },
            { input: ["foo"], index: 2, expected: ["foo", "fill1", "action1"] },
            { input: ["foo", "bar", "baz"], index: 1, expected: ["foo", "action1", "baz"] }
        ];

        fluid.each(testCases, function (testCase) {
            var input = fluid.makeArray(testCase.input);
            var result = c2lc.programUtils.overwrite(input, testCase.index,
                "action1", "fill1");
            c2lc.tests.checkProgramEdit(testCase.input, testCase.expected,
                input, result);
        });
    });

    jqUnit.test("c2lc.programUtils.trimEnd", function () {
        jqUnit.expect(28);

        var testCases = [
            { input: [], expected: [] },
            { input: ["foo"], expected: ["foo"] },
            { input: ["trim1"], expected: [] },
            { input: ["foo", "trim1"], expected: ["foo"] },
            { input: ["trim1", "trim1"], expected: [] },
            { input: ["trim1", "foo"], expected: ["trim1", "foo"] },
            { input: ["trim1", "foo", "trim1"], expected: ["trim1", "foo"] }
        ];

        fluid.each(testCases, function (testCase) {
            var input = fluid.makeArray(testCase.input);
            var result = c2lc.programUtils.trimEnd(input, "trim1");
            c2lc.tests.checkProgramEdit(testCase.input, testCase.expected,
                input, result);
        });
    });

})();
