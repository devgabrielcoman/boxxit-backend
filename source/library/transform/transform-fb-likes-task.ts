//
//
import { Task } from '../task'
import { FbBulkResponse } from '../models'
import { FbLikes } from '../models'
import { FbLike } from '../models'

export class TransformFbLikesTask implements Task <any, Array<FbLike>> {

	execute(input: any): Promise<Array<FbLike>> {
		let result = input.map(value => {
				return this.parseBulk(value)
			})
			.map((bulk: FbBulkResponse) => {
				return bulk.body.data
			})
			.reduce((acc, cur) => {
				return acc.concat(cur)
			})
		return Promise.resolve(result)
	}

	private parseBulk(input: any): FbBulkResponse {
		let result = input
		result['body'] = JSON.parse(result['body'])
		return result
	}
}
