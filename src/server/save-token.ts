import { createDbConnection } from '../library/aux/aux'
import { SqlRequest } from '../library/sql/sql-request'
import { SqlTask } from '../library/sql/sql-task'
import { DbRequest } from '../library/database/db-request'
import { DbTask } from '../library/database/db-task'

export async function saveToken(req, res) {

	//
	// get query data
	let fbId = req['query']['fbId'] as string
	let token = req['query']['token'] as string

	try {

		//
		// start Db connection
		let conn = await createDbConnection()

		//
		// create a new SQL string to save a token
		let sqlReq = SqlRequest.saveToken(fbId, token)
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
				'status': 200,
				'operation': 'saveToken',
				'user': fbId,
				'token': token
			},
			'done': true
		}

		res.status(200).json(response)
	} catch (e) {
		res.status(500).send(e)
	}
}
