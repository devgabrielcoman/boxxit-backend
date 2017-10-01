import { createDbConnection } from '../library/aux/aux'
import { SqlRequest } from '../library/sql/sql-request'
import { SqlTask } from '../library/sql/sql-task'
import { DbRequest } from '../library/database/db-request'
import { DbTask } from '../library/database/db-task'
import { Product } from '../library/models'

export async function deleteProduct(req, res) {

	//
	// get query data
	let fbId = req['query']['fbId'] as string
	let asin = req['query']['asin'] as string

	try {

		//
		// start Db connection
		let conn = await createDbConnection()

		//
		// create a new SQL string to delete a product
		let sqlReq = SqlRequest.deleteProduct(fbId, asin)
		let sql = await new SqlTask().execute(sqlReq)

		//
		// execute query to db
		let dbReq = new DbRequest(sql)
		let dbResponse = await new DbTask(conn).execute(dbReq)

		//
		// close connection
		conn.end()

		//
		// format response
		let response = {
			'meta': {
				'done': true,
				'operation': 'deleteProduct',
				'user': fbId,
				'product': asin
			},
			'status': 200
		}

		res.status(200).json(response)
	} catch (e) {
		res.status(500).send(e)
	}
}
