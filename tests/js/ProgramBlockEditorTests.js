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

    fluid.defaults("c2lc.tests.programBlockEditorTestTree", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            programBlockEditor: {
                type: "c2lc.programBlockEditor",
                container: ".c2lc-blockEditor",
                options: {
                    model: {
                        program: []
                    },
                    minVisibleProgramSteps: 4
                }
            },
            programBlockEditorTester: {
                type: "c2lc.tests.programBlockEditorTester"
            }
        }
    });

    fluid.defaults("c2lc.tests.programBlockEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Program Block Editor Tests",
            tests: [
                {
                    expect: 74,
                    name: "Check program block rendering",
                    sequence: [
                        // An empty program initially
                        // Check minVisibleProgramSteps are rendered
                        {
                            funcName: "c2lc.tests.checkProgramBlocks",
                            args: [
                                [
                                    { index: 0, action: "none", label: "None" },
                                    { index: 1, action: "none", label: "None" },
                                    { index: 2, action: "none", label: "None" },
                                    { index: 3, action: "none", label: "None" }
                                ],
                                "{programBlockEditor}.dom.programBlocks"
                            ]
                        },
                        // Program with a single action
                        {
                            func: "{programBlockEditor}.applier.change",
                            args: ["program", ["forward"]]
                        },
                        {
                            funcName: "c2lc.tests.checkProgramBlocks",
                            args: [
                                [
                                    { index: 0, action: "forward", label: "Forward" },
                                    { index: 1, action: "none", label: "None" },
                                    { index: 2, action: "none", label: "None" },
                                    { index: 3, action: "none", label: "None" }
                                ],
                                "{programBlockEditor}.dom.programBlocks"
                            ]
                        },
                        // Program longer than minVisibleProgramSteps
                        {
                            func: "{programBlockEditor}.applier.change",
                            args: [
                                "program",
                                ["left", "none", "none", "right", "forward"]
                            ]
                        },
                        {
                            funcName: "c2lc.tests.checkProgramBlocks",
                            args: [
                                [
                                    { index: 0, action: "left", label: "Left" },
                                    { index: 1, action: "none", label: "None" },
                                    { index: 2, action: "none", label: "None" },
                                    { index: 3, action: "right", label: "Right" },
                                    { index: 4, action: "forward", label: "Forward" },
                                    { index: 5, action: "none", label: "None" }
                                ],
                                "{programBlockEditor}.dom.programBlocks"
                            ]
                        },
                        // Delete a step
                        {
                            func: "{programBlockEditor}.applier.change",
                            args: [
                                "program",
                                ["left", "none", "right", "forward"]
                            ]
                        },
                        {
                            funcName: "c2lc.tests.checkProgramBlocks",
                            args: [
                                [
                                    { index: 0, action: "left", label: "Left" },
                                    { index: 1, action: "none", label: "None" },
                                    { index: 2, action: "right", label: "Right" },
                                    { index: 3, action: "forward", label: "Forward" },
                                    { index: 4, action: "none", label: "None" }
                                ],
                                "{programBlockEditor}.dom.programBlocks"
                            ]
                        },
                        // Delete a step
                        {
                            func: "{programBlockEditor}.applier.change",
                            args: [
                                "program",
                                ["left", "right", "forward"]
                            ]
                        },
                        {
                            funcName: "c2lc.tests.checkProgramBlocks",
                            args: [
                                [
                                    { index: 0, action: "left", label: "Left" },
                                    { index: 1, action: "right", label: "Right" },
                                    { index: 2, action: "forward", label: "Forward" },
                                    { index: 3, action: "none", label: "None" }
                                ],
                                "{programBlockEditor}.dom.programBlocks"
                            ]
                        }
                    ]
                }
            ]
        }]
    });

    c2lc.tests.checkProgramBlocks = function (expected, blocksContainer) {
        var blocks = $(".c2lc-programBlockEditor-block", blocksContainer);
        jqUnit.assertEquals("Expected number of blocks", expected.length,
            blocks.length);
        for (var i = 0; i < expected.length; i++) {
            jqUnit.assertEquals("Expected index", expected[i].index,
                parseInt(blocks.get(i).dataset.c2lcProgramblockeditorIndex, 10));
            jqUnit.assertEquals("Expected action", expected[i].action,
                blocks.get(i).dataset.c2lcProgramblockeditorAction);
            jqUnit.assertEquals("Expected label", expected[i].label,
                blocks.get(i).getAttribute("aria-label"));
        }
    };

})();
