//
// transform fb data
import { Task } from '../task'
import { FbProfile } from '../models'

//
// declare promises
declare var Promise: any;

export class TransformFbProfileTask implements Task <any, FbProfile> {

	execute(input: any): Promise<FbProfile> {
		let result = input
		return Promise.resolve(result)
	}
}
