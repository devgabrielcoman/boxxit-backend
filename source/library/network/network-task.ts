//
// internal imports
import * as aux from '../aux/aux'
import { Task } from '../task'
import { NetworkRequest } from './network-request'

//
// external imports
import * as request from 'request'

//
// declare promises
declare var Promise: any;
declare var process: any;

export class NetworkTask implements Task<NetworkRequest, string> {

	//
	// main function of the Task interface
	execute(input: NetworkRequest): Promise<string> {

		//
		// create the endpoint
		var url = ""
		let keys = aux.sortObjectKeys(input.getParams())
		if (!input.shouldSign()) {
			let query = aux.formObjectKeysAsQuery(keys, input.getParams())
			url = input.getProto() + input.getDomain() + input.getPath()  + '?' + query
		} else {
			let query = aux.encodeObjectKeysAsQuery(keys, input.getParams())
			let canonical = [input.getMethod(), input.getDomain(), input.getPath(), query].join('\n')
			let signature = aux.getSHA256Signature(canonical, process.env.AWS_KEY)
			url = input.getProto() + input.getDomain() + input.getPath()  + '?' + query + '&Signature=' + signature
		}

		//
		// create the request options object
		var requestOptions = {
			'method': input.getMethod(),
			'uri': url
		}
		if (input.getHeaders() != null) {
			requestOptions['headers'] = input.getHeaders()
		}
		if (input.getBody() != null) {
			requestOptions['body'] = JSON.stringify(input.getBody())
		}

		//
		// return promise
		return new Promise((resolve: Function, reject: Function) => {
			request(requestOptions, (error, response, body) => {
				if (error == null) {
					resolve(body)
				} else {
					reject(error)
				}
			})
		})
	}
}
