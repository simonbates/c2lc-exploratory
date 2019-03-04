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

    fluid.defaults("c2lc.programTextEditor", {
        gradeNames: "fluid.viewComponent",
        model: {
            program: []
        },
        invokers: {
            updateProgramFromTextarea: {
                funcName: "c2lc.programTextEditor.updateProgramFromTextarea",
                args: ["{that}", "{that}.dom.textEditor"]
            }
        },
        listeners: {
            "onCreate.renderTextEditor": {
                "this": "{that}.container",
                method: "html",
                args: ["{that}.options.markup.textEditor"]
            },
            "onCreate.connectLabel": {
                priority: "after:renderTextEditor",
                funcName: "c2lc.programTextEditor.connectLabel",
                args: [
                    "{that}.dom.label",
                    "{that}.dom.textEditor"
                ]
            },
            "onCreate.setInitialTextEditorContents": {
                priority: "after:renderTextEditor",
                funcName: "c2lc.programTextEditor.updateTextareaFromProgram",
                args: ["{that}.model.program", "{that}.dom.textEditor"]
            },
            "onCreate.registerChangeHandler": {
                priority: "after:renderTextEditor",
                "this": "{that}.dom.textEditor",
                method: "change",
                args: ["{that}.updateProgramFromTextarea"]
            }
        },
        modelListeners: {
            program: {
                funcName: "c2lc.programTextEditor.updateTextareaFromProgram",
                args: ["{change}.value", "{that}.dom.textEditor"],
                excludeSource: ["init", "c2lc-programTextEditor-textEditor"]
            }
        },
        selectors: {
            label: ".c2lc-programTextEditor-label",
            textEditor: ".c2lc-programTextEditor-text"
        },
        markup: {
            textEditor: "<p><label class='c2lc-programTextEditor-label'>Program:</label></p><p><textarea class='c2lc-programTextEditor-text' cols='40' rows='3'></textarea></p>"
        }
    });

    c2lc.programTextEditor.connectLabel = function (labelElem, textareaElem) {
        var id = fluid.allocateSimpleId(textareaElem);
        labelElem.attr("for", id);
    };

    c2lc.programTextEditor.updateProgramFromTextarea = function (programTextEditor, textarea) {
        programTextEditor.applier.change("program", textarea.val().trim().split(/\s+/),
            "ADD", "c2lc-programTextEditor-textEditor");
    };

    c2lc.programTextEditor.updateTextareaFromProgram = function (program, textarea) {
        textarea.val(program.join(" "));
    };

})();
