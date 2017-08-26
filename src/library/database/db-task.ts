//
//
import { Task } from '../task'
import { DbRequest } from './db-request'
import * as mysql from 'promise-mysql'

//
// declare promises
declare var Promise: any;

export class DbTask implements Task<DbRequest, any> {

	private conn: any

	constructor(conn: any) {
		this.conn = conn
	}

	execute(input: DbRequest): Promise<any> {
		if (input == null || input.query === "" || input.query === ";") {
			return Promise.resolve()
		} else {
			return this.conn.query(input.query)
		}
	}
}
