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
                        forward: [
                            "{that}.turtleForwardHandler",
                            "{that}.dashForwardHandler"
                        ],
                        left: [
                            "{that}.turtleLeftHandler",
                            "{that}.dashLeftHandler"
                        ],
                        right: [
                            "{that}.turtleRightHandler",
                            "{that}.dashRightHandler"
                        ]
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
