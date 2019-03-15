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
    fluid.registerNamespace("c2lc.tests.dashConnectControls");

    fluid.defaults("c2lc.tests.dashConnectControlsTestTree", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            dashConnectControls: {
                type: "c2lc.dashConnectControls",
                container: ".c2lc-dashConnectControls"
            },
            dashConnectControlsTester: {
                type: "c2lc.tests.dashConnectControlsTester"
            }
        }
    });

    fluid.defaults("c2lc.tests.dashConnectControlsTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Dash Connect Controls Tests",
            tests: [
                {
                    expect: 2,
                    name: "Check initial connection state",
                    sequence: [
                        {
                            funcName: "c2lc.tests.dashConnectControls.checkState",
                            args: [
                                "notConnected",
                                "",
                                "{dashConnectControls}",
                                "{dashConnectControls}.dom.connectionState"
                            ]
                        }
                    ]
                },
                {
                    expect: 2,
                    name: "Check 'connecting' state",
                    sequence: [
                        {
                            func: "{dashConnectControls}.applier.change",
                            args: ["connectionState", "connecting"]
                        },
                        {
                            funcName: "c2lc.tests.dashConnectControls.checkState",
                            args: [
                                "connecting",
                                "Connecting...",
                                "{dashConnectControls}",
                                "{dashConnectControls}.dom.connectionState"
                            ]
                        }
                    ]
                },
                {
                    expect: 2,
                    name: "Check 'connected' state",
                    sequence: [
                        {
                            func: "{dashConnectControls}.applier.change",
                            args: ["connectionState", "connected"]
                        },
                        {
                            funcName: "c2lc.tests.dashConnectControls.checkState",
                            args: [
                                "connected",
                                "Connected",
                                "{dashConnectControls}",
                                "{dashConnectControls}.dom.connectionState"
                            ]
                        }
                    ]
                },
                {
                    expect: 2,
                    name: "Check 'notConnected' state",
                    sequence: [
                        {
                            func: "{dashConnectControls}.applier.change",
                            args: ["connectionState", "notConnected"]
                        },
                        {
                            funcName: "c2lc.tests.dashConnectControls.checkState",
                            args: [
                                "notConnected",
                                "Not connected",
                                "{dashConnectControls}",
                                "{dashConnectControls}.dom.connectionState"
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
                            element: "{dashConnectControls}.dom.connectButton"
                        },
                        {
                            event: "{dashConnectControls}.events.onInitiateConnect",
                            listener: "jqUnit.assert",
                            args: ["onInitiateConnect event fired"]
                        }
                    ]
                }
            ]
        }]
    });

    c2lc.tests.dashConnectControls.checkState = function (expectedModelValue, expectedMessage, dashConnectControls, stateElem) {
        jqUnit.assertEquals("connectionState model value", expectedModelValue, dashConnectControls.model.connectionState);
        jqUnit.assertEquals("UI message", expectedMessage, stateElem.text());
    };

})();
