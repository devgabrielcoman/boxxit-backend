"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SqlRequest = (function () {
    function SqlRequest(sqlString) {
        this.sqlString = sqlString;
    }
    SqlRequest.prep = function (sql) {
        var arr = sql.split(',');
        return arr.splice(0, arr.length - 1).join(',') + ';';
    };
    SqlRequest.prototype.getSQLString = function () { return this.sqlString; };
    SqlRequest.fbProfile = function (profile) {
        var userId = profile.id != null ? "\"" + profile.id + "\"" : "NULL";
        var name = profile.name != null ? "\"" + profile.name + "\"" : "NULL";
        var email = profile.email != null && profile.email != "" ? "\"" + profile.email + "\"" : "NULL";
        var gender = profile.gender != null ? profile.gender === "male" ? "True" : "False" : "False";
        var bday = '';
        if (profile.birthday != null) {
            var arry = profile.birthday.split('/');
            if (arry.length == 3) {
                bday = "\"" + arry[2] + "-" + arry[0] + "-" + arry[1] + "\"";
            }
            else if (arry.length == 2) {
                bday = "\"2017-" + arry[0] + "-" + arry[1] + "\"";
            }
            else {
                bday = "NULL";
            }
        }
        else {
            bday = "NULL";
        }
        var sql = "replace into boxxit.Users (userId, name, email, isMale, birthday) values (" + userId + ", " + name + ", " + email + ", " + gender + ", " + bday + ");";
        return new SqlRequest(sql);
    };
    SqlRequest.saveToken = function (id, token) {
        var sql = "update boxxit.Users set token = '" + token + "' where userId = '" + id + "';";
        return new SqlRequest(sql);
    };
    SqlRequest.fbFriends = function (profile) {
        var sql = "";
        if (profile.friends != null && profile.friends.data.length > 0) {
            sql += "replace into boxxit.Friends (user1Id, user2Id) values\n";
            profile.friends.data.forEach(function (friend) {
                sql += "('" + profile.id + "', '" + friend.id + "'),\n";
                sql += "('" + friend.id + "', '" + profile.id + "'),\n";
            });
        }
        return new SqlRequest(SqlRequest.prep(sql));
    };
    SqlRequest.fbLikes = function (likes) {
        var sql = "";
        if (likes != null && likes.length > 0) {
            sql += "replace into boxxit.Categories (categId, name, category, searchIndex, isGenre) values\n";
            likes.forEach(function (like) {
                sql += "(\"" + like.id + "\", \"" + like.name.replaceAll("\"", "") + "\", \"" + like.category.replaceAll("\"", "") + "\", \"" + like.searchIndex + "\", " + like.isGenre + "),\n";
            });
        }
        return new SqlRequest(SqlRequest.prep(sql));
    };
    SqlRequest.fbLikesForUser = function (profile, likes) {
        var sql = "";
        if (likes != null && likes.length > 0) {
            sql += "replace into boxxit.UserCategories (userId, categId) values\n";
            likes.forEach(function (like) {
                sql += "(\"" + profile.id + "\", \"" + like.id + "\"),\n";
            });
        }
        return new SqlRequest(SqlRequest.prep(sql));
    };
    SqlRequest.insertProducts = function (products) {
        var sql = "";
        if (products != null && products.length > 0) {
            sql += "replace into boxxit.Products (asin, title, amount, price, click, smallImage, bigImage) values\n";
            products.forEach(function (prod) {
                var asin = prod.asin != null ? "\"" + prod.asin + "\"" : "NULL";
                var title = prod.title != null ? "\"" + prod.title.replaceAll("\n", "").replaceAll('"', '\\"') + "\"" : "NULL";
                var amount = prod.amount != null ? "" + prod.amount + "" : "0";
                var price = prod.price != null && prod.price != "" ? "\"" + prod.price + "\"" : "NULL";
                var click = prod.click != null ? "\"" + prod.click.replaceAll("\n", "") + "\"" : "NULL";
                var small = prod.smallIcon != null ? "\"" + prod.smallIcon.replaceAll("\n", "") + "\"" : "NULL";
                var big = prod.largeIcon != null ? "\"" + prod.largeIcon.replaceAll("\n", "") + "\"" : "NULL";
                sql += "(" + asin + ", " + title + ", " + amount + ", " + price + ", " + click + ", " + small + ", " + big + "),\n";
            });
        }
        return new SqlRequest(SqlRequest.prep(sql));
    };
    SqlRequest.insertProductsForLikes = function (products) {
        var sql = "";
        if (products != null && products.length > 0) {
            sql = "replace into boxxit.CategoriesProducts (categId, asin) values\n";
            products.forEach(function (prod) {
                var categId = prod.categId;
                if (categId != null) {
                    var asin = prod.asin != null ? "\"" + prod.asin + "\"" : "NULL";
                    sql += "(\"" + categId + "\", " + asin + "),\n";
                }
            });
        }
        return new SqlRequest(SqlRequest.prep(sql));
    };
    SqlRequest.markCategoryValue = function (categId, isValuable) {
        var sql = "update boxxit.Categories set isValuable = " + isValuable + " where categId = '" + categId + "';";
        return new SqlRequest(sql);
    };
    SqlRequest.saveProduct = function (id, asin) {
        var sql = "";
        if (id != null && asin != null) {
            sql += "replace into boxxit.Favourites (userId, asin) values (\"" + id + "\", \"" + asin + "\");";
        }
        return new SqlRequest(sql);
    };
    SqlRequest.deleteProduct = function (id, asin) {
        var sql = "";
        if (id != null && asin != null) {
            sql += "delete from boxxit.Favourites where userId = \"" + id + "\" and asin = \"" + asin + "\";";
        }
        return new SqlRequest(sql);
    };
    SqlRequest.getProducts = function (id, min, max) {
        var sql = "call boxxit.getProductsForUser(\"" + id + "\", " + min + ", " + max + ");";
        return new SqlRequest(sql);
    };
    SqlRequest.getFavouriteProductsForUser = function (id) {
        var sql = "call boxxit.getFavouriteProductsForUser(\"" + id + "\");";
        return new SqlRequest(sql);
    };
    SqlRequest.getEmptyCategories = function () {
        var sql = "select id, name, category, searchIndex from boxxit.CategoryNrProducts where nrProducts = 0 and isValuable = true and name <> 'null' limit 10";
        return new SqlRequest(sql);
    };
    SqlRequest.disableFKChecks = function () {
        var sql = "set FOREIGN_KEY_CHECKS = 0;";
        return new SqlRequest(sql);
    };
    SqlRequest.getUpcomingBirthdays = function () {
        var sql = "call boxxit.getUsersToBeNotifiedOfUpcomingBirthdays()";
        return new SqlRequest(sql);
    };
    return SqlRequest;
}());
exports.SqlRequest = SqlRequest;
