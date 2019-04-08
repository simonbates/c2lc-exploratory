/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

/* global jqUnit */

(function () {

    "use strict";

    var c2lc = fluid.registerNamespace("c2lc");
    fluid.registerNamespace("c2lc.tests.deviceConnectControl");

    fluid.defaults("c2lc.tests.deviceConnectControlTestTree", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            deviceConnectControl: {
                type: "c2lc.deviceConnectControl",
                container: ".c2lc-deviceConnectControl"
            },
            deviceConnectControlTester: {
                type: "c2lc.tests.deviceConnectControlTester"
            }
        }
    });

    fluid.defaults("c2lc.tests.deviceConnectControlTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Device Connect Control Tests",
            tests: [
                {
                    expect: 2,
                    name: "Check initial connection state",
                    sequence: [
                        {
                            funcName: "c2lc.tests.deviceConnectControl.checkState",
                            args: [
                                "notConnected",
                                "",
                                "{deviceConnectControl}",
                                "{deviceConnectControl}.dom.connectionState"
                            ]
                        }
                    ]
                },
                {
                    expect: 2,
                    name: "Check 'connecting' state",
                    sequence: [
                        {
                            func: "{deviceConnectControl}.applier.change",
                            args: ["connectionState", "connecting"]
                        },
                        {
                            funcName: "c2lc.tests.deviceConnectControl.checkState",
                            args: [
                                "connecting",
                                "Connecting...",
                                "{deviceConnectControl}",
                                "{deviceConnectControl}.dom.connectionState"
                            ]
                        }
                    ]
                },
                {
                    expect: 2,
                    name: "Check 'connected' state",
                    sequence: [
                        {
                            func: "{deviceConnectControl}.applier.change",
                            args: ["connectionState", "connected"]
                        },
                        {
                            funcName: "c2lc.tests.deviceConnectControl.checkState",
                            args: [
                                "connected",
                                "Connected",
                                "{deviceConnectControl}",
                                "{deviceConnectControl}.dom.connectionState"
                            ]
                        }
                    ]
                },
                {
                    expect: 2,
                    name: "Check 'notConnected' state",
                    sequence: [
                        {
                            func: "{deviceConnectControl}.applier.change",
                            args: ["connectionState", "notConnected"]
                        },
                        {
                            funcName: "c2lc.tests.deviceConnectControl.checkState",
                            args: [
                                "notConnected",
                                "Not connected",
                                "{deviceConnectControl}",
                                "{deviceConnectControl}.dom.connectionState"
                            ]
                        }
                    ]
                },
                {
                    expect: 1,
                    name: "Check onInitiateConnect event",
                    sequence: [
                        {
                            jQueryTrigger: "click",
                            element: "{deviceConnectControl}.dom.connectButton"
                        },
                        {
                            event: "{deviceConnectControl}.events.onInitiateConnect",
                            listener: "jqUnit.assert",
                            args: ["onInitiateConnect event fired"]
                        }
                    ]
                }
            ]
        }]
    });

    c2lc.tests.deviceConnectControl.checkState = function (expectedModelValue, expectedMessage, deviceConnectControl, stateElem) {
        jqUnit.assertEquals("connectionState model value", expectedModelValue, deviceConnectControl.model.connectionState);
        jqUnit.assertEquals("UI message", expectedMessage, stateElem.text());
    };

})();
