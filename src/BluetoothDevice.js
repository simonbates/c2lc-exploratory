/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

(function () {

    "use strict";

    fluid.defaults("c2lc.bluetoothDevice", {
        gradeNames: "fluid.modelComponent",
        model: {
            connectionState: "notConnected"
            // Values: "notConnected", "connecting", "connected"
        },
        invokers: {
            connect: "fluid.notImplemented"
        }
    });

})();
