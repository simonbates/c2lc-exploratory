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
            program: [],
            selectedCommand: null // Initially no command is selected
        },
        invokers: {
            commandClickHandler: {
                funcName: "c2lc.programBlockEditor.commandClickHandler",
                args: [
                    "{that}.model.selectedCommand",
                    "{that}.applier",
                    "{arguments}.0" // Event
                ]
            },
            programBlockClickHandler: {
                funcName: "c2lc.programBlockEditor.programBlockClickHandler",
                args: [
                    "{that}",
                    "{arguments}.0" // Event
                ]
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
            },
            selectedCommand: {
                funcName: "c2lc.programBlockEditor.updateSelectedCommand",
                args: ["{that}.dom.commandPalette", "{change}.value"]
            }
        },
        selectors: {
            commandPalette: ".c2lc-programBlockEditor-commandPalette",
            programBlocks: ".c2lc-programBlockEditor-programBlocks"
        },
        markup: {
            blockEditor: "<h2>Commands</h2><div class='c2lc-programBlockEditor-commandPalette'></div><h2>Program</h2><div class='c2lc-programBlockEditor-programBlocks'></div>",
            block: "<div class='c2lc-programBlockEditor-block' data-c2lc-programblockeditor-action='%actionName'><div class='c2lc-programBlockEditor-block-inner'><i class='material-icons'>%iconName</i></div></div>"
        }
    });

    c2lc.programBlockEditor.render = function (programBlockEditor) {
        programBlockEditor.container.html(programBlockEditor.options.markup.blockEditor);
        fluid.each(programBlockEditor.options.commandPalette, function (command) {
            var blockElem = c2lc.programBlockEditor.makeBlockElem(
                programBlockEditor,
                command,
                programBlockEditor.commandClickHandler
            );
            $(".c2lc-programBlockEditor-commandPalette", programBlockEditor.container).append(blockElem);
        });
    };

    c2lc.programBlockEditor.updateBlocksFromProgram = function (programBlockEditor, program, blocksElem) {

        // TODO: Don't empty and recreate the blocks as the user might have focus on one of them. Edit instead.

        blocksElem.empty();
        fluid.each(program, function (programAction, i) {
            var blockElem = c2lc.programBlockEditor.makeBlockElem(
                programBlockEditor,
                programAction,
                programBlockEditor.programBlockClickHandler
            );
            blockElem.attr("data-c2lc-programblockeditor-index", i);
            blocksElem.append(blockElem);
        });
    };

    c2lc.programBlockEditor.updateSelectedCommand = function (commandPalette, selectedCommand) {
        commandPalette.find(".c2lc-programBlockEditor-block").each(function (i, elem) {
            if (selectedCommand && (elem.dataset.c2lcProgramblockeditorAction === selectedCommand)) {
                $(elem).addClass("c2lc-programBlockEditor-block-selected");
            } else {
                $(elem).removeClass("c2lc-programBlockEditor-block-selected");
            }
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

    c2lc.programBlockEditor.commandClickHandler = function (currentSelectedCommand, applier, evt) {
        var targetBlockOuter = $(evt.target).parents(".c2lc-programBlockEditor-block").first();
        if (targetBlockOuter.length === 1) {
            var newSelectedCommand = targetBlockOuter.get(0).dataset.c2lcProgramblockeditorAction;
            if (newSelectedCommand === currentSelectedCommand) {
                // If we click the existing selected command, toggle it
                applier.change("selectedCommand", null);
            } else {
                applier.change("selectedCommand", newSelectedCommand);
            }
        }
    };

    c2lc.programBlockEditor.programBlockClickHandler = function (programBlockEditor, evt) {
        if (programBlockEditor.model.selectedCommand) {
            var targetBlockOuter = $(evt.target).parents(".c2lc-programBlockEditor-block").first();
            if (targetBlockOuter.length === 1) {
                var program = fluid.makeArray(programBlockEditor.model.program);
                var targetIndex = targetBlockOuter.get(0).dataset.c2lcProgramblockeditorIndex;
                program[targetIndex] = programBlockEditor.model.selectedCommand;
                programBlockEditor.applier.change("program", program);
            }
        }
    };

})();
