"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aux = require("../aux/aux");
var NetworkRequest = (function () {
    function NetworkRequest(method, proto, domain, path, params, isSigned, headers, body) {
        if (headers === void 0) { headers = null; }
        if (body === void 0) { body = null; }
        this.headers = null;
        this.body = null;
        this.method = method;
        this.proto = proto;
        this.domain = domain;
        this.path = path;
        this.params = params;
        this.isSigned = isSigned;
        this.headers = headers;
        this.body = body;
    }
    NetworkRequest.prototype.getMethod = function () { return this.method; };
    NetworkRequest.prototype.getProto = function () { return this.proto; };
    NetworkRequest.prototype.getDomain = function () { return this.domain; };
    NetworkRequest.prototype.getPath = function () { return this.path; };
    NetworkRequest.prototype.getParams = function () { return this.params; };
    NetworkRequest.prototype.shouldSign = function () { return this.isSigned; };
    NetworkRequest.prototype.getHeaders = function () { return this.headers; };
    NetworkRequest.prototype.getBody = function () { return this.body; };
    NetworkRequest.fbProfile = function (id, token) {
        return new NetworkRequest('GET', 'https://', 'graph.facebook.com', '/v2.8/' + id, {
            'fields': 'id, email, gender, name, birthday, friends{id}',
            'access_token': token
        }, false);
    };
    NetworkRequest.fbLikes = function (id, token) {
        return new NetworkRequest('POST', 'https://', 'graph.facebook.com', '/v2.8', {
            'include_headers': false,
            'access_token': token,
            'batch': '[' + [
                '{ "method": "GET", "relative_url": "' + id + '/likes?fields=id,name,category,genre%26limit=1000" }',
                '{ "method": "GET", "relative_url": "' + id + '/books?fields=id,name,category,genre%26limit=1000" }',
                '{ "method": "GET", "relative_url": "' + id + '/games?fields=id,name,category,genre%26limit=1000" }',
                '{ "method": "GET", "relative_url": "' + id + '/movies?fields=id,name,category,genre%26limit=1000" }',
                '{ "method": "GET", "relative_url": "' + id + '/music?fields=id,name,category,genre%26limit=1000" }',
                '{ "method": "GET", "relative_url": "' + id + '/television?fields=id,name,category,genre%26limit=1000" }'
            ].join(',') + ']'
        }, false);
    };
    NetworkRequest.keywordSearch = function (keyword, searchIndex) {
        return new NetworkRequest('GET', 'https://', 'webservices.amazon.co.uk', '/onca/xml', {
            'Service': 'AWSECommerceService',
            'Operation': 'ItemSearch',
            'SearchIndex': searchIndex,
            'Timestamp': aux.getCurrentDate(),
            'ResponseGroup': 'ItemIds,Images,Small,Offers',
            'AWSAccessKeyId': process.env.AWS_ID,
            'AssociateTag': process.env.AWS_TAG,
            'MinimumPrice': '500',
            'MaximumPrice': '5000',
            'Keywords': keyword
        }, true);
    };
    NetworkRequest.itemLookup = function (items) {
        return new NetworkRequest('GET', 'https://', 'webservices.amazon.co.uk', '/onca/xml', {
            'Service': 'AWSECommerceService',
            'Operation': 'ItemLookup',
            'Timestamp': aux.getCurrentDate(),
            'ResponseGroup': 'ItemIds,Images,Small,Offers',
            'AWSAccessKeyId': process.env.AWS_ID,
            'AssociateTag': process.env.AWS_TAG,
            'ItemId': items.join(',')
        }, true);
    };
    NetworkRequest.sendBirthdayNotification = function (token, friendId, message) {
        return new NetworkRequest('POST', 'https://', 'gcm-http.googleapis.com', '/gcm/send', {}, false, {
            'Content-Type': 'application/json',
            'Authorization': 'key=' + process.env.FIR_KEY
        }, {
            'notification': {
                'body': message,
            },
            'data': {
                'friendId': friendId
            },
            'to': token
        });
    };
    return NetworkRequest;
}());
exports.NetworkRequest = NetworkRequest;
