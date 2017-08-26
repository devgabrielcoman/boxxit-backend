//
// Fb likes
export interface FbData {
	// do nothing
}

export class FbLike {
	id: string
	name: string
	category: string
	genre: string
	isGenre: boolean = false
	searchIndex: string

	constructor(id: string, name: string) {
		this.id = id
		this.name = name
	}
}

export class FbLikes {
	data: Array<FbLike> = []
}

export class FbBulkResponse implements FbData {
	code: number
	body: FbLikes
}

//
// Fb Friends
export class FbFriend {
	id: string
}

export class FbFriends {
	data: Array<FbFriend> = []
}

//
// Fb Profile
export class FbProfile implements FbData {
	id: string
	name: string
	email: string
	birthday: string
	gender: string
	friends: FbFriends
}

//
// Product result
export class ProductResult {
	categId: string
	categName: string
	products: Array<Product> = []
	throttleError: boolean = false
	noResultsError: boolean = false
}

//
// Amazon Product
export class Product {
	asin: string
	title: string
	amount: number
	price: string
	click: string
	smallIcon: string
	largeIcon: string
	categId: string
	isFavourite: boolean

	constructor(asin: string = null, title: string = null, amount: number = 0, price: string = '£0', click: string = null, smallIcon: string = null, largeIcon: string = null, categId: string = null, isFavourite: boolean = false) {
		this.asin = asin
		this.title = title
		this.amount = amount
		this.price = price
		this.click = click
		this.smallIcon = smallIcon
		this.largeIcon = largeIcon
		this.categId = categId
		this.isFavourite = isFavourite
	}
}

//
// Birthday Notification
export class BirthdayNotification {
	wisherToken: string
	friendId: string
	message: string

	constructor(token: string, friendId: string, message: string) {
		this.wisherToken = token
		this.friendId = friendId
		this.message = message
	}
}
