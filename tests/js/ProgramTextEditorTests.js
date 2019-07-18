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

    fluid.defaults("c2lc.tests.programTextEditorTestTree", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            programTextEditor: {
                type: "c2lc.programTextEditor",
                container: ".c2lc-textEditor",
                options: {
                    model: {
                        program: ["foo", "bar", "baz"]
                    },
                    components: {
                        syntax: {
                            type: "c2lc.textSyntax"
                        }
                    }
                }
            },
            programTextEditorTester: {
                type: "c2lc.tests.programTextEditorTester"
            }
        }
    });

    fluid.defaults("c2lc.tests.programTextEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Program Text Editor Tests",
            tests: [
                {
                    expect: 2,
                    name: "Label is connected to textarea",
                    sequence: [
                        {
                            funcName: "c2lc.tests.checkLabelConnectedToTextarea",
                            args: [
                                "{programTextEditor}.dom.label",
                                "{programTextEditor}.dom.textarea"
                            ]
                        }
                    ]
                },
                {
                    expect: 1,
                    name: "Check initial text contents",
                    sequence: [
                        {
                            funcName: "c2lc.tests.checkTextEditorContents",
                            args: [
                                "foo bar baz",
                                "{programTextEditor}.dom.textarea"
                            ]
                        }
                    ]
                },
                {
                    expect: 1,
                    name: "Text editor is updated on model change",
                    sequence: [
                        {
                            func: "{programTextEditor}.applier.change",
                            args: ["program", ["hello", "world"]]
                        },
                        {
                            funcName: "c2lc.tests.checkTextEditorContents",
                            args: [
                                "hello world",
                                "{programTextEditor}.dom.textarea"
                            ]
                        }
                    ]
                },
                {
                    expect: 1,
                    name: "Program model is updated on text change",
                    sequence: [
                        {
                            funcName: "c2lc.tests.setTextEditorContents",
                            args: [
                                "{programTextEditor}.dom.textarea",
                                " a  b   c "
                            ]
                        },
                        {
                            changeEvent: "{programTextEditor}.applier.modelChanged",
                            path: "program",
                            listener: "jqUnit.assertDeepEq",
                            args: [
                                "Program model updated",
                                ["a", "b", "c"],
                                "{programTextEditor}.model.program"
                            ]
                        }
                    ]
                }
            ]
        }]
    });

    c2lc.tests.checkLabelConnectedToTextarea = function (label, textarea) {
        var textareaId = fluid.getId(textarea);
        jqUnit.assertTrue("The textarea has a truthy id", textareaId);
        jqUnit.assertEquals("The label 'for' matches the textarea id",
            textareaId, label.attr("for"));
    };

    c2lc.tests.checkTextEditorContents = function (expected, textarea) {
        jqUnit.assertEquals("Text editor contents", expected, textarea.val());
    };

    c2lc.tests.setTextEditorContents = function (textarea, text) {
        textarea.val(text);
        textarea.trigger("change");
    };

})();
