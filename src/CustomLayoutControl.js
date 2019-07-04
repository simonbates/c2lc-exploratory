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

    fluid.defaults("c2lc.customLayoutControl", {
        gradeNames: "fluid.viewComponent",
        model: {
            features: {
                blockEditor: true,
                textEditor: true
            }
        },
        features: [
            {
                name: "blockEditor",
                label: "Block Editor"
            },
            {
                name: "textEditor",
                label: "Text Editor"
            }
        ],
        invokers: {
            featureChangeHandler: {
                funcName: "c2lc.customLayoutControl.featureChangeHandler",
                args: [
                    "{that}.applier",
                    "{arguments}.0" // Event
                ]
            }
        },
        listeners: {
            "onCreate.render": {
                funcName: "c2lc.customLayoutControl.render",
                args: [
                    "{that}",
                    "{that}.featureChangeHandler"
                ]
            }
        }
    });

    c2lc.customLayoutControl.render = function (control, featureChangeHandler) {
        fluid.each(control.options.features, function (feature) {
            var checkbox = $("<input type='checkbox'>");
            var id = fluid.allocateSimpleId(checkbox);
            checkbox.attr("name", feature.name);
            checkbox.prop("checked",
                !!control.model.features[feature.name]);
            checkbox.change(featureChangeHandler);
            control.container.append(checkbox);

            var label = $("<label></label>");
            label.text(feature.label);
            label.attr("for", id);
            control.container.append(label);
        });
    };

    c2lc.customLayoutControl.featureChangeHandler = function (applier, evt) {
        applier.change(["features", evt.delegateTarget.name],
            !!evt.delegateTarget.checked);
    };

})();
