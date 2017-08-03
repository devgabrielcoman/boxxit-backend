//
// imports
import { Task } from '../task'
import { SqlRequest } from './sql-request'

//
// declare promises
declare var Promise: any;

export class SqlTask implements Task <SqlRequest, string> {

	execute(input: SqlRequest): Promise<string> {
		return Promise.resolve(input.getSQLString())
	}
}
