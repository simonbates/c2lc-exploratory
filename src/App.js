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
        textEditorContainer: null, // To be provided
        dashConnectControlsContainer: null, // To be provided
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
                        "right.turtle": "{that}.turtleRightHandler"
                    },
                    components: {
                        turtleForwardHandler: {
                            type: "c2lc.objectMethodActionHandler",
                            options: {
                                members: {
                                    targetObject: "{app}.graphics"
                                },
                                method: "forward",
                                args: [ 40 ]
                            }
                        },
                        turtleLeftHandler: {
                            type: "c2lc.objectMethodActionHandler",
                            options: {
                                members: {
                                    targetObject: "{app}.graphics"
                                },
                                method: "left",
                                args: [ 90 ]
                            }
                        },
                        turtleRightHandler: {
                            type: "c2lc.objectMethodActionHandler",
                            options: {
                                members: {
                                    targetObject: "{app}.graphics"
                                },
                                method: "right",
                                args: [ 90 ]
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
                            type: "c2lc.dashActionHandler",
                            options: {
                                operation: "forward",
                                components: {
                                    dashDriver: "{app}.dashDriver"
                                }
                            }
                        },
                        dashLeftHandler: {
                            type: "c2lc.dashActionHandler",
                            options: {
                                operation: "left",
                                components: {
                                    dashDriver: "{app}.dashDriver"
                                }
                            }
                        },
                        dashRightHandler: {
                            type: "c2lc.dashActionHandler",
                            options: {
                                operation: "right",
                                components: {
                                    dashDriver: "{app}.dashDriver"
                                }
                            }
                        }
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
