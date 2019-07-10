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
- https://github.com/google/material-design-icons/blob/master/content/svg/production/ic_add_48px.svg
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
            insertSpace: {
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z'/></svg>",
                label: "Insert Space",
                handler: "{that}.insertSpaceHandler"
            },
            delete: {
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V14H12v24zM38 8h-7l-2-2H19l-2 2h-7v4h28V8z'/></svg>",
                label: "Delete",
                handler: "{that}.deleteHandler"
            }
        },
        commandPalette: {
            actions: ["forward", "left", "right"],
            editorCommands: ["insertSpace", "delete"]
        },
        minVisibleProgramSteps: 10,
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
            insertSpaceHandler: {
                funcName: "c2lc.programBlockEditor.insertSpaceHandler",
                args: [
                    "{that}",
                    "{arguments}.0" // Index
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
            },
            "onDestroy.destroyUI": {
                "this": "{that}.container",
                method: "empty"
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
            block: "<div class='c2lc-programBlockEditor-block' tabindex='0' role='button' aria-label='%label'><div class='c2lc-programBlockEditor-block-image'>%svg</div></div>"
        }
    });

    c2lc.programBlockEditor.render = function (editor) {
        editor.container.html(editor.options.markup.blockEditor);

        // Render actions

        fluid.each(editor.options.commandPalette.actions, function (action) {
            var blockElem = c2lc.programBlockEditor.makeBlockElem(
                editor,
                editor.options.actions[action],
                editor.commandClickHandler
            );
            blockElem.attr("data-c2lc-programblockeditor-commandtype", "action");
            blockElem.attr("data-c2lc-programblockeditor-commandname", action);
            $(".c2lc-programBlockEditor-commandPalette", editor.container)
                .append(blockElem);
        });

        // Render editor commands

        fluid.each(editor.options.commandPalette.editorCommands,
            function (editorCommand) {
                var blockElem = c2lc.programBlockEditor.makeBlockElem(
                    editor,
                    editor.options.editorCommands[editorCommand],
                    editor.commandClickHandler
                );
                blockElem.attr("data-c2lc-programblockeditor-commandtype",
                    "editorCommand");
                blockElem.attr("data-c2lc-programblockeditor-commandname",
                    editorCommand);
                $(".c2lc-programBlockEditor-commandPalette", editor.container)
                    .append(blockElem);
            }
        );

        // Render program

        c2lc.programBlockEditor.updateBlocksFromProgram(
            editor,
            editor.model.program,
            $(editor.options.selectors.programBlocks,
                editor.container)
        );
    };

    c2lc.programBlockEditor.makeBlockElem = function (editor, blockOptions,
            clickHandler) {
        var blockElem = $(fluid.stringTemplate(
            editor.options.markup.block,
            {
                svg: blockOptions.svg,
                label: blockOptions.label
            }
        ));
        blockElem.click(clickHandler);
        blockElem.keydown(clickHandler);
        return blockElem;
    };

    c2lc.programBlockEditor.updateBlocksFromProgram = function (editor,
            program, blocksElem) {

        var blocks = $(".c2lc-programBlockEditor-block", blocksElem);
        var index = 0;
        var blockElem;

        // Calculate the number of visible steps we need

        var totalNumSteps = Math.max(editor.options.minVisibleProgramSteps,
            program.length + 1);
        var numEmptySteps = totalNumSteps - program.length;

        // Update existing blocks, if any

        while (index < blocks.length) {
            blockElem = $(blocks.get(index));
            if (index < program.length) {
                c2lc.programBlockEditor.updateProgramBlockContents(
                    blockElem,
                    index,
                    program[index],
                    editor.options.actions[program[index]].label,
                    editor.options.actions[program[index]].svg
                );
            } else if (numEmptySteps > 0) {
                c2lc.programBlockEditor.updateProgramBlockContents(
                    blockElem,
                    index,
                    "none",
                    // eslint-disable-next-line dot-notation
                    editor.options.actions["none"].label,
                    // eslint-disable-next-line dot-notation
                    editor.options.actions["none"].svg
                );
                numEmptySteps--;
            } else {
                // We are at the end of the program and have no more empty
                // steps to add, so we should remove the block
                blockElem.remove();
            }
            index++;
        }

        // Add new program blocks as needed

        while (index < program.length) {
            blockElem = c2lc.programBlockEditor.makeBlockElem(
                editor,
                editor.options.actions[program[index]],
                editor.programBlockClickHandler
            );
            blockElem.attr("data-c2lc-programblockeditor-action", program[index]);
            blockElem.attr("data-c2lc-programblockeditor-index", index);
            blocksElem.append(blockElem);
            index++;
        }

        // Add empty program steps as needed

        while (index < totalNumSteps) {
            blockElem = c2lc.programBlockEditor.makeBlockElem(
                editor,
                // eslint-disable-next-line dot-notation
                editor.options.actions["none"],
                editor.programBlockClickHandler
            );
            blockElem.attr("data-c2lc-programblockeditor-action", "none");
            blockElem.attr("data-c2lc-programblockeditor-index", index);
            blocksElem.append(blockElem);
            index++;
        }
    };

    c2lc.programBlockEditor.updateProgramBlockContents = function (blockElem,
            index, action, label, svg) {
        blockElem.attr("data-c2lc-programblockeditor-index", index);
        blockElem.attr("data-c2lc-programblockeditor-action", action);
        blockElem.attr("aria-label", label);
        $(".c2lc-programBlockEditor-block-image", blockElem).html(svg);
    };

    c2lc.programBlockEditor.updateSelectedCommand = function (commandPalette,
            selectedCommand) {
        commandPalette.find(".c2lc-programBlockEditor-block").each(
            function (i, elem) {
                if (selectedCommand
                    && (elem.dataset.c2lcProgramblockeditorCommandtype
                        === selectedCommand.type)
                    && (elem.dataset.c2lcProgramblockeditorCommandname
                        === selectedCommand.name)) {
                    $(elem).addClass("c2lc-programBlockEditor-block-selected");
                } else {
                    $(elem).removeClass("c2lc-programBlockEditor-block-selected");
                }
            }
        );
    };

    c2lc.programBlockEditor.commandClickHandler = function (currentSelectedCommand,
            applier, evt) {
        if (evt.type === "click"
            || (evt.type === "keydown"
                && (evt.keyCode === 13 || evt.keyCode === 32))) {
            evt.preventDefault();
            var newSelectedCommandType = evt.delegateTarget.dataset.c2lcProgramblockeditorCommandtype;
            var newSelectedCommandName = evt.delegateTarget.dataset.c2lcProgramblockeditorCommandname;
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

    c2lc.programBlockEditor.programBlockClickHandler = function (editor,
            selectedCommand, evt) {
        if (evt.type === "click"
            || (evt.type === "keydown"
                && (evt.keyCode === 13 || evt.keyCode === 32))) {
            evt.preventDefault();
            if (selectedCommand) {
                var targetIndex = parseInt(evt.delegateTarget.dataset.c2lcProgramblockeditorIndex, 10);
                c2lc.programBlockEditor.doCommand(editor, selectedCommand,
                    targetIndex);
            }
        }
    };

    c2lc.programBlockEditor.doCommand = function (editor, command, index) {
        if (command.type === "action") {
            if (editor.options.insertMode === "insert") {
                editor.applier.change("program",
                    c2lc.programUtils.insert(editor.model.program,
                        index, command.name, "none"));
            } else if (editor.options.insertMode === "overwrite") {
                editor.applier.change("program",
                    c2lc.programUtils.overwrite(editor.model.program,
                        index, command.name, "none"));
            }
        } else if (command.type === "editorCommand") {
            editor.options.editorCommands[command.name].handler.apply(editor, [index]);
        }
    };

    c2lc.programBlockEditor.insertSpaceHandler = function (editor, index) {
        if (index < editor.model.program.length) {
            editor.applier.change("program",
                c2lc.programUtils.insert(editor.model.program,
                    index, "none", "none"));
        }
    };

    c2lc.programBlockEditor.deleteHandler = function (editor, index) {
        editor.applier.change("program",
            c2lc.programUtils.trimEnd(
                c2lc.programUtils.deleteStep(editor.model.program, index),
                "none"));
    };

})();
