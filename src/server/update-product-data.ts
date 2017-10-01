import { createDbConnection } from '../library/aux/aux'
import { SqlRequest } from '../library/sql/sql-request'
import { SqlTask } from '../library/sql/sql-task'
import { DbRequest } from '../library/database/db-request'
import { DbTask } from '../library/database/db-task'
import { NetworkRequest } from '../library/network/network-request'
import { NetworkTask } from '../library/network/network-task'
import { ParseXMLTask } from '../library/parse/parse-xml-task'
import { TransformAmazonProductsTask } from '../library/transform/transform-amazon-products-task'

export async function updateProductData (req, res) {

	try {
		//
		// start Db connection
	  let conn = await createDbConnection()

		let sqlReq = SqlRequest.getProductsToUpdate()
		let sqlString = await new SqlTask().execute(sqlReq)
		let dbReq = new DbRequest(sqlString)
		let dbResult = await new DbTask(conn).execute(dbReq)

		//
		// get asins to update
		let asins: Array<string> = dbResult[0].map(item => {
			return item['asin']
		})

		//
		// connect to Amazon and get Product data
		let request = NetworkRequest.itemLookup(asins)
		let data = await new NetworkTask().execute(request)

		let xml = await new ParseXMLTask().execute(data)
		let products = await new TransformAmazonProductsTask(null).execute(xml)

		//
		// update product data to SQL
		let iSqlReqs = [
			SqlRequest.disableFKChecks(),
			SqlRequest.insertProducts(products)
		]
		let iSqlTasks = iSqlReqs.map(req => {
			return new SqlTask().execute(req)
		})
		let sqls = await Promise.all(iSqlTasks)
		let iDbReq = sqls.map(sqlString => {
			return new DbRequest(sqlString)
		})
		let iDbTasks = iDbReq.map((req: DbRequest) => {
			return new DbTask(conn).execute(req)
		})
		let iDbResult = await Promise.all(iDbTasks)

		//
		// close connection
		conn.end()

		//
		// format response
		let response = {
			'meta': {
				'status': 200,
				'operation': 'updateProductData'
			},
			'done': true,
			'result': asins
		}

		res.status(200).json(response)
	} catch (e) {
		res.status(500).send(e)
	}
}
