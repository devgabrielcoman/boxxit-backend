//
//
import { Request } from '../request'

export class DbRequest implements Request {

	query: string

	constructor(q: string) {
		this.query = q
	}
}
