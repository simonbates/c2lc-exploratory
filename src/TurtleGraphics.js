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

    fluid.defaults("c2lc.turtleGraphics", {
        gradeNames: "fluid.viewComponent",
        model: {
            location: {
                x: 0,
                y: 0
            },
            directionDegrees: 0 // 0 is North, 90 is East
        },
        invokers: {
            forward: {
                funcName: "c2lc.turtleGraphics.forward",
                args: [
                    "{that}",
                    "{arguments}.0" // distance
                ]
            },
            left: {
                funcName: "c2lc.turtleGraphics.left",
                args: [
                    "{that}",
                    "{arguments}.0" // amountDegrees
                ]
            },
            right: {
                funcName: "c2lc.turtleGraphics.right",
                args: [
                    "{that}",
                    "{arguments}.0" // amountDegrees
                ]
            }
        },
        listeners: {
            "onCreate.renderDrawingArea": {
                "this": "{that}.container",
                method: "html",
                args: ["{that}.options.markup.drawingArea"]

            }
        },
        modelListeners: {
            updateTurtle: {
                path: ["location", "directionDegrees"],
                funcName: "c2lc.turtleGraphics.updateTurtle",
                args: [
                    "{that}.dom.turtle",
                    "{that}.model.location",
                    "{that}.model.directionDegrees"
                ]
            },
            drawLine: {
                path: "location",
                funcName: "c2lc.turtleGraphics.drawLine",
                args: [
                    "{that}.dom.linesContainer",
                    "{change}.oldValue",
                    "{change}.value"
                ],
                excludeSource: "init"
            }
        },
        selectors: {
            turtle: ".c2lc-turtleGraphics-turtle",
            linesContainer: ".c2lc-turtleGraphics-lines"
        },
        markup: {
            drawingArea: "<span role='img' aria-label='Drawing area'><svg xmlns='http://www.w3.org/2000/svg' viewBox='-100 -100 200 200'><g class='c2lc-turtleGraphics-lines'/><polygon class='c2lc-turtleGraphics-turtle' points='-5 3 5 3 0 -8'/></svg></span>"
        }
    });

    c2lc.turtleGraphics.forward = function (turtleGraphics, distance) {
        var directionRadians = c2lc.math.degrees2radians(turtleGraphics.model.directionDegrees);
        var xOffset = Math.sin(directionRadians) * distance;
        var yOffset = Math.cos(directionRadians) * distance;
        turtleGraphics.applier.change("location", {
            x: turtleGraphics.model.location.x + xOffset,
            y: turtleGraphics.model.location.y - yOffset
        });
    };

    c2lc.turtleGraphics.left = function (turtleGraphics, amountDegrees) {
        turtleGraphics.applier.change("directionDegrees", c2lc.math.wrap(0, 360, turtleGraphics.model.directionDegrees - amountDegrees));
    };

    c2lc.turtleGraphics.right = function (turtleGraphics, amountDegrees) {
        turtleGraphics.applier.change("directionDegrees", c2lc.math.wrap(0, 360, turtleGraphics.model.directionDegrees + amountDegrees));
    };

    c2lc.turtleGraphics.updateTurtle = function (turtleElem, location, directionDegrees) {
        turtleElem.attr("transform",
            fluid.stringTemplate("translate(%x %y) rotate(%dir 0 0)", {
                dir: directionDegrees,
                x: location.x,
                y: location.y
            })
        );
    };

    c2lc.turtleGraphics.drawLine = function (linesContainer, fromLocation, toLocation) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttributeNS(null, "x1", fromLocation.x);
        line.setAttributeNS(null, "y1", fromLocation.y);
        line.setAttributeNS(null, "x2", toLocation.x);
        line.setAttributeNS(null, "y2", toLocation.y);
        linesContainer.append(line);
    };

})();
