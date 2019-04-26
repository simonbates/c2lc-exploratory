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
                iconName: "arrow_upward"
            },
            left: {
                iconName: "arrow_back"
            },
            right: {
                iconName: "arrow_forward"
            }
        },
        commandPalette: ["forward", "left", "right"],
        model: {
            program: []
        },
        invokers: {
            blockClickHandler: {
                funcName: "c2lc.programBlockEditor.blockClickHandler"
            }
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
            blockEditor: "<h2>Commands</h2><div class='c2lc-programBlockEditor-commandPalette'></div><h2>Program</h2><div class='c2lc-programBlockEditor-programBlocks'></div>",
            block: "<div class='c2lc-programBlockEditor-block-outer'><div class='c2lc-programBlockEditor-block' data-c2lc-programBlockEditor-action='%actionName'><i class='material-icons'>%iconName</i></div></div>"
        }
    });

    c2lc.programBlockEditor.render = function (programBlockEditor) {
        programBlockEditor.container.html(programBlockEditor.options.markup.blockEditor);
        fluid.each(programBlockEditor.options.commandPalette, function (command) {
            var blockElem = c2lc.programBlockEditor.makeBlockElem(
                programBlockEditor,
                command,
                programBlockEditor.blockClickHandler
            );
            $(".c2lc-programBlockEditor-commandPalette", programBlockEditor.container).append(blockElem);
        });
    };

    c2lc.programBlockEditor.updateBlocksFromProgram = function (programBlockEditor, program, blocksElem) {

        // TODO: Don't empty and recreate the blocks as the user might have focus on one of them. Edit instead.

        blocksElem.empty();
        fluid.each(program, function (programAction) {
            var blockElem = c2lc.programBlockEditor.makeBlockElem(
                programBlockEditor,
                programAction,
                programBlockEditor.blockClickHandler
            );
            blocksElem.append(blockElem);
        });
    };

    c2lc.programBlockEditor.makeBlockElem = function (programBlockEditor, actionName, clickHandler) {
        var blockElem = $(fluid.stringTemplate(
            programBlockEditor.options.markup.block,
            {
                actionName: actionName,
                iconName: programBlockEditor.options.actionBlocks[actionName].iconName
            }
        ));
        blockElem.click(clickHandler);
        return blockElem;
    };

    c2lc.programBlockEditor.blockClickHandler = function (evt) {
        // TODO: Only add select on blocks in the command palette
        // TODO: Deselect other commands
        $(evt.target).parents(".c2lc-programBlockEditor-block-outer").toggleClass("c2lc-programBlockEditor-block-selected");
    };

})();
