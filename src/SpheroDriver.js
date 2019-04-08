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

    fluid.defaults("c2lc.spheroDriver", {
        gradeNames: "fluid.modelComponent",
        spheroServiceUuid: "22bb746f-2ba0-7554-2d6f-726568705327",
        model: {
            connectionState: "notConnected"
            // Values: "notConnected", "connecting", "connected"
        },
        invokers: {
            connect: {
                funcName: "c2lc.spheroDriver.connect",
                args: [
                    "{that}",
                    "{that}.options.spheroServiceUuid",
                    "{that}.applier"
                ]
            }
        }
    });

    c2lc.spheroDriver.connect = function (spheroDriver, serviceUuid, applier) {
        applier.change("connectionState", "connecting");
        navigator.bluetooth.requestDevice({
            filters: [{ services: [serviceUuid] }]
        }).then(function (device) {
            return device.gatt.connect();
        }).then(function (server) {
            return server.getPrimaryService(serviceUuid);
        }).then(function (service) { // eslint-disable-line no-unused-vars
            applier.change("connectionState", "connected");
        }).catch(function (error) { // eslint-disable-line dot-notation
            console.log(error.name);
            console.log(error.message);
            applier.change("connectionState", "notConnected");
        });
    };

})();
