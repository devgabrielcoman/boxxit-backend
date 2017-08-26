"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransformFbLikesTask = (function () {
    function TransformFbLikesTask() {
    }
    TransformFbLikesTask.prototype.execute = function (input) {
        var _this = this;
        var result = input.map(function (value) {
            return _this.parseBulk(value);
        })
            .map(function (bulk) {
            return bulk.body.data;
        })
            .reduce(function (acc, cur) {
            return acc.concat(cur);
        });
        return Promise.resolve(result);
    };
    TransformFbLikesTask.prototype.parseBulk = function (input) {
        var result = input;
        result['body'] = JSON.parse(result['body']);
        return result;
    };
    return TransformFbLikesTask;
}());
exports.TransformFbLikesTask = TransformFbLikesTask;
