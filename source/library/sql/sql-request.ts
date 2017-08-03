//
// imports
import { Request } from '../request'

import { FbProfile } from '../models'
import { FbFriend } from '../models'
import { FbBulkResponse } from '../models'
import { FbLikes } from '../models'
import { FbLike } from '../models'
import { Product } from '../models'

import * as aux from '../aux/aux'

export class SqlRequest implements Request {

	sqlString: string

	constructor(sqlString: string) {
		this.sqlString = sqlString
	}

	private static prep(sql: string): string {
		var arr = sql.split(',')
		return arr.splice(0, arr.length - 1).join(',') + ';'
	}

	getSQLString(): string { return this.sqlString }

	//
	// static method that processes FbProfile data into SQL queries
	static fbProfile(profile: FbProfile): SqlRequest {

		let userId = profile.id != null ? `"` + profile.id + `"` : `NULL`;
		let name = profile.name != null ? `"` + profile.name + `"` : `NULL`;
		let email = profile.email != null && profile.email != "" ? `"` + profile.email + `"` : `NULL`;
		let gender = profile.gender != null ? profile.gender === "male" ? `True` : `False` :  `False`;
		let bday = ''
		if (profile.birthday != null) {
			let arry = profile.birthday.split('/')
			if (arry.length == 3) {
				bday = `"` + arry[2] + `-` + arry[0] + `-` + arry[1] +`"`
			} else if (arry.length == 2) {
				bday = `"2017-` + arry[0] + `-` + arry[1] + `"`
			} else {
				bday = `NULL`
			}
		} else {
			bday = `NULL`
		}

		let sql = `replace into boxxit.Users (userId, name, email, isMale, birthday) values (` + userId + `, ` + name + `, ` + email + `, ` + gender + `, ` + bday + `);`

		return new SqlRequest(sql)
	}

	//
	// static method to save a token
	static saveToken(id: String, token: String): SqlRequest {

		var sql = `update boxxit.Users set token = '` + token + `' where userId = '` + id + `';`;

		return new SqlRequest(sql)
	}

	//
	// static method that processes FbFriends data into SQL queries
	static fbFriends(profile: FbProfile): SqlRequest {

		var sql = ``

		if (profile.friends != null && profile.friends.data.length > 0) {

			sql += `replace into boxxit.Friends (user1Id, user2Id) values\n`

			profile.friends.data.forEach((friend: FbFriend) => {
				sql += `('` + profile.id + `', '` + friend.id + `'),\n`
				sql += `('` + friend.id + `', '` + profile.id + `'),\n`
			})

		}

		return new SqlRequest(SqlRequest.prep(sql))
	}

	//
	// static method that processes FbLikes data into SQL queries
	static fbLikes(likes: Array<FbLike>): SqlRequest {

		var sql = ``

		if (likes != null && likes.length > 0) {
			sql += `replace into boxxit.Categories (categId, name, category, searchIndex, isGenre) values\n`

			likes.forEach((like: FbLike) => {
				sql += `("` + like.id + `", "` + like.name.replaceAll("\"", "") + `", "` + like.category.replaceAll("\"", "") + `", "` + like.searchIndex + `", ` + like.isGenre + `),\n`
			})
		}

		return new SqlRequest(SqlRequest.prep(sql))
	}

	//
	// static method that processes FbLikes IDs for each user
	static fbLikesForUser(profile: FbProfile, likes: Array<FbLike>): SqlRequest {

		var sql = ``

		if (likes != null && likes.length > 0) {
			sql += `replace into boxxit.UserCategories (userId, categId) values\n`

			likes.forEach((like: FbLike) => {
				sql += `("` + profile.id + `", "` + like.id + `"),\n`
			})
		}

		return new SqlRequest(SqlRequest.prep(sql))
	}

