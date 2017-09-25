import { createDbConnection } from '../library/aux/aux'
import { SqlRequest } from '../library/sql/sql-request'
import { SqlTask } from '../library/sql/sql-task'
import { DbRequest } from '../library/database/db-request'
import { DbTask } from '../library/database/db-task'
import { Product } from '../library/models'

export async function getProductsForUser(req, res) {

	//
	// get query data
	let fbId = req['query']['fbId'] as string
	var min = req['query']['min'] as number
	min = min != null ? min : 0
	var max = req['query']['max'] as number
	max = max != null ? max : 5000

	try {

		//
		// start Db connection
		let conn = await createDbConnection()

		//
		// create a new SQL string to get 10 random products
		let sqlReq = SqlRequest.getProducts(fbId, min, max)
		let sql = await new SqlTask().execute(sqlReq)

		//
		// execute query to db
		let dbReq = new DbRequest(sql)
		let dbResponse = await new DbTask(conn).execute(dbReq)

		//
		// close connection
		conn.end()

		//
		// return products with all associated info
		let products = dbResponse[0].map(res => {
			return new Product(res['asin'], res['title'], res['amount'], res['price'], res['click'], res['smallIcon'], res['largeIcon'], res['category'], res['isFavourite'] != null, res['isOwn'] != 0)
		})

		//
		// just get one out of each category
		var categDict = {}
		let filtered: Array<Product> = []
		products.forEach((prod: Product) => {
			if (categDict[prod.categId] == null) {
				categDict[prod.categId] = true
				filtered.push(prod)
			}
		})

		//
		// format response
		let response = {
			'meta': {
				'status': 200,
				'operation': 'getProductsForUser',
				'user': fbId
			},
			'data': filtered,
			'count': filtered.length,
			'done': false
		}

		res.status(200).json(response)
	} catch (e) {
		res.status(500).send(e)
	}
}
