import { createDbConnection } from '../library/aux/aux'
import { getProductData } from './aux/get-product-data'
import { writeProductData } from './aux/write-product-data'

export async function populateProducts(req, res) {

	try {
		//
		// start Db connection
	  let conn = await createDbConnection()

		//
		// get and execute all the necessary tasks to get products
		let productResults = await getProductData(conn, null)
		let dbResult = await writeProductData(conn, productResults)

		//
		// close connection
		conn.end()

		//
		// format response
		let response = {
			'meta': {
				'status': 200,
				'operation': 'populateProducts'
			},
			'done': true,
			'result': dbResult
		}

		res.status(200).json(response)
	} catch (e) {
		res.status(500).send(e)
	}
}
