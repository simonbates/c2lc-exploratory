/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* global Uint8Array */

(function () {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    fluid.defaults("c2lc.dashConnector", {
        gradeNames: "fluid.component",
        dashServiceUuid: "af237777-879d-6186-1f49-deca0e85d9c1",
        dashCharCommandUuid: "af230002-879d-6186-1f49-deca0e85d9c1",
        members: {
            charCommand: null // Will be set at connect
        },
        invokers: {
            connect: {
                funcName: "c2lc.dashConnector.connect",
                args: [
                    "{that}",
                    "{that}.options.dashServiceUuid",
                    "{that}.options.dashCharCommandUuid",
                    "{that}.events.onConnect"
                ]
            },
            red: {
                "this": "{that}.charCommand",
                method: "writeValue",
                args: [new Uint8Array([0x03, 0xff, 0x00, 0x00])]
            },
            green: {
                "this": "{that}.charCommand",
                method: "writeValue",
                args: [new Uint8Array([0x03, 0x00, 0xff, 0x00])]
            },
            blue: {
                "this": "{that}.charCommand",
                method: "writeValue",
                args: [new Uint8Array([0x03, 0x00, 0x00, 0xff])]
            }
        },
        events: {
            onConnect: null
        }
    });

    c2lc.dashConnector.connect = function (dashConnector, serviceUuid, charCommandUuid, event) {
        navigator.bluetooth.requestDevice({
            filters: [{ services: [serviceUuid] }]
        }).then(function (device) {
            return device.gatt.connect();
        }).then(function (server) {
            return server.getPrimaryService(serviceUuid);
        }).then(function (service) {
            return service.getCharacteristic(charCommandUuid);
        }).then(function (characteristic) {
            dashConnector.charCommand = characteristic;
            event.fire();
        });
    };

})();
