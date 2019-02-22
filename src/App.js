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
                        leftHandler: {
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
                        rightHandler: {
                            type: "c2lc.actionHandler",
                            options: {
                                invokers: {
                                    handleAction: {
                                        func: "{app}.graphics.right",
                                        args: [ 90 ]
                                    }
                                }
                            }
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
                        }
                    }
                }
            }
        }
    });

})();
