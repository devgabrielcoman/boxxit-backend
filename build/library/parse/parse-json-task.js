"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParseJsonTask = (function () {
    function ParseJsonTask() {
    }
    ParseJsonTask.prototype.execute = function (input) {
        return new Promise(function (resolve, reject) {
            try {
                var parsed = JSON.parse(input);
                resolve(parsed);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    return ParseJsonTask;
}());
exports.ParseJsonTask = ParseJsonTask;
