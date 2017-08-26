"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aux_1 = require("../library/aux/aux");
var sql_request_1 = require("../library/sql/sql-request");
var sql_task_1 = require("../library/sql/sql-task");
var db_request_1 = require("../library/database/db-request");
var db_task_1 = require("../library/database/db-task");
var models_1 = require("../library/models");
function getFavouriteProductsForUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var fbId, conn, sqlReq, sql, dbReq, dbResponse, products, response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fbId = req['query']['fbId'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4, aux_1.createDbConnection()];
                case 2:
                    conn = _a.sent();
                    sqlReq = sql_request_1.SqlRequest.getFavouriteProductsForUser(fbId);
                    return [4, new sql_task_1.SqlTask().execute(sqlReq)];
                case 3:
                    sql = _a.sent();
                    dbReq = new db_request_1.DbRequest(sql);
                    return [4, new db_task_1.DbTask(conn).execute(dbReq)];
                case 4:
                    dbResponse = _a.sent();
                    conn.end();
                    products = dbResponse[0].map(function (res) {
                        return new models_1.Product(res['asin'], res['title'], res['amount'], res['price'], res['click'], res['smallIcon'], res['largeIcon'], res['category'], res['isFavourite'] != null);
                    });
                    response = {
                        'meta': {
                            'status': 200,
                            'operation': 'getFavouriteProductsForUser',
                            'user': fbId
                        },
                        'data': products,
                        'count': products.length,
                        'done': true
                    };
                    res.status(200).json(response);
                    return [3, 6];
                case 5:
                    e_1 = _a.sent();
                    res.status(500).send(e_1);
                    return [3, 6];
                case 6: return [2];
            }
        });
    });
}
exports.getFavouriteProductsForUser = getFavouriteProductsForUser;
