"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DbTask = (function () {
    function DbTask(conn) {
        this.conn = conn;
    }
    DbTask.prototype.execute = function (input) {
        if (input == null || input.query === "" || input.query === ";") {
            return Promise.resolve();
        }
        else {
            return this.conn.query(input.query);
        }
    };
    return DbTask;
}());
exports.DbTask = DbTask;
