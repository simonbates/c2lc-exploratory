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

    fluid.defaults("c2lc.bluetoothDeviceActionHandler", {
        gradeNames: "c2lc.actionHandler",
        method: null, // To be provided
        args: [],
        components: {
            bluetoothDevice: null // To be provided
        },
        invokers: {
            handleAction: {
                funcName: "c2lc.bluetoothDeviceActionHandler.handleAction",
                args: [
                    "{that}.bluetoothDevice",
                    "{that}.options.method",
                    "{that}.options.args"
                ]
            }
        }
    });

    c2lc.bluetoothDeviceActionHandler.handleAction = function (device, methodName, args) {
        if (device.model.connectionState === "connected") {
            return device[methodName].apply(device, args);
        } else {
            // If we aren't connected, resolve immediately
            var togo = fluid.promise();
            togo.resolve();
            return togo;
        }
    };

})();
