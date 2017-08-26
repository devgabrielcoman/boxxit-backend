"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SqlTask = (function () {
    function SqlTask() {
    }
    SqlTask.prototype.execute = function (input) {
        return Promise.resolve(input.getSQLString());
    };
    return SqlTask;
}());
exports.SqlTask = SqlTask;