	//
	// static method that processes products data into SQL queries
	static insertProducts(products: Array<Product>): SqlRequest {

		var sql = ``

		if (products != null && products.length > 0) {
			sql += `replace into boxxit.Products (asin, title, amount, price, click, smallImage, bigImage) values\n`

			products.forEach((prod: Product) => {
				let asin = prod.asin != null ? `"` + prod.asin + `"` : `NULL`;
				let title = prod.title != null ? `"` + prod.title.replaceAll("\n", "").replaceAll('"', '\\"') + `"` : `NULL`;
				let amount = prod.amount != null ? `` + prod.amount + `` : `0`;
				let price = prod.price != null && prod.price != "" ? `"` + prod.price + `"` : `NULL`;
				let click = prod.click != null ? `"` + prod.click.replaceAll("\n", "") + `"` : `NULL`;
				let small = prod.smallIcon != null ? `"` + prod.smallIcon.replaceAll("\n", "") + `"` : `NULL`;
				let big = prod.largeIcon != null ? `"` + prod.largeIcon.replaceAll("\n", "") + `"` : `NULL`;

				sql += `(` + asin + `, ` + title + `, ` + amount + `, ` + price + `, ` + click + `, ` + small + `, ` + big + `),\n`;
			})
		}

		return new SqlRequest(SqlRequest.prep(sql))
	}

	static insertProductsForLikes(products: Array<Product>): SqlRequest {

		var sql = ``

		if (products != null && products.length > 0) {
			sql = `replace into boxxit.CategoriesProducts (categId, asin) values\n`

			products.forEach((prod: Product) => {
				var categId = prod.categId
				if (categId != null) {
					var asin = prod.asin != null ? `"` + prod.asin + `"` : `NULL`;
					sql += `("` + categId + `", ` + asin + `),\n`;
				}
			})
		}

		return new SqlRequest(SqlRequest.prep(sql))
	}

	static markCategoryValue(categId: string, isValuable: boolean): SqlRequest {

		var sql = `update boxxit.Categories set isValuable = ` + isValuable + ` where categId = '` + categId + `';`;
		return new SqlRequest(sql)
	}

	//
	// static method that processes save request to SQL
	static saveProduct(id: string, asin: string): SqlRequest {

		var sql = ``
		if (id != null && asin != null) {
			sql += `replace into boxxit.Favourites (userId, asin) values ("` + id + `", "` + asin + `");`
		}

		return new SqlRequest(sql)
	}

	//
	// static method that processes delete request to SQL
	static deleteProduct(id: string, asin: string): SqlRequest {

		var sql = ``
		if (id != null && asin != null) {
			sql += `delete from boxxit.Favourites where userId = "` + id + `" and asin = "` + asin + `";`
		}

		return new SqlRequest(sql)
	}

	//
	// static method that processes call to get products
	static getProducts(id: string, min: number, max: number): SqlRequest {
		let sql = `call boxxit.getProductsForUser("` + id + `", ` + min + `, ` + max + `);`
		return new SqlRequest(sql)
	}

	//
	// get fav products
	// @param id
	static getFavouriteProductsForUser(id: string): SqlRequest {
		let sql = `call boxxit.getFavouriteProductsForUser("` + id + `");`
		return new SqlRequest(sql)
	}

	//
	// get categories to populate
	static getEmptyCategories(): SqlRequest {
		let sql = `select id, name, category, searchIndex from boxxit.CategoryNrProducts where nrProducts = 0 and isValuable = true and name <> 'null' limit 10`
		return new SqlRequest(sql)
	}

	//
	// get
	static disableFKChecks(): SqlRequest {
		let sql = `set FOREIGN_KEY_CHECKS = 0;`
		return new SqlRequest(sql)
	}

	//
	// get upcoming birthdays
	static getUpcomingBirthdays(): SqlRequest {
		let sql = `call boxxit.getUsersToBeNotifiedOfUpcomingBirthdays()`
		return new SqlRequest(sql)
	}
}
