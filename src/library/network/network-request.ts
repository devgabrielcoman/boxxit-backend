//
// generic network request options
import { Request } from '../request'
import { BirthdayNotification } from '../models'

//
// import extern
import * as aux from '../aux/aux'

declare var process: any;

export class NetworkRequest implements Request {
	//
	// private members
	private method: string
	private proto: string
	private domain: string
	private path: string
	private params: object
	private isSigned: boolean
	private headers: object = null
	private body: object = null

	//
	// RequestOptions implementation
	getMethod(): string { return this.method }
	getProto(): string { return this.proto }
	getDomain(): string { return this.domain }
	getPath(): string { return this.path }
	getParams(): object { return this.params }
	shouldSign(): boolean { return this.isSigned }
	getHeaders(): object { return this.headers }
	getBody(): object { return this.body }

	//
	// private constructor
	private constructor (method: string, proto: string, domain: string, path: string, params: object, isSigned: boolean, headers: object = null, body: object = null) {
		this.method = method
		this.proto = proto
		this.domain = domain
		this.path = path
		this.params = params
		this.isSigned = isSigned
		this.headers = headers
		this.body = body
	}

	//
	// static factory method to get fbProfile
	static fbProfile (id: string, token: string): NetworkRequest {
		return new NetworkRequest(
			'GET',
			'https://',
			'graph.facebook.com',
			'/v2.8/' + id,
			{
				'fields': 'id, email, gender, name, birthday, friends{id}',
				'access_token': token
			},
			false)
	}

	//
	// static factory method to get fbLikes
	static fbLikes (id: string, token: string): NetworkRequest {
		return new NetworkRequest(
			'POST',
			'https://',
			'graph.facebook.com',
			'/v2.8',
			{
				'include_headers': false,
				'access_token': token,
				'batch': '[' + [
					'{ "method": "GET", "relative_url": "' + id + '/likes?fields=id,name,category,genre%26limit=1000" }',
					'{ "method": "GET", "relative_url": "' + id + '/books?fields=id,name,category,genre%26limit=1000" }',
					'{ "method": "GET", "relative_url": "' + id + '/games?fields=id,name,category,genre%26limit=1000" }',
					'{ "method": "GET", "relative_url": "' + id + '/movies?fields=id,name,category,genre%26limit=1000" }',
					'{ "method": "GET", "relative_url": "' + id + '/music?fields=id,name,category,genre%26limit=1000" }',
					'{ "method": "GET", "relative_url": "' + id + '/television?fields=id,name,category,genre%26limit=1000" }'
				].join(',') + ']'
			},
			false
		)
	}

	//
	// static factory method to get amazon product searches w/ keyword
	static keywordSearch(keyword: string, searchIndex: string): NetworkRequest {
		return new NetworkRequest(
			'GET',
			'https://',
			'webservices.amazon.co.uk',
			'/onca/xml',
			{
				'Service': 'AWSECommerceService',
				'Operation': 'ItemSearch',
				'SearchIndex': searchIndex,
				'Timestamp': aux.getCurrentDate(),
				'ResponseGroup': 'ItemIds,Images,Small,Offers,ItemAttributes,OfferSummary',
				'AWSAccessKeyId': process.env.AWS_ID,
				'AssociateTag': process.env.AWS_TAG,
				'MinimumPrice': '500',
				'MaximumPrice': '5000',
				'Keywords': keyword
			},
			true
		)
	}

	//
	// static factory method to get amazon product info based on item id
	static itemLookup(items: Array<string>): NetworkRequest {
		return new NetworkRequest(
			'GET',
			'https://',
			'webservices.amazon.co.uk',
			'/onca/xml',
			{
				'Service': 'AWSECommerceService',
				'Operation': 'ItemLookup',
				'Timestamp': aux.getCurrentDate(),
				'ResponseGroup': 'ItemIds,Images,Small,Offers,ItemAttributes,OfferSummary',
				'AWSAccessKeyId': process.env.AWS_ID,
				'AssociateTag': process.env.AWS_TAG,
				'ItemId': items.join(',')
			},
			true
		)
	}

	//
	// static factor method to get notification
	static sendBirthdayNotification(notification: BirthdayNotification): NetworkRequest {
		return new NetworkRequest(
			'POST',
			'https://',
			'gcm-http.googleapis.com',
			'/gcm/send',
			{},
			false,
			{
				'Content-Type': 'application/json',
				'Authorization': 'key=' + process.env.FIR_KEY
			},
			{
				'notification' :  {
					'body': notification.message,
				},
				'data': {
					'friendId': notification.friendId
				},
				'to' : notification.wisherToken
			}
		)
	}
}
