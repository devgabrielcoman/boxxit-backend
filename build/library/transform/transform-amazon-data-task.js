"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var models_2 = require("../models");
var TransformAmazonDataTask = (function () {
    function TransformAmazonDataTask(categId, categName) {
        this.categId = categId;
        this.cagetName = categName;
    }
    TransformAmazonDataTask.prototype.findNoResultsErrors = function (input) {
        var possibleNoResultsError = input.findall('./Items/Request/Errors');
        var result = false;
        possibleNoResultsError.forEach(function (err) {
            var code = err.findtext('./Error/Code');
            if (code.indexOf('NoExactMatches') !== -1) {
                result = true;
            }
        });
        return result;
    };
    TransformAmazonDataTask.prototype.findThrottleErrors = function (input) {
        var possibleThrottleError = input.findall('./Error');
        var result = false;
        possibleThrottleError.forEach(function (err) {
            var code = err.findtext('./Code');
            if (code.indexOf('RequestThrottled') !== -1) {
                result = true;
            }
        });
        return result;
    };
    TransformAmazonDataTask.prototype.findItems = function (input) {
        var _this = this;
        var items = input.findall('./Items/Item');
        return items.map(function (item) {
            var asin = item.findtext('./ASIN');
            var title = item.findtext('./ItemAttributes/Title');
            var click = item.findtext('./DetailPageURL');
            var smallIcon = item.findtext('./SmallImage/URL');
            var largeIcon = item.findtext('./LargeImage/URL');
            var offers = item.findall('./Offers/Offer');
            var amount = 0;
            var price = '';
            offers.forEach(function (item) {
                price = item.findtext('./OfferListing/Price/FormattedPrice');
                try {
                    amount = Number(item.findtext('./OfferListing/Price/Amount'));
                }
                catch (e) {
                }
            });
            return new models_1.Product(asin, title, amount, price, click, smallIcon, largeIcon, _this.categId);
        });
    };
    TransformAmazonDataTask.prototype.execute = function (input) {
        var result = new models_2.ProductResult();
        result.categId = this.categId;
        result.categName = this.cagetName;
        result.noResultsError = this.findNoResultsErrors(input);
        result.throttleError = this.findThrottleErrors(input);
        result.products = this.findItems(input);
        return Promise.resolve(result);
    };
    return TransformAmazonDataTask;
}());
exports.TransformAmazonDataTask = TransformAmazonDataTask;
