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

    fluid.defaults("c2lc.actions.forward", {
        gradeNames: "c2lc.actionHandler",
        components: {
            turtleGraphics: null, // To be provided
            dashDriver: null // To be provided
        },
        invokers: {
            handleAction: {
                funcName: "c2lc.actions.forward.handleAction",
                args: ["{turtleGraphics}", "{dashDriver}"]
            }
        }
    });

    c2lc.actions.forward.handleAction = function (turtleGraphics, dashDriver) {
        turtleGraphics.forward(40);
        dashDriver.forward();
    };

    fluid.defaults("c2lc.actions.left", {
        gradeNames: "c2lc.actionHandler",
        components: {
            turtleGraphics: null, // To be provided
            dashDriver: null // To be provided
        },
        invokers: {
            handleAction: {
                funcName: "c2lc.actions.left.handleAction",
                args: ["{turtleGraphics}", "{dashDriver}"]
            }
        }
    });

    c2lc.actions.left.handleAction = function (turtleGraphics, dashDriver) {
        turtleGraphics.left(90);
        dashDriver.left();
    };

    fluid.defaults("c2lc.actions.right", {
        gradeNames: "c2lc.actionHandler",
        components: {
            turtleGraphics: null, // To be provided
            dashDriver: null // To be provided
        },
        invokers: {
            handleAction: {
                funcName: "c2lc.actions.right.handleAction",
                args: ["{turtleGraphics}", "{dashDriver}"]
            }
        }
    });

    c2lc.actions.right.handleAction = function (turtleGraphics, dashDriver) {
        turtleGraphics.right(90);
        dashDriver.right();
    };

    fluid.defaults("c2lc.app", {
        gradeNames: "fluid.modelComponent",
        graphicsContainer: null, // To be provided
        controlsContainer: null, // To be provided
        textEditorContainer: null, // To be provided
        dashConnectControlsContainer: null, // To be provided
        model: {
            program: []
        },
        components: {
            interpreter: {
                type: "c2lc.interpreter",
                options: {
                    model: {
                        program: "{app}.model.program"
                    },
                    actions: {
                        forward: "{that}.forwardHandler",
                        left: "{that}.leftHandler",
                        right: "{that}.rightHandler"
                    },
                    components: {
                        forwardHandler: {
                            type: "c2lc.actions.forward",
                            options: {
                                components: {
                                    turtleGraphics: "{app}.graphics",
                                    dashDriver: "{app}.dashDriver"
                                }
                            }
                        },
                        leftHandler: {
                            type: "c2lc.actions.left",
                            options: {
                                components: {
                                    turtleGraphics: "{app}.graphics",
                                    dashDriver: "{app}.dashDriver"
                                }
                            }
                        },
                        rightHandler: {
                            type: "c2lc.actions.right",
                            options: {
                                components: {
                                    turtleGraphics: "{app}.graphics",
                                    dashDriver: "{app}.dashDriver"
                                }
                            }
                        }
                    },
                    listeners: {
                        "onStart.resetGraphics": {
                            func: "{graphics}.reset"
                        }
                    }
                }
            },
            graphics: {
                type: "c2lc.turtleGraphics",
                container: "{app}.options.graphicsContainer"
            },
            controls: {
                type: "c2lc.interpreterControls",
                container: "{app}.options.controlsContainer",
                options: {
                    listeners: {
                        "onStep.stepInterpreter": {
                            func: "{interpreter}.step"
                        },
                        "onRestart.resetInterpreter": {
                            func: "{interpreter}.reset"
                        },
                        "onRestart.resetGraphics": {
                            func: "{graphics}.reset"
                        }
                    }
                }
            },
            textEditorSyntax: {
                type: "c2lc.textSyntax"
            },
            textEditor: {
                type: "c2lc.programTextEditor",
                container: "{app}.options.textEditorContainer",
                options: {
                    model: {
                        program: "{app}.model.program"
                    },
                    components: {
                        syntax: "{textEditorSyntax}"
                    }
                }
            },
            dashDriver: {
                type: "c2lc.dashDriver"
            },
            dashConnectControls: {
                type: "c2lc.dashConnectControls",
                container: "{app}.options.dashConnectControlsContainer",
                options: {
                    model: {
                        connectionState: "{dashDriver}.model.connectionState"
                    },
                    listeners: {
                        "onInitiateConnect.connectToDash": {
                            func: "{dashDriver}.connect"
                        }
                    }
                }
            }
        }
    });

})();
