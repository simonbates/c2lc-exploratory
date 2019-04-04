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

    fluid.defaults("c2lc.dashDriver", {
        gradeNames: "fluid.modelComponent",
        dashServiceUuid: "af237777-879d-6186-1f49-deca0e85d9c1",
        dashCharCommandUuid: "af230002-879d-6186-1f49-deca0e85d9c1",
        model: {
            connectionState: "notConnected"
            // Values: "notConnected", "connecting", "connected"
        },
        members: {
            charCommand: null // Will be set at connect
        },
        invokers: {
            connect: {
                funcName: "c2lc.dashDriver.connect",
                args: [
                    "{that}",
                    "{that}.options.dashServiceUuid",
                    "{that}.options.dashCharCommandUuid",
                    "{that}.applier"
                ]
            },
            sendCommand: {
                funcName: "c2lc.dashDriver.sendCommand",
                args: [
                    "{that}",
                    "{arguments}.0", // Array of bytes
                    "{arguments}.1" // Wait time in ms
                ]
            },
            forward: {
                func: "{that}.sendCommand",
                args: [
                    [0x23, 0xC8, 0x00, 0x00, 0x03, 0xE8, 0x00, 0x00, 0x80],
                    1900
                ]
            },
            left: {
                func: "{that}.sendCommand",
                args: [
                    [0x23, 0x00, 0x00, 0x9D, 0x03, 0xE8, 0x00, 0x00, 0x80],
                    1900
                ]
            },
            right: {
                func: "{that}.sendCommand",
                args: [
                    [0x23, 0x00, 0x00, 0x63, 0x03, 0xE8, 0xC0, 0xC0, 0x80],
                    1900
                ]
            }
        }
    });

    c2lc.dashDriver.connect = function (dashDriver, serviceUuid, charCommandUuid, applier) {
        applier.change("connectionState", "connecting");
        navigator.bluetooth.requestDevice({
            filters: [{ services: [serviceUuid] }]
        }).then(function (device) {
            return device.gatt.connect();
        }).then(function (server) {
            return server.getPrimaryService(serviceUuid);
        }).then(function (service) {
            return service.getCharacteristic(charCommandUuid);
        }).then(function (characteristic) {
            dashDriver.charCommand = characteristic;
            applier.change("connectionState", "connected");
        }).catch(function (error) { // eslint-disable-line dot-notation
            console.log(error.name);
            console.log(error.message);
            applier.change("connectionState", "notConnected");
        });
    };

    // Returns: A Promise representing completion of the command
    c2lc.dashDriver.sendCommand = function (dashDriver, bytes, waitTimeMs) {
        var togo = fluid.promise();
        dashDriver.charCommand.writeValue(new Uint8Array(bytes));
        // TODO: Ideally, use feedback from Dash to know when the command has finished, rather than after a set amount of time
        setTimeout(function () {
            togo.resolve();
        }, waitTimeMs);
        return togo;
    };

})();
