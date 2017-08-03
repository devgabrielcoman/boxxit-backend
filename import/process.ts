//
//
import * as read from 'read-file'
import * as write from 'write-file'

//
// string extension that allows proper replacement
String.prototype.replaceAll = function(this:string, search:string, replacement:string):string {
        return this.split(search).join(replacement)
}

declare global {
        interface String {
                replaceAll(search:string, replacement:string):string
        }
}

function inverse (value: string): string {
	return value.split('').map(char => {
		if 			(char === 'A') return '9'
		else if (char === 'B') return '8'
		else if (char === 'C') return '7'
		else if (char === 'D') return '6'
		else if (char === 'E') return '5'
		else if (char === 'F') return '4'
		else if (char === 'G') return '3'
		else if (char === 'H') return '2'
		else if (char === 'I') return '1'
		else if (char === 'J') return '0'
		else 									 return char
	}).join('')
}

function processUsers () {

	let data = read.sync('data/users.json', {encoding: 'utf8'})
	let obj = JSON.parse(data)

	var sql = `use boxxit;
set FOREIGN_KEY_CHECKS = 0;\n\n`

	sql += `replace into Users (userId, name, email, isMale, birthday) values\n`

	for (var key in obj) {
		var userId = obj[key]['fbId']
		var email = obj[key]['email']
		var name = obj[key]['name']
		var gender = obj[key]['gender']
		var bday = obj[key]['birthday']

		let iuserId = userId != null ? `"` + userId + `"` : `NULL`;
		let iemail = email != null && email != "" ? `"` + email + `"` : `NULL`;
		let iname = name != null ? `"` + name + `"` : `NULL`;
		let igender = gender != null ? gender === "male" ? `True` : `False` :  `False`;
		let ibday = ``;
		if (bday != null) {
			let arry = bday.split('/')
			if (arry.length == 3) {
				ibday = `'` + arry[2] + `-` + arry[0] + `-` + arry[1] +`'`
			} else if (arry.length == 2) {
				ibday = `'2017-` + arry[0] + `-` + arry[1] + `'`
			} else {
				ibday = `NULL`
			}
		} else {
			ibday = `NULL`
		}

		sql += `(` + iuserId + `, ` + iname + `, ` + iemail + `, ` + igender + `, ` + ibday + `),\n`;
	}

	sql += `\n`
	sql += `set FOREIGN_KEY_CHECKS = 1;`

	write('output/users.sql', sql);
}

function processTokens () {
	let data = read.sync('data/tokens.json', {encoding: 'utf8'})
	let obj = JSON.parse(data)

	var sql = `use boxxit;
set FOREIGN_KEY_CHECKS = 0;\n\n`

	for (var key in obj) {
		let userId = inverse(key)
		let token = obj[key]

		sql += `update Users set token = '` + token + `' where userId = '` + userId + `';\n`;
	}

	sql += `\n`
	sql += `set FOREIGN_KEY_CHECKS = 1;`

	write('output/tokens.sql', sql);
}

function processFriends() {
	let data = read.sync('data/friends.json', {encoding: 'utf8'})
	let obj = JSON.parse(data)

	var sql = `use boxxit;
	set FOREIGN_KEY_CHECKS = 0;\n\n`

	sql += `replace into Friends (user1Id, user2Id) values\n`

	for (var key in obj) {
		let user1Id = inverse(key)
		let friends = obj[key]

		if (friends != null) {
			for (var user2Id in friends) {
				sql += `('` + user1Id + `', '` + inverse(user2Id) + `'),\n`;
			}
		}
	}

	sql += `\n`
	sql += `set FOREIGN_KEY_CHECKS = 1;`

	write('output/friends.sql', sql);

}

