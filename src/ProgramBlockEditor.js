/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/*
SVG icons are from https://github.com/google/material-design-icons

Licensed under the Apache License 2.0

Icons used:

- https://github.com/google/material-design-icons/blob/master/navigation/svg/production/ic_arrow_upward_48px.svg
- https://github.com/google/material-design-icons/blob/master/navigation/svg/production/ic_arrow_back_48px.svg
- https://github.com/google/material-design-icons/blob/master/navigation/svg/production/ic_arrow_forward_48px.svg
- https://github.com/google/material-design-icons/blob/master/action/svg/production/ic_delete_48px.svg
*/

(function () {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    fluid.defaults("c2lc.programBlockEditor", {
        gradeNames: "fluid.viewComponent",
        actions: {
            forward: {
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M8 24l2.83 2.83L22 15.66V40h4V15.66l11.17 11.17L40 24 24 8 8 24z'/></svg>",
                label: "Forward"
            },
            left: {
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M40 22H15.66l11.17-11.17L24 8 8 24l16 16 2.83-2.83L15.66 26H40v-4z'/></svg>",
                label: "Left"
            },
            right: {
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M24 8l-2.83 2.83L32.34 22H8v4h24.34L21.17 37.17 24 40l16-16z'/></svg>",
                label: "Right"
            },
            none: {
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 0 0'></svg>",
                label: "None"
            }
        },
        editorCommands: {
            delete: {
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V14H12v24zM38 8h-7l-2-2H19l-2 2h-7v4h28V8z'/></svg>",
                label: "Delete",
                handler: "{that}.deleteHandler"
            }
        },
        commandPalette: {
            actions: ["forward", "left", "right"],
            editorCommands: ["delete"]
        },
        minNumProgramSteps: 10,
        insertMode: "overwrite", // "insert" or "overwrite"
        model: {
            program: [],
            selectedCommand: null // Initially no command is selected
                // Model value structure:
                // {
                //     type: "action" OR "editorCommand"
                //     name: COMMAND-NAME
                // }
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
                    "{that}.model.selectedCommand",
                    "{arguments}.0" // Event
                ]
            },
            deleteHandler: {
                funcName: "c2lc.programBlockEditor.deleteHandler",
                args: [
                    "{that}",
                    "{arguments}.0" // Index of target program step
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
            block: "<div class='c2lc-programBlockEditor-block'><div class='c2lc-programBlockEditor-block-inner'><span role='img' aria-label='%label'>%svg</span></div></div>"
        }
    });

    c2lc.programBlockEditor.render = function (programBlockEditor) {
        programBlockEditor.container.html(programBlockEditor.options.markup.blockEditor);

        // Render actions

        fluid.each(programBlockEditor.options.commandPalette.actions, function (action) {
            var blockElem = c2lc.programBlockEditor.makeBlockElem(
                programBlockEditor,
                programBlockEditor.options.actions[action],
                programBlockEditor.commandClickHandler
            );
            blockElem.attr("data-c2lc-programblockeditor-commandtype", "action");
            blockElem.attr("data-c2lc-programblockeditor-commandname", action);
            $(".c2lc-programBlockEditor-commandPalette", programBlockEditor.container).append(blockElem);
        });

        // Render editor commands

        fluid.each(programBlockEditor.options.commandPalette.editorCommands, function (editorCommand) {
            var blockElem = c2lc.programBlockEditor.makeBlockElem(
                programBlockEditor,
                programBlockEditor.options.editorCommands[editorCommand],
                programBlockEditor.commandClickHandler
            );
            blockElem.attr("data-c2lc-programblockeditor-commandtype", "editorCommand");
            blockElem.attr("data-c2lc-programblockeditor-commandname", editorCommand);
            $(".c2lc-programBlockEditor-commandPalette", programBlockEditor.container).append(blockElem);
        });

        // Render program

        c2lc.programBlockEditor.updateBlocksFromProgram(
            programBlockEditor,
            programBlockEditor.model.program,
            $(programBlockEditor.options.selectors.programBlocks,
                programBlockEditor.container)
        );
    };

    c2lc.programBlockEditor.makeBlockElem = function (programBlockEditor, blockOptions, clickHandler) {
        var blockElem = $(fluid.stringTemplate(
            programBlockEditor.options.markup.block,
            {
                svg: blockOptions.svg,
                label: blockOptions.label
            }
        ));
        blockElem.click(clickHandler);
        return blockElem;
    };

    c2lc.programBlockEditor.updateBlocksFromProgram = function (programBlockEditor, program, blocksElem) {

        // TODO: Don't empty and recreate the blocks as the user might have focus on one of them. Edit instead.

        blocksElem.empty();

        fluid.each(program, function (action, i) {
            var blockElem = c2lc.programBlockEditor.makeBlockElem(
                programBlockEditor,
                programBlockEditor.options.actions[action],
                programBlockEditor.programBlockClickHandler
            );
            blockElem.attr("data-c2lc-programblockeditor-action", action);
            blockElem.attr("data-c2lc-programblockeditor-index", i);
            blocksElem.append(blockElem);
        });

        // Draw empty program steps, always adding at least one

        var numEmptySteps = programBlockEditor.options.minNumProgramSteps > program.length ? programBlockEditor.options.minNumProgramSteps - program.length : 1;

        for (var i = 0; i < numEmptySteps; i++) {
            var blockElem = c2lc.programBlockEditor.makeBlockElem(
                programBlockEditor,
                // eslint-disable-next-line dot-notation
                programBlockEditor.options.actions["none"],
                programBlockEditor.programBlockClickHandler
            );
            blockElem.attr("data-c2lc-programblockeditor-action", "none");
            blockElem.attr("data-c2lc-programblockeditor-index",
                program.length + i);
            blocksElem.append(blockElem);
        }
    };

    c2lc.programBlockEditor.updateSelectedCommand = function (commandPalette, selectedCommand) {
        commandPalette.find(".c2lc-programBlockEditor-block").each(function (i, elem) {
            if (selectedCommand
                && (elem.dataset.c2lcProgramblockeditorCommandtype === selectedCommand.type)
                && (elem.dataset.c2lcProgramblockeditorCommandname === selectedCommand.name)) {
                $(elem).addClass("c2lc-programBlockEditor-block-selected");
            } else {
                $(elem).removeClass("c2lc-programBlockEditor-block-selected");
            }
        });
    };

    c2lc.programBlockEditor.commandClickHandler = function (currentSelectedCommand, applier, evt) {
        var targetBlockOuter = $(evt.target).parents(".c2lc-programBlockEditor-block").first();
        if (targetBlockOuter.length === 1) {
            var newSelectedCommandType = targetBlockOuter.get(0).dataset.c2lcProgramblockeditorCommandtype;
            var newSelectedCommandName = targetBlockOuter.get(0).dataset.c2lcProgramblockeditorCommandname;
            if (currentSelectedCommand
                && (newSelectedCommandType === currentSelectedCommand.type)
                && (newSelectedCommandName === currentSelectedCommand.name)) {
                // If we click the existing selected command, toggle it
                applier.change("selectedCommand", null);
            } else {
                applier.change("selectedCommand", {
                    type: newSelectedCommandType,
                    name: newSelectedCommandName
                });
            }
        }
    };

    c2lc.programBlockEditor.programBlockClickHandler = function (programBlockEditor, selectedCommand, evt) {
        if (selectedCommand) {
            var targetBlockOuter = $(evt.target).parents(".c2lc-programBlockEditor-block").first();
            if (targetBlockOuter.length === 1) {
                var targetIndex = parseInt(targetBlockOuter.get(0).dataset.c2lcProgramblockeditorIndex, 10);
                c2lc.programBlockEditor.doCommand(programBlockEditor, selectedCommand, targetIndex);
            }
        }
    };

    c2lc.programBlockEditor.doCommand = function (programBlockEditor, command, targetIndex) {
        if (command.type === "action") {
            if (programBlockEditor.options.insertMode === "insert") {
                c2lc.programBlockEditor.insertProgramStep(programBlockEditor, targetIndex, command.name);
            } else if (programBlockEditor.options.insertMode === "overwrite") {
                c2lc.programBlockEditor.overwriteProgramStep(programBlockEditor, targetIndex, command.name);
            }
        } else if (command.type === "editorCommand") {
            programBlockEditor.options.editorCommands[command.name].handler.apply(programBlockEditor, [targetIndex]);
        }
    };

    c2lc.programBlockEditor.insertProgramStep = function (programBlockEditor, targetIndex, newAction) {
        var program = fluid.makeArray(programBlockEditor.model.program);
        c2lc.programBlockEditor.expandProgram(program, targetIndex);
        program.splice(targetIndex, 0, newAction);
        programBlockEditor.applier.change("program", program);
    };

    c2lc.programBlockEditor.overwriteProgramStep = function (programBlockEditor, targetIndex, newAction) {
        var program = fluid.makeArray(programBlockEditor.model.program);
        c2lc.programBlockEditor.expandProgram(program, targetIndex + 1);
        program[targetIndex] = newAction;
        programBlockEditor.applier.change("program", program);
    };

    c2lc.programBlockEditor.expandProgram = function (program, length) {
        while (program.length < length) {
            program.push("none");
        }
    };

    c2lc.programBlockEditor.deleteHandler = function (programBlockEditor, targetIndex) {
        var program = fluid.makeArray(programBlockEditor.model.program);
        program.splice(targetIndex, 1);
        programBlockEditor.applier.change("program", program);
    };

})();
