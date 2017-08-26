"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FbLike = (function () {
    function FbLike(id, name) {
        this.isGenre = false;
        this.id = id;
        this.name = name;
    }
    return FbLike;
}());
exports.FbLike = FbLike;
var FbLikes = (function () {
    function FbLikes() {
        this.data = [];
    }
    return FbLikes;
}());
exports.FbLikes = FbLikes;
var FbBulkResponse = (function () {
    function FbBulkResponse() {
    }
    return FbBulkResponse;
}());
exports.FbBulkResponse = FbBulkResponse;
var FbFriend = (function () {
    function FbFriend() {
    }
    return FbFriend;
}());
exports.FbFriend = FbFriend;
var FbFriends = (function () {
    function FbFriends() {
        this.data = [];
    }
    return FbFriends;
}());
exports.FbFriends = FbFriends;
var FbProfile = (function () {
    function FbProfile() {
    }
    return FbProfile;
}());
exports.FbProfile = FbProfile;
var ProductResult = (function () {
    function ProductResult() {
        this.products = [];
        this.throttleError = false;
        this.noResultsError = false;
    }
    return ProductResult;
}());
exports.ProductResult = ProductResult;
var Product = (function () {
    function Product(asin, title, amount, price, click, smallIcon, largeIcon, categId, isFavourite) {
        if (asin === void 0) { asin = null; }
        if (title === void 0) { title = null; }
        if (amount === void 0) { amount = 0; }
        if (price === void 0) { price = '£0'; }
        if (click === void 0) { click = null; }
        if (smallIcon === void 0) { smallIcon = null; }
        if (largeIcon === void 0) { largeIcon = null; }
        if (categId === void 0) { categId = null; }
        if (isFavourite === void 0) { isFavourite = false; }
        this.asin = asin;
        this.title = title;
        this.amount = amount;
        this.price = price;
        this.click = click;
        this.smallIcon = smallIcon;
        this.largeIcon = largeIcon;
        this.categId = categId;
        this.isFavourite = isFavourite;
    }
    return Product;
}());
exports.Product = Product;
var BirthdayNotification = (function () {
    function BirthdayNotification(token, friendId, message) {
        this.wisherToken = token;
        this.friendId = friendId;
        this.message = message;
    }
    return BirthdayNotification;
}());
exports.BirthdayNotification = BirthdayNotification;
