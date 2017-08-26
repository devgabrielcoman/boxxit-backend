//
// external
import * as et from 'elementtree'

//
// internal
import { Task } from '../task'

//
// declare promises
declare var Promise: any;

export class ParseXMLTask implements Task<string, any> {

	execute(input: string): Promise<any> {
		return new Promise((resolve: Function, reject: Function) => {
			let etree = et.parse(input)
			if (etree != null) {
				resolve(etree)
			} else {
				reject('Invalid XML')
			}
		})
	}
}
