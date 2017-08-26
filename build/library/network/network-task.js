"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aux = require("../aux/aux");
var request = require("request");
var NetworkTask = (function () {
    function NetworkTask() {
    }
    NetworkTask.prototype.execute = function (input) {
        var url = "";
        var keys = aux.sortObjectKeys(input.getParams());
        if (!input.shouldSign()) {
            var query = aux.formObjectKeysAsQuery(keys, input.getParams());
            url = input.getProto() + input.getDomain() + input.getPath() + '?' + query;
        }
        else {
            var query = aux.encodeObjectKeysAsQuery(keys, input.getParams());
            var canonical = [input.getMethod(), input.getDomain(), input.getPath(), query].join('\n');
            var signature = aux.getSHA256Signature(canonical, process.env.AWS_KEY);
            url = input.getProto() + input.getDomain() + input.getPath() + '?' + query + '&Signature=' + signature;
        }
        var requestOptions = {
            'method': input.getMethod(),
            'uri': url
        };
        if (input.getHeaders() != null) {
            requestOptions['headers'] = input.getHeaders();
        }
        if (input.getBody() != null) {
            requestOptions['body'] = JSON.stringify(input.getBody());
        }
        return new Promise(function (resolve, reject) {
            request(requestOptions, function (error, response, body) {
                if (error == null) {
                    resolve(body);
                }
                else {
                    reject(error);
                }
            });
        });
    };
    return NetworkTask;
}());
exports.NetworkTask = NetworkTask;
