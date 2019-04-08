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

    fluid.defaults("c2lc.deviceConnectControl", {
        gradeNames: "fluid.viewComponent",
        model: {
            connectionState: "notConnected"
            // Values: "notConnected", "connecting", "connected"
        },
        events: {
            onInitiateConnect: null
        },
        listeners: {
            "onCreate.render": {
                funcName: "c2lc.deviceConnectControl.render",
                args: ["{that}"]
            },
            "onCreate.registerConnectClickHandler": {
                priority: "after:render",
                "this": "{that}.dom.connectButton",
                method: "click",
                args: ["{that}.events.onInitiateConnect.fire"]
            }
        },
        modelListeners: {
            connectionState: {
                funcName: "c2lc.deviceConnectControl.updateConnectionMessage",
                args: [
                    "{change}.value",
                    "{that}.dom.connectionState",
                    "{that}.options.messages.connectionState"
                ],
                excludeSource: "init"
            }
        },
        selectors: {
            connectButton: ".c2lc-deviceConnectControl-connect",
            connectionState: ".c2lc-deviceConnectControl-connectionState"
        },
        messages: {
            connect: "Connect",
            connectionState: {
                notConnected: "Not connected",
                connecting: "Connecting...",
                connected: "Connected"
            }
        },
        markup: {
            control: "<button class='c2lc-deviceConnectControl-connect'>%connect</button><span class='c2lc-deviceConnectControl-connectionState'></span>"
        }
    });

    c2lc.deviceConnectControl.render = function (deviceConnectControl) {
        deviceConnectControl.container.html(fluid.stringTemplate(
            deviceConnectControl.options.markup.control,
            deviceConnectControl.options.messages));
    };

    c2lc.deviceConnectControl.updateConnectionMessage = function (state, stateElem, messages) {
        stateElem.text(messages[state]);
    };

})();
