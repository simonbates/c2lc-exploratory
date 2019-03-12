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

    fluid.defaults("c2lc.dashConnectControls", {
        gradeNames: "fluid.viewComponent",
        model: {
            connectionState: "notConnected"
            // Values: "notConnected", "connecting", "connected"
        },
        events: {
            onInitiateConnect: null
        },
        listeners: {
            "onCreate.renderControls": {
                "this": "{that}.container",
                method: "html",
                args: ["{that}.options.markup.controls"]
            },
            "onCreate.registerConnectClickHandler": {
                priority: "after:renderControls",
                "this": "{that}.dom.connectButton",
                method: "click",
                args: ["{that}.events.onInitiateConnect.fire"]
            }
        },
        modelListeners: {
            connectionState: {
                funcName: "c2lc.dashConnectControls.updateConnectionMessage",
                args: [
                    "{change}.value",
                    "{that}.dom.connectionState",
                    "{that}.options.messages.connectionState"
                ],
                excludeSource: "init"
            }
        },
        selectors: {
            connectButton: ".c2lc-dashConnectControls-connect",
            connectionState: ".c2lc-dashConnectControls-connectionState"
        },
        messages: {
            connectionState: {
                notConnected: "Not connected",
                connecting: "Connecting...",
                connected: "Connected"
            }
        },
        markup: {
            controls: "<button class='c2lc-dashConnectControls-connect'>Connect to Dash</button><span class='c2lc-dashConnectControls-connectionState'></span>"
        }
    });

    c2lc.dashConnectControls.updateConnectionMessage = function (state, stateElem, messages) {
        stateElem.text(messages[state]);
    };

})();