function processProduts () {

	let data = read.sync('data/products.json', {encoding: 'utf8'})
	let obj = JSON.parse(data)

	var sql = `use boxxit;
set FOREIGN_KEY_CHECKS = 0;\n\n`

	sql += `replace into Products (asin, title, amount, price, click, smallImage, bigImage) values\n`

	for (var key in obj) {
		let asin = obj[key]['asin']
		let title = obj[key]['title']
		let amount = obj[key]['amount']
		let price = obj[key]['price']
		let click = obj[key]['click']
		let small = obj[key]['smallIcon']
		let big = obj[key]['largeIcon']

		let iasin = asin != null ? `"` + asin + `"` : `NULL`;
		let ititle = title != null ? `"` + title.replaceAll("\n", "").replaceAll('"', '\\"') + `"` : `NULL`;
		let iamount = amount != null ? `` + amount + `` : `0`;
		let iprice = price != null && price != "" ? `"` + price + `"` : `NULL`;
		let iclick = click != null ? `"` + click.replaceAll("\n", "") + `"` : `NULL`;
		let ismall = small != null ? `"` + small.replaceAll("\n", "") + `"` : `NULL`;
		let ibig = big != null ? `"` + big.replaceAll("\n", "") + `"` : `NULL`;

		sql += `(` + iasin + `, ` + ititle + `, ` + iamount + `, ` + iprice + `, ` + iclick + `, ` + ismall + `, ` + ibig + `),\n`;
	}

	sql += `("000000", NULL, 0, NULL, NULL, NULL, NULL);`;

	sql += `\n`
	sql += `set FOREIGN_KEY_CHECKS = 1;`

	write('output/products.sql', sql);
}

function processCategories () {

	let data = read.sync('data/categories.json', {encoding: 'utf8'})
	let obj = JSON.parse(data)

	var sql = `use boxxit;
set FOREIGN_KEY_CHECKS = 0;\n\n`

	sql += `replace into Categories (categId, name) values\n`

	for (var key in obj) {
		var categId = inverse(key);
		var name = obj[key]['name']

		var iname = name != null ? `"` + name.replaceAll("\n", "").replaceAll('"', '\\"') + `"` : `NULL`;

		sql += `("` + categId + `", ` + iname + `),\n`;
	}

	sql += `\n`
	sql += `set FOREIGN_KEY_CHECKS = 1;`

	write('output/categories.sql', sql);
}

function processCategoryProducts () {

	let data = read.sync('data/categories.json', {encoding: 'utf8'})
	let obj = JSON.parse(data)

	var sql = `use boxxit;
set FOREIGN_KEY_CHECKS = 0;\n\n`

	sql += `insert into CategoriesProducts (categId, asin) values\n`

	for (var key in obj) {
		var categId = inverse(key)
		var prods = obj[key]['products']
		if (prods != null || prods.length > 0) {
			for (var prod in prods) {
				if (prod != "null") {
					sql += `("` + categId + `", "` + prod + `"),\n`;
				} else {
					sql += `("` + categId + `", "000000"),\n`
				}
			}
		} else {
			sql += `("` + categId + `", "000000"),\n`
		}
	}

	sql += `\n`
	sql += `set FOREIGN_KEY_CHECKS = 1;`

	write('output/categprods.sql', sql);
}

function processUserCategs () {

	let data = read.sync('data/user_categories.json', {encoding: 'utf8'})
	let obj = JSON.parse(data)

	var sql = `use boxxit;
set FOREIGN_KEY_CHECKS = 0;\n\n`

	sql += `insert into UserCategories (userId, categId) values\n`

	for (var key in obj) {
		var userId = inverse(key)
		var categs = obj[key]
		if (categs != null) {
			for (var categId in categs) {
				if (categId != "null") {
					sql += `("` + userId + `", "` + inverse(categId) + `"),\n`;
				}
			}
		}
	}

	sql += `\n`
	sql += `set FOREIGN_KEY_CHECKS = 1;`

	write('output/usercategs.sql', sql);
}

function processFavourites () {

	let data = read.sync('data/favourites.json', {encoding: 'utf8'})
	let obj = JSON.parse(data)

	var sql = `use boxxit;
set FOREIGN_KEY_CHECKS = 0;\n\n`

	sql += `insert into Favourites (userId, asin) values\n`

	for (var key in obj) {
		var userId = inverse(key)
		var favs = obj[key]
		if (favs != null) {
			for (var asin in favs) {
				if (asin != "null") {
					sql += `("` + userId + `", "` + asin + `"),\n`;
				}
			}
		}
	}

	sql += `\n`
	sql += `set FOREIGN_KEY_CHECKS = 1;`

	write('output/favourites.sql', sql);
}

processUsers()
processTokens()
processFriends()
processProduts()
processCategories()
processCategoryProducts()
processUserCategs ()
processFavourites ()
