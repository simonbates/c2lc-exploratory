/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* eslint-env es6 */

(function () {

    "use strict";

    const CACHE_NAME = "c2lc-exploratory-v1";

    const FILES_TO_CACHE = [
        "c2lc.css",
        "icons/icon-192x192.png",
        "icons/icon-512x512.png",
        "index.html",
        "manifest.json",
        "node_modules/infusion/dist/infusion-all.js",
        "src/App.js",
        "src/BluetoothDevice.js",
        "src/BluetoothDeviceActionHandler.js",
        "src/DashDriver.js",
        "src/DeviceConnectControl.js",
        "src/FeatureDetection.js",
        "src/Interpreter.js",
        "src/InterpreterControls.js",
        "src/Math.js",
        "src/ProgramBlockEditor.js",
        "src/ProgramTextEditor.js",
        "src/ProgramUtils.js",
        "src/SpheroDriver.js",
        "src/SpheroPacketBuilder.js",
        "src/SpheroTurtle.js",
        "src/TextSyntax.js",
        "src/TurtleGraphics.js"
    ];

    self.addEventListener("install", function (e) {
        e.waitUntil(
            caches.open(CACHE_NAME).then(function (cache) {
                return cache.addAll(FILES_TO_CACHE);
            })
        );
    });

    self.addEventListener("fetch", function (e) {
        e.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return cache.match(e.request).then(function (response) {
                    return response || fetch(e.request).then(function (response) {
                        console.log("Cache miss, fetch from network: "
                            + e.request.url);
                        return response;
                    });
                });
            })
        );
    });

})();
