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
var get_product_data_1 = require("./aux/get-product-data");
var write_product_data_1 = require("./aux/write-product-data");
var network_request_1 = require("../library/network/network-request");
var network_task_1 = require("../library/network/network-task");
var parse_json_task_1 = require("../library/parse/parse-json-task");
var transform_fb_likes_task_1 = require("../library/transform/transform-fb-likes-task");
var transform_fb_profile_task_1 = require("../library/transform/transform-fb-profile-task");
var sql_request_1 = require("../library/sql/sql-request");
var sql_task_1 = require("../library/sql/sql-task");
var db_request_1 = require("../library/database/db-request");
var db_task_1 = require("../library/database/db-task");
var models_1 = require("../library/models");
function populateUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var token, fbId, conn_1, profileReq, profileData, profileJSON, profile, likesReq, likesData, likesJSON, allLikes, categs_1, filtered, fin, flags, likes, sqlReqs, sqlTasks, sqls, dbReq, dbTasks, profileResults, productResults, dbResult, response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = req['query']['fbToken'];
                    fbId = req['query']['fbId'];
                    fbId = fbId == null ? 'me' : fbId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 13, , 14]);
                    return [4, aux_1.createDbConnection()];
                case 2:
                    conn_1 = _a.sent();
                    profileReq = network_request_1.NetworkRequest.fbProfile(fbId, token);
                    return [4, new network_task_1.NetworkTask().execute(profileReq)];
                case 3:
                    profileData = _a.sent();
                    return [4, new parse_json_task_1.ParseJsonTask().execute(profileData)];
                case 4:
                    profileJSON = _a.sent();
                    return [4, new transform_fb_profile_task_1.TransformFbProfileTask().execute(profileJSON)];
                case 5:
                    profile = _a.sent();
                    likesReq = network_request_1.NetworkRequest.fbLikes(fbId, token);
                    return [4, new network_task_1.NetworkTask().execute(likesReq)];
                case 6:
                    likesData = _a.sent();
                    return [4, new parse_json_task_1.ParseJsonTask().execute(likesData)];
                case 7:
                    likesJSON = _a.sent();
                    return [4, new transform_fb_likes_task_1.TransformFbLikesTask().execute(likesJSON)];
                case 8:
                    allLikes = _a.sent();
                    categs_1 = {
                        'Books & Magazines': 'Books',
                        'Book': 'Books',
                        'Book Series': 'Books',
                        'Author': 'Books',
                        'Writer': 'Books',
                        'Show': 'DVD',
                        'TV': 'DVD',
                        'Movie': 'DVD',
                        'TV Show': 'DVD',
                        'Movie Character': 'DVD',
                        'Actor': 'DVD',
                        'Film Director': 'DVD',
                        'Album': 'Music',
                        'Song': 'Music',
                        'Symphony': 'Music',
                        'Band': 'Music',
                        'Musician/Band': 'Music',
                        'Musician': 'Music',
                        'Orchestra': 'Music',
                        'Board Game': 'VideoGames',
                        'Video Game': 'VideoGames',
                        'Games/Toys': 'VideoGames',
                        'Artist': 'All',
                        'Athlete': 'All',
                        'Comedian': 'All',
                        'Entrepreneur': 'All',
                        'Scientist': 'All',
                        'Wine/Spirits': 'All',
                        'Drink': 'All',
                        'Arts & Humanities Website': 'All'
                    };
                    filtered = new Array();
                    allLikes.forEach(function (like) {
                        var c = categs_1[like.category];
                        if (c != null) {
                            like.searchIndex = c;
                            like.isGenre = false;
                            filtered.push(like);
                        }
                    });
                    fin = filtered;
                    filtered.forEach(function (like) {
                        if (like.genre != null) {
                            var genres = like.genre.split(',');
                            genres.forEach(function (genre) {
                                var igenres = genre.split('/');
                                igenres.forEach(function (name) {
                                    var l = new models_1.FbLike(name.trim(), name.trim());
                                    l.searchIndex = like.searchIndex;
                                    l.category = like.category;
                                    l.isGenre = true;
                                    fin.push(l);
                                });
                            });
                        }
                    });
                    flags = {};
                    likes = fin.filter(function (like) {
                        if (flags[like.name]) {
                            return false;
                        }
                        flags[like.name] = true;
                        return true;
                    });
                    sqlReqs = [
                        sql_request_1.SqlRequest.disableFKChecks(),
                        sql_request_1.SqlRequest.fbProfile(profile),
                        sql_request_1.SqlRequest.fbFriends(profile),
                        sql_request_1.SqlRequest.fbLikes(likes),
                        sql_request_1.SqlRequest.fbLikesForUser(profile, likes)
                    ];
                    sqlTasks = sqlReqs.map(function (req) {
                        return new sql_task_1.SqlTask().execute(req);
                    });
                    return [4, Promise.all(sqlTasks)];
                case 9:
                    sqls = _a.sent();
                    dbReq = sqls.map(function (sqlString) {
                        return new db_request_1.DbRequest(sqlString);
                    });
                    dbTasks = dbReq.map(function (dbReq) {
                        return new db_task_1.DbTask(conn_1).execute(dbReq);
                    });
                    return [4, Promise.all(dbTasks)];
                case 10:
                    profileResults = _a.sent();
                    return [4, get_product_data_1.getProductData(conn_1, likes.splice(0, 7))];
                case 11:
                    productResults = _a.sent();
                    return [4, write_product_data_1.writeProductData(conn_1, productResults)];
                case 12:
                    dbResult = _a.sent();
                    conn_1.end();
                    response = {
                        'meta': {
                            'status': 200,
                            'operation': 'populateUserProfile'
                        },
                        'done': true,
                        'result': {
                            'user': profile.id,
                            'name': profile.name,
                            'likes': likes.map(function (like) { return like.name; }),
                            'products': dbResult
                        }
                    };
                    res.status(200).json(response);
                    return [3, 14];
                case 13:
                    e_1 = _a.sent();
                    res.status(500).send(e_1);
                    return [3, 14];
                case 14: return [2];
            }
        });
    });
}
exports.populateUserProfile = populateUserProfile;
