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

    fluid.defaults("c2lc.optionalComponentHolder", {
        gradeNames: "fluid.modelComponent",
        mergePolicy: {
            componentOptions: "noexpand"
        },
        model: {
            enabled: false
        },
        componentType: null,
        componentContainer: null,
        componentOptions: null,
        members: {
            optionalComponentInstance: null
        },
        modelListeners: {
            "enabled": {
                funcName: "c2lc.optionalComponentHolder.enabledStateChange",
                args: ["{that}", "{change}.value"]
            }
        }
    });

    c2lc.optionalComponentHolder.enabledStateChange = function (that, enabled) {
        if (enabled) {
            var creator = fluid.getGlobalValue(that.options.componentType);
            that.optionalComponentInstance = creator.apply(null,
                [
                    that.options.componentContainer,
                    that.options.componentOptions
                ]
            );
        } else {
            if (that.optionalComponentInstance) {
                that.optionalComponentInstance.destroy();
                that.optionalComponentInstance = null;
            }
        }
    };

})();
