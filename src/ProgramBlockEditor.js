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
        commandPalette: ["forward", "left", "right"],
        model: {
            program: []
        },
        listeners: {
            "onCreate.renderBlockEditor": {
                funcName: "c2lc.programBlockEditor.render",
                args: ["{that}"]
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
            blockEditor: "<div clas='c2lc-programBlockEditor-commandPalette'>%commandPaletteContents</div><div class='c2lc-programBlockEditor-programBlocks'></div>",
            block: "<div class='c2lc-programBlockEditor-block'>%image</div>"
        }
    });

    c2lc.programBlockEditor.render = function (programBlockEditor) {
        var commandPaletteContents = [];
        fluid.each(programBlockEditor.options.commandPalette, function (command) {
            var block = fluid.stringTemplate(
                programBlockEditor.options.markup.block,
                {
                    image: programBlockEditor.options.actionBlocks[command].markup
                }
            );
            commandPaletteContents.push(block);
        });
        programBlockEditor.container.html(fluid.stringTemplate(
            programBlockEditor.options.markup.blockEditor,
            {
                commandPaletteContents: commandPaletteContents.join("")
            }
        ));
    };

    c2lc.programBlockEditor.updateBlocksFromProgram = function (programBlockEditor, program, blocksElem) {

        // TODO: Don't empty and recreate the blocks as the user might have focus on one of them. Edit instead.

        blocksElem.empty();
        fluid.each(program, function (programAction) {
            var block = fluid.stringTemplate(
                programBlockEditor.options.markup.block,
                {
                    image: programBlockEditor.options.actionBlocks[programAction].markup
                }
            );
            blocksElem.append(block);
        });
    };

})();
