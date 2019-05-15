/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

(function () {

    "use strict";

    fluid.defaults("c2lc.app", {
        gradeNames: ["fluid.modelComponent", "fluid.contextAware"],
        graphicsContainer: null, // To be provided
        interpreterControlsContainer: null, // To be provided
        blockEditorContainer: null, // To be provided
        textEditorContainer: null, // To be provided
        dashConnectControlContainer: null, // To be provided
        spheroConnectControlContainer: null, // To be provided
        model: {
            program: []
        },
        contextAwareness: {
            dashRobotIntegration: {
                checks: {
                    dashRobotIntegration: {
                        contextValue: "{c2lc.bluetoothApiIsAvailable}",
                        gradeNames: "c2lc.app.dashRobotIntegration"
                    }
                }
            },
            spheroRobotIntegration: {
                checks: {
                    spheroRobotIntegration: {
                        contextValue: "{c2lc.bluetoothApiIsAvailable}",
                        gradeNames: "c2lc.app.spheroRobotIntegration"
                    }
                }
            }
        },
        components: {
            interpreter: {
                type: "c2lc.interpreter",
                options: {
                    model: {
                        program: "{app}.model.program"
                    },
                    actions: {
                        "forward.turtle": "{that}.turtleForwardHandler",
                        "left.turtle": "{that}.turtleLeftHandler",
                        "right.turtle": "{that}.turtleRightHandler",
                        "none": "{that}.noOperationHandler"
                    },
                    components: {
                        turtleForwardHandler: {
                            type: "c2lc.actionHandler",
                            options: {
                                invokers: {
                                    handleAction: {
                                        func: "{app}.graphics.forward",
                                        args: [ 40 ]
                                    }
                                }
                            }
                        },
                        turtleLeftHandler: {
                            type: "c2lc.actionHandler",
                            options: {
                                invokers: {
                                    handleAction: {
                                        func: "{app}.graphics.left",
                                        args: [ 90 ]
                                    }
                                }
                            }
                        },
                        turtleRightHandler: {
                            type: "c2lc.actionHandler",
                            options: {
                                invokers: {
                                    handleAction: {
                                        func: "{app}.graphics.right",
                                        args: [ 90 ]
                                    }
                                }
                            }
                        },
                        noOperationHandler: {
                            type: "c2lc.actionHandler",
                            options: {
                                invokers: {
                                    handleAction: {
                                        funcName: "fluid.identity",
                                        args: []
                                    }
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
            interpreterControls: {
                type: "c2lc.interpreterControls",
                container: "{app}.options.interpreterControlsContainer",
                options: {
                    listeners: {
                        "onRun.runInterpreter": {
                            func: "{interpreter}.run"
                        },
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
            blockEditor: {
                type: "c2lc.programBlockEditor",
                container: "{app}.options.blockEditorContainer",
                options: {
                    model: {
                        program: "{app}.model.program"
                    }
                }
            }
        }
    });

    fluid.defaults("c2lc.app.dashRobotIntegration", {
        components: {
            interpreter: {
                options: {
                    actions: {
                        "forward.dash": "{that}.dashForwardHandler",
                        "left.dash": "{that}.dashLeftHandler",
                        "right.dash": "{that}.dashRightHandler"
                    },
                    components: {
                        dashForwardHandler: {
                            type: "c2lc.bluetoothDeviceActionHandler",
                            options: {
                                components: {
                                    bluetoothDevice: "{app}.dashDriver"
                                },
                                method: "forward"
                            }
                        },
                        dashLeftHandler: {
                            type: "c2lc.bluetoothDeviceActionHandler",
                            options: {
                                components: {
                                    bluetoothDevice: "{app}.dashDriver"
                                },
                                method: "left"
                            }
                        },
                        dashRightHandler: {
                            type: "c2lc.bluetoothDeviceActionHandler",
                            options: {
                                components: {
                                    bluetoothDevice: "{app}.dashDriver"
                                },
                                method: "right"
                            }
                        }
                    }
                }
            },
            dashDriver: {
                type: "c2lc.dashDriver"
            },
            dashConnectControl: {
                type: "c2lc.deviceConnectControl",
                container: "{app}.options.dashConnectControlContainer",
                options: {
                    messages: {
                        connect: "Connect to Dash"
                    },
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

    fluid.defaults("c2lc.app.spheroRobotIntegration", {
        components: {
            interpreter: {
                options: {
                    actions: {
                        "forward.sphero": "{that}.spheroForwardHandler",
                        "left.sphero": "{that}.spheroLeftHandler",
                        "right.sphero": "{that}.spheroRightHandler"
                    },
                    components: {
                        spheroForwardHandler: {
                            type: "c2lc.bluetoothDeviceActionHandler",
                            options: {
                                components: {
                                    bluetoothDevice: "{app}.spheroTurtle"
                                },
                                method: "forward",
                                args: [0x20, 1500]
                            }
                        },
                        spheroLeftHandler: {
                            type: "c2lc.bluetoothDeviceActionHandler",
                            options: {
                                components: {
                                    bluetoothDevice: "{app}.spheroTurtle"
                                },
                                method: "left",
                                args: [90]
                            }
                        },
                        spheroRightHandler: {
                            type: "c2lc.bluetoothDeviceActionHandler",
                            options: {
                                components: {
                                    bluetoothDevice: "{app}.spheroTurtle"
                                },
                                method: "right",
                                args: [90]
                            }
                        }
                    }
                }
            },
            spheroTurtle: {
                type: "c2lc.spheroTurtle"
            },
            spheroConnectControl: {
                type: "c2lc.deviceConnectControl",
                container: "{app}.options.spheroConnectControlContainer",
                options: {
                    messages: {
                        connect: "Connect to Sphero"
                    },
                    model: {
                        connectionState: "{spheroTurtle}.model.connectionState"
                    },
                    listeners: {
                        "onInitiateConnect.connectToSphero": {
                            func: "{spheroTurtle}.connect"
                        }
                    }
                }
            }
        }
    });

})();
