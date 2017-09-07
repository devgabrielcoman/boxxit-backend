import { SqlRequest } from '../../library/sql/sql-request'
import { SqlTask } from '../../library/sql/sql-task'
import { DbRequest } from '../../library/database/db-request'
import { DbTask } from '../../library/database/db-task'
import { ProductResult } from '../../library/models'
import { Product } from '../../library/models'
declare var Promise: any;

export async function writeProductData(conn, productResults: Array<ProductResult>): Promise<any> {

	//
	// get all products
	var products: Array<Product> = []
	productResults.forEach((result: ProductResult) => {
		result.products.forEach((product: Product) => {
			products.push(product)
		})
	})

	//
	// create first batch of requests
	let sqlReqs = [
		SqlRequest.disableFKChecks(),
		SqlRequest.insertProducts(products),
		SqlRequest.insertProductsForLikes(products)
	]
	let categValidity = productResults.map((result: ProductResult) => {
		return SqlRequest.markCategoryValue(result.categId, !result.noResultsError)
	})
	//
	// final requests
	let sqlRequests = sqlReqs.concat(categValidity)

	let sqlTasks = sqlRequests.map(req => {
		return new SqlTask().execute(req)
	})

	//
	// get an array of SQL operations that needs to be executed
	let sqls = await Promise.all(sqlTasks)

	//
	// form the products db tasks
	let dbReq = sqls.map(sqlString => {
		return new DbRequest(sqlString)
	})
	let dbTasks = dbReq.map((req: DbRequest) => {
		return new DbTask(conn).execute(req)
	})

	//
	// execute SQL
	let dbResult = await Promise.all(dbTasks)

	//
	// send back status report
	var successfull: Array<string> = []
	var empty: Array<string> = []
	var throttled: Array<string> = []
	productResults.forEach((result: ProductResult) => {
		if (result.noResultsError) {
			empty.push(result.categName)
		} else if (result.throttleError) {
			throttled.push(result.categName)
		} else {
			console.log('got here')
			successfull.push(result.categName)
		}
	})

	//
	// return the status of the db write
	return Promise.resolve({
		'successfull': successfull,
		'empty': empty,
		'throttled': throttled
	})
}
