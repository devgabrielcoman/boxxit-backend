import { FbLike } from '../../library/models'
import { ProductResult } from '../../library/models'
import { Product } from '../../library/models'
import { SqlRequest } from '../../library/sql/sql-request'
import { SqlTask } from '../../library/sql/sql-task'
import { DbRequest } from '../../library/database/db-request'
import { DbTask } from '../../library/database/db-task'
import { NetworkRequest } from '../../library/network/network-request'
import { NetworkTask } from '../../library/network/network-task'
import { TransformAmazonDataTask } from '../../library/transform/transform-amazon-data-task'
import { ParseXMLTask } from '../../library/parse/parse-xml-task'

declare var Promise: any;

export async function getProductData(conn, categories: Array<FbLike>): Promise<Array<ProductResult>> {

	//
	// internal function that gets 10 random empty categories
	async function getEmptyCategories(): Promise<Array<FbLike>> {
		let sqlReq = SqlRequest.getEmptyCategories()
		let sql = await new SqlTask().execute(sqlReq)
		let dbReq = new DbRequest(sql)
		return new DbTask(conn).execute(dbReq)
	}

	//
	// likes/categories are either supplied as a parameter (e.g. at first join)
	// or obtained from the empty categories list
	let likes = categories != null ? await Promise.resolve(categories) : await getEmptyCategories()

	//
	// get products from Amazon
	let prds = likes.map(async function (like): Promise<Array<Product>> {
		//
		// do a amazon keyword network request
		let request = NetworkRequest.keywordSearch(like.name, like.searchIndex)
		let data = await new NetworkTask().execute(request)

		//
		// parse XML into valid products
		let xml = await new ParseXMLTask().execute(data)
		let productResult = await new TransformAmazonDataTask(like.id, like.name).execute(xml)

		//
		// return results
		return Promise.resolve(productResult)
	})
	return Promise.all(prds)
}
