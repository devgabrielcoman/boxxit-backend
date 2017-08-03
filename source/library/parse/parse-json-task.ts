//
// internal
import { Task } from '../task'

//
// declare promises
declare var Promise: any;

export class ParseJsonTask implements Task<string, JSON> {

	execute(input: string): Promise<JSON> {
		return new Promise((resolve: Function, reject: Function) => {
			try {
				let parsed: JSON = JSON.parse(input)
				resolve(parsed)
			} catch(e) {
				reject(e)
			}
		})
	}
}
