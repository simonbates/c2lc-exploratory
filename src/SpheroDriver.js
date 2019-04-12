/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* global Promise, Uint8Array */

// TODO: Extract grade bluetoothDeviceDriver

(function () {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    fluid.defaults("c2lc.spheroDriver", {
        gradeNames: "fluid.modelComponent",
        bleUuids: {
            bleService:          "22bb746f-2bb0-7554-2d6f-726568705327",
            antiDosChar: "22bb746f-2bbd-7554-2d6f-726568705327",
            robotControlService: "22bb746f-2ba0-7554-2d6f-726568705327",
            commandsChar: "22bb746f-2ba1-7554-2d6f-726568705327"
        },
        model: {
            connectionState: "notConnected"
            // Values: "notConnected", "connecting", "connected"
        },
        members: {
            antiDosChar: null, // Will be set at connect
            commandsChar: null // Will be set at connect
        },
        invokers: {
            connect: {
                funcName: "c2lc.spheroDriver.connect",
                args: [
                    "{that}",
                    "{that}.options.bleUuids",
                    "{that}.applier"
                ]
            },
            sendCommand: {
                funcName: "c2lc.spheroDriver.sendCommand",
                args: [
                    "{that}",
                    "{arguments}.0" // Array of bytes
                ]
            },
            red: {
                func: "{that}.sendCommand",
                args: [
                    [0xFF, 0xFE, 0x02, 0x20, 0x00, 0x05, 0xFF, 0x00, 0x00, 0x00, 0xD9]
                ]
            },
            green: {
                func: "{that}.sendCommand",
                args: [
                    [0xFF, 0xFE, 0x02, 0x20, 0x00, 0x05, 0x00, 0xFF, 0x00, 0x00, 0xD9]
                ]
            },
            blue: {
                func: "{that}.sendCommand",
                args: [
                    [0xFF, 0xFE, 0x02, 0x20, 0x00, 0x05, 0x00, 0x00, 0xFF, 0x00, 0xD9]
                ]
            }
        }
    });

    c2lc.spheroDriver.connect = function (spheroDriver, bleUuids, applier) {
        applier.change("connectionState", "connecting");
        navigator.bluetooth.requestDevice({
            filters: [{ services: [bleUuids.robotControlService] }],
            optionalServices: [bleUuids.bleService]
        }).then(function (device) {
            return device.gatt.connect();
        }).then(function (server) {
            return Promise.all([
                c2lc.spheroDriver.getCharacteristic(server, bleUuids.bleService, bleUuids.antiDosChar),
                c2lc.spheroDriver.getCharacteristic(server, bleUuids.robotControlService, bleUuids.commandsChar)
            ]);
        }).then(function (characteristics) {
            spheroDriver.antiDosChar = characteristics[0];
            spheroDriver.commandsChar = characteristics[1];
            return c2lc.spheroDriver.init(spheroDriver);
        }).then(function () {
            applier.change("connectionState", "connected");
        }).catch(function (error) { // eslint-disable-line dot-notation
            console.log(error.name);
            console.log(error.message);
            applier.change("connectionState", "notConnected");
        });
    };

    c2lc.spheroDriver.getCharacteristic = function (server, serviceUuid, charUuid) {
        return server.getPrimaryService(serviceUuid).then(function (service) {
            return service.getCharacteristic(charUuid);
        });
    };

    c2lc.spheroDriver.init = function (spheroDriver) {
        return c2lc.spheroDriver.setAntiDos(spheroDriver.antiDosChar);
        // TODO: Send Wake
    };

    c2lc.spheroDriver.setAntiDos = function (antiDosChar) {
        return antiDosChar.writeValue(new Uint8Array([
            "0".charCodeAt(0),
            "1".charCodeAt(0),
            "1".charCodeAt(0),
            "i".charCodeAt(0),
            "3".charCodeAt(0)
        ]));
    };

    // Returns: A Promise representing completion of the command
    c2lc.spheroDriver.sendCommand = function (spheroDriver, bytes) {
        var togo = fluid.promise();
        spheroDriver.commandsChar.writeValue(new Uint8Array(bytes))
        .then(function () {
            togo.resolve();
        }).catch(function (error) { // eslint-disable-line dot-notation
            console.log(error.name);
            console.log(error.message);
        });
        return togo;
    };

})();
