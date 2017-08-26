"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var jsSHA = require("jssha");
var mysql = require("promise-mysql");
String.prototype.replaceAll = function (search, replacement) {
    return this.split(search).join(replacement);
};
function getCurrentDate() {
    return moment().format("YYYY-MM-DD[T]HH:mm:ss[Z]");
}
exports.getCurrentDate = getCurrentDate;
function sortObjectKeys(obj) {
    return Object.keys(obj).sort(function (a, b) {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    });
}
exports.sortObjectKeys = sortObjectKeys;
function encodeValue(value) {
    return encodeURI(value)
        .replaceAll('~', '')
        .replaceAll('!', '')
        .replaceAll('@', '')
        .replaceAll('#', '')
        .replaceAll('$', '')
        .replaceAll('&', '%26')
        .replaceAll('*', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('=', '')
        .replaceAll(':', '%3A')
        .replaceAll('\'', '%27')
        .replaceAll('/', '%2F')
        .replaceAll(',', '%2C')
        .replaceAll(';', '')
        .replaceAll('?', '')
        .replaceAll('+', '%2B')
        .replaceAll('\'', '');
}
exports.encodeValue = encodeValue;
function encodeObjectKeysAsQuery(keys, obj) {
    return keys.map(function (key) {
        return key + '=' + encodeValue(obj[key]);
    }).join('&');
}
exports.encodeObjectKeysAsQuery = encodeObjectKeysAsQuery;
function formObjectKeysAsQuery(keys, obj) {
    return keys.map(function (key) {
        return key + '=' + obj[key];
    }).join('&');
}
exports.formObjectKeysAsQuery = formObjectKeysAsQuery;
function getSHA256Signature(url, key) {
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.setHMACKey(key, "TEXT");
    shaObj.update(url);
    return shaObj.getHMAC("B64").replaceAll("+", '%2B').replaceAll("=", '%3D');
}
exports.getSHA256Signature = getSHA256Signature;
function createDbConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });
}
exports.createDbConnection = createDbConnection;
function contains(array, object) {
    return array.filter(function (e) { return e === object; }).length > 0;
}
exports.contains = contains;
