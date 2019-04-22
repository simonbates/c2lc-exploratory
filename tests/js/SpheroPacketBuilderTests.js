/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* global jqUnit, Uint8Array */

(function () {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");

    jqUnit.module("SpheroPacketBuilder Tests");

    jqUnit.test("setHeading", function () {
        jqUnit.expect(2);

        var packetBuilder = c2lc.spheroPacketBuilder();

        jqUnit.assertDeepEq("0 degrees",
            new Uint8Array([
                0xFF, 0xFE, 0x02, 0x01, 0x00, 0x03,
                0x00,
                0x00,
                0xF9
            ]),
            packetBuilder.setHeading(0));

        jqUnit.assertDeepEq("359 degrees",
            new Uint8Array([
                0xFF, 0xFE, 0x02, 0x01, 0x00, 0x03,
                0x01, // 256
                103, // 359 - 256
                0x91
            ]),
            packetBuilder.setHeading(359));
    });

    jqUnit.test("setRgbLed", function () {
        jqUnit.expect(5);

        var packetBuilder = c2lc.spheroPacketBuilder();

        jqUnit.assertDeepEq("black",
            new Uint8Array([
                0xFF, 0xFE, 0x02, 0x20, 0x00, 0x05,
                0x00,
                0x00,
                0x00,
                0x00,
                0xD8
            ]),
            packetBuilder.setRgbLed(0, 0, 0));

        jqUnit.assertDeepEq("white",
            new Uint8Array([
                0xFF, 0xFE, 0x02, 0x20, 0x00, 0x05,
                0xFF,
                0xFF,
                0xFF,
                0x00,
                0xDB
            ]),
            packetBuilder.setRgbLed(255, 255, 255));

        jqUnit.assertDeepEq("red",
            new Uint8Array([
                0xFF, 0xFE, 0x02, 0x20, 0x00, 0x05,
                0xFF,
                0x00,
                0x00,
                0x00,
                0xD9
            ]),
            packetBuilder.setRgbLed(255, 0, 0));

        jqUnit.assertDeepEq("green",
            new Uint8Array([
                0xFF, 0xFE, 0x02, 0x20, 0x00, 0x05,
                0x00,
                0xFF,
                0x00,
                0x00,
                0xD9
            ]),
            packetBuilder.setRgbLed(0, 255, 0));

        jqUnit.assertDeepEq("blue",
            new Uint8Array([
                0xFF, 0xFE, 0x02, 0x20, 0x00, 0x05,
                0x00,
                0x00,
                0xFF,
                0x00,
                0xD9
            ]),
            packetBuilder.setRgbLed(0, 0, 255));
    });

    jqUnit.test("roll", function () {
        jqUnit.expect(2);

        var packetBuilder = c2lc.spheroPacketBuilder();

        jqUnit.assertDeepEq("speed=0, heading=0",
            new Uint8Array([
                0xFF, 0xFE, 0x02, 0x30, 0x00, 0x05,
                0x00,
                0x00,
                0x00,
                0x01,
                0xC7
            ]),
            packetBuilder.roll(0, 0));

        jqUnit.assertDeepEq("speed=255, heading=359",
            new Uint8Array([
                0xFF, 0xFE, 0x02, 0x30, 0x00, 0x05,
                0xFF,
                0x01, // 256
                103, // 359 - 256
                0x01,
                0x60
            ]),
            packetBuilder.roll(255, 359));
    });

})();
