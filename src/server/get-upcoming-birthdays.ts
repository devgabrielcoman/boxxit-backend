import { createDbConnection } from '../library/aux/aux'
import { SqlRequest } from '../library/sql/sql-request'
import { SqlTask } from '../library/sql/sql-task'
import { DbRequest } from '../library/database/db-request'
import { DbTask } from '../library/database/db-task'
import { BirthdayNotification } from '../library/models'

export async function getUpcomingBirthdays (req, res) {
	try {

		//
		// start Db connection
		let conn = await createDbConnection()

		//
		// create a new SQL string to get all favourite products
		let sqlReq = SqlRequest.getUpcomingBirthdays()
		let sql = await new SqlTask().execute(sqlReq)

		//
		// execute query to db
		let dbReq = new DbRequest(sql)
		let dbResponse = await new DbTask(conn).execute(dbReq)

		//
		// close connection
		conn.end()

		let notifs = dbResponse[0].map(res => {
			return new BirthdayNotification(res['wisherToken'], res['friendId'], res['message'])
		})

		//
		// format response
		let response = {
			'data': notifs,
			'count': notifs.length,
			'status': 200,
			'done': true
		}

		res.status(200).json(response)

	} catch (e) {
		res.status(500).send(e)
	}
}
