import { createDbConnection } from '../library/aux/aux'
import { SqlRequest } from '../library/sql/sql-request'
import { SqlTask } from '../library/sql/sql-task'
import { DbRequest } from '../library/database/db-request'
import { DbTask } from '../library/database/db-task'
import { Product } from '../library/models'

export async function getFavouriteProductsForUser(req, res) {

	//
	// get query data
	let fbId = req['query']['fbId'] as string

	try {

		//
		// start Db connection
		let conn = await createDbConnection()

		//
		// create a new SQL string to get all favourite products
		let sqlReq = SqlRequest.getFavouriteProductsForUser(fbId)
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
			return new Product(res['asin'], res['title'], res['amount'], res['price'], res['click'], res['smallIcon'], res['largeIcon'], res['category'], res['isFavourite'] != null)
		})

		//
		// format response
		let response = {
			'meta': {
				'status': 200,
				'operation': 'getFavouriteProductsForUser',
				'user': fbId
			},
			'data': products,
			'count': products.length,
			'done': true
		}

		res.status(200).json(response)
	} catch (e) {
		res.status(500).send(e)
	}
}
