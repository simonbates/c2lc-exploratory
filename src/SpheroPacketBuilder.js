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

    fluid.defaults("c2lc.spheroPacketBuilder", {
        gradeNames: "fluid.component",
        invokers: {
            setHeading: {
                funcName: "c2lc.spheroPacketBuilder.setHeading",
                args: [
                    "{arguments}.0" // heading (0-359)
                ]
            },
            setRgbLed: {
                funcName: "c2lc.spheroPacketBuilder.setRgbLed",
                args: [
                    "{arguments}.0", // red (0-255)
                    "{arguments}.1", // green (0-255)
                    "{arguments}.2" // blue (0-255)
                ]
            },
            roll: {
                funcName: "c2lc.spheroPacketBuilder.roll",
                args: [
                    "{arguments}.0", // speed (0-255)
                    "{arguments}.1" // heading (0-359)
                ]
            }
        }
    });

    c2lc.spheroPacketBuilder.buildCommandPacket = function (commandOptions) {
        var dataLength = commandOptions.data ? commandOptions.data.length : 0;
        var packet = new Uint8Array(7 + dataLength);

        packet[0] = commandOptions.sop1;
        packet[1] = commandOptions.sop2;
        packet[2] = commandOptions.did;
        packet[3] = commandOptions.cid;
        packet[4] = commandOptions.seq;
        packet[5] = dataLength + 1;

        for (var i = 0; i < dataLength; i++) {
            packet[6 + i] = commandOptions.data[i];
        }

        packet[6 + dataLength] = c2lc.spheroPacketBuilder.calculateChecksum(packet, 2, 6 + dataLength);

        return packet;
    };

    c2lc.spheroPacketBuilder.calculateChecksum = function (data, begin, end) {
        var sum = 0;
        for (var i = begin; i < end; i++) {
            sum += data[i];
        }
        return (~sum) & 0xFF;
    };

    // Sphero Commands

    c2lc.spheroPacketBuilder.setHeading = function (heading) {
        return c2lc.spheroPacketBuilder.buildCommandPacket({
            sop1: 0xFF,
            sop2: 0xFE,
            did: 0x02,
            cid: 0x01,
            seq: 0x00,
            data: [(heading >> 8) & 0xFF, heading & 0xFF]
        });
    };

    c2lc.spheroPacketBuilder.setRgbLed = function (red, green, blue) {
        return c2lc.spheroPacketBuilder.buildCommandPacket({
            sop1: 0xFF,
            sop2: 0xFE,
            did: 0x02,
            cid: 0x20,
            seq: 0x00,
            data: [red, green, blue, 0x00]
        });
    };

    c2lc.spheroPacketBuilder.roll = function (speed, heading) {
        var state = 0x01;
        return c2lc.spheroPacketBuilder.buildCommandPacket({
            sop1: 0xFF,
            sop2: 0xFE,
            did: 0x02,
            cid: 0x30,
            seq: 0x00,
            data: [speed, (heading >> 8) & 0xFF, heading & 0xFF, state]
        });
    };

})();
