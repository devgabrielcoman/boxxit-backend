import { createDbConnection } from '../library/aux/aux'
import { SqlRequest } from '../library/sql/sql-request'
import { SqlTask } from '../library/sql/sql-task'
import { DbRequest } from '../library/database/db-request'
import { DbTask } from '../library/database/db-task'
import { NetworkRequest } from '../library/network/network-request'
import { NetworkTask } from '../library/network/network-task'
import { BirthdayNotification } from '../library/models'

async function notifyOfBirthday(days: number): Promise<any> {
	//
	// start Db connection
	let conn = await createDbConnection()

	//
	// create a new SQL string to get all favourite products
	let sqlReq = SqlRequest.getUpcomingBirthdays(days)
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
	// execute
	let requests = notifs.map((notif: BirthdayNotification) => {
		return NetworkRequest.sendBirthdayNotification(notif)
	})
	let notifTasks = requests.map((request: NetworkRequest) => {
		return new NetworkTask().execute(request)
	})
	let results = await Promise.all(notifTasks)

	//
	// return
	return Promise.resolve({
		'info': notifs,
		'fcm': results
	})
}

export async function notifyTwoWeeks (req, res) {
	try {

		//
		// perform
		let results = await notifyOfBirthday(14)

		//
		// format response
		let response = {
			'data': results,
			'status': 200,
			'done': true
		}

		res.status(200).json(response)

	} catch (e) {
		res.status(500).send(e)
	}
}

export async function notifyOneWeek (req, res) {
	try {

		//
		// perform
		let results = await notifyOfBirthday(7)

		//
		// format response
		let response = {
			'data': results,
			'status': 200,
			'done': true
		}

		res.status(200).json(response)

	} catch (e) {
		res.status(500).send(e)
	}
}
