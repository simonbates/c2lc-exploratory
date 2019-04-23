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

    // TODO: Use SVG and custom alt text for block images

    fluid.defaults("c2lc.programBlockEditor", {
        gradeNames: "fluid.viewComponent",
        actionBlocks: {
            forward: {
                markup: "<i class='material-icons'>arrow_upward</i>"
            },
            left: {
                markup: "<i class='material-icons'>arrow_back</i>"
            },
            right: {
                markup: "<i class='material-icons'>arrow_forward</i>"
            }
        },
        model: {
            program: []
        },
        listeners: {
            "onCreate.renderBlockEditor": {
                "this": "{that}.container",
                method: "html",
                args: ["{that}.options.markup.blockEditor"]
            }
        },
        modelListeners: {
            program: {
                funcName: "c2lc.programBlockEditor.updateBlocksFromProgram",
                args: [
                    "{that}",
                    "{change}.value",
                    "{that}.dom.programBlocks"
                ],
                excludeSource: ["init"]
            }
        },
        selectors: {
            programBlocks: ".c2lc-programBlockEditor-programBlocks"
        },
        markup: {
            blockEditor: "<div class='c2lc-programBlockEditor-programBlocks'></div>"
        }
    });

    c2lc.programBlockEditor.updateBlocksFromProgram = function (programBlockEditor, program, blocksElem) {

        // TODO: Don't empty and recreate the blocks as the user might have focus on one of them. Edit instead.

        blocksElem.empty();
        fluid.each(program, function (programAction) {
            blocksElem.append(programBlockEditor.options.actionBlocks[programAction].markup);
        });
    };

})();
