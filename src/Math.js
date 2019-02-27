/*
Coding to Learn and Create
Copyright 2019 OCAD University

Licensed under the 3-Clause BSD license. You may not use this file except in compliance with this license.

You may obtain a copy of the 3-Clause BSD License at
https://github.com/simonbates/c2lc-exploratory/raw/master/LICENSE.txt
*/

(function () {

    "use strict";

    var math = fluid.registerNamespace("c2lc.math");

    math.degrees2radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    math.wrap = function (start, stop, val) {
        return val - (Math.floor((val - start) / (stop - start)) * (stop - start));
    };

})();
