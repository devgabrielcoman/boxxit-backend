"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var et = require("elementtree");
var ParseXMLTask = (function () {
    function ParseXMLTask() {
    }
    ParseXMLTask.prototype.execute = function (input) {
        return new Promise(function (resolve, reject) {
            var etree = et.parse(input);
            if (etree != null) {
                resolve(etree);
            }
            else {
                reject('Invalid XML');
            }
        });
    };
    return ParseXMLTask;
}());
exports.ParseXMLTask = ParseXMLTask;
