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
            "onCreate.renderSpace": {
                funcName: "c2lc.turtleGraphics.renderSpace",
                args: [
                    "{that}.container",
                    "{that}.options.markup.space"
                ]
            }
        },
        modelListeners: {
            "location": {
                funcName: "c2lc.turtleGraphics.drawLine",
                args: [
                    "{that}.dom.svgElem",
                    "{change}.oldValue",
                    "{change}.value"
                ],
                excludeSource: "init"
            }
        },
        selectors: {
            svgElem: ".c2lc-turtleGraphics-svg"
        },
        markup: {
            space: "<span role='img'><svg class='c2lc-turtleGraphics-svg' xmlns='http://www.w3.org/2000/svg' viewBox='-100 -100 200 200'></svg></span>"
        }
    });

    c2lc.turtleGraphics.renderSpace = function (container, markup) {
        container.html(markup);
    };

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

    c2lc.turtleGraphics.drawLine = function (svgElem, fromLocation, toLocation) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttributeNS(null, "x1", fromLocation.x);
        line.setAttributeNS(null, "y1", fromLocation.y);
        line.setAttributeNS(null, "x2", toLocation.x);
        line.setAttributeNS(null, "y2", toLocation.y);
        svgElem.append(line);
    };

})();
