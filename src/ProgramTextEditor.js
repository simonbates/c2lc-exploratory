/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* global Handlebars */

(function () {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    fluid.defaults("c2lc.programTextEditor", {
        gradeNames: "fluid.viewComponent",
        model: {
            program: []
        },
        components: {
            syntax: null // To be provided
        },
        invokers: {
            textareaChangeHandler: {
                funcName: "c2lc.programTextEditor.textareaChangeHandler",
                args: ["{that}"]
            }
        },
        listeners: {
            "onCreate.render": {
                funcName: "c2lc.programTextEditor.render",
                args: ["{that}"]
            },
            "onDestroy.destroyUI": {
                "this": "{that}.container",
                method: "empty"
            }
        },
        modelListeners: {
            program: {
                funcName: "c2lc.programTextEditor.setTextareaProgram",
                args: [
                    "{that}.dom.textarea",
                    "{change}.value",
                    "{syntax}"
                ],
                excludeSource: ["init", "c2lc-programTextEditor-textarea"]
            }
        },
        selectors: {
            label: ".c2lc-programTextEditor-label",
            textarea: ".c2lc-programTextEditor-textarea"
        }
    });

    c2lc.programTextEditor.render = function (that) {
        that.container.html(Handlebars.templates.ProgramTextEditorTemplate({
            textareaId: fluid.allocateGuid()
        }));
        // Set initial text editor contents
        var textarea = that.locate("textarea");
        c2lc.programTextEditor.setTextareaProgram(textarea,
            that.model.program, that.syntax);
        // Register change handler
        textarea.change(that.textareaChangeHandler);
    };

    c2lc.programTextEditor.textareaChangeHandler = function (that) {
        that.applier.change("program",
            that.syntax.read(that.locate("textarea").val()),
            "ADD", "c2lc-programTextEditor-textarea");
    };

    c2lc.programTextEditor.setTextareaProgram = function (textarea, program, syntax) {
        textarea.val(syntax.print(program));
    };

})();
