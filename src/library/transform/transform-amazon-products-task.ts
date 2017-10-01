//
// transform fb data
import { Task } from '../task'
import { Product } from '../models'

//
// external imports
import * as et from 'elementtree'

//
// declare promises
declare var Promise: any;

export class TransformAmazonProductsTask implements Task <any, Array<Product>> {

	categId: string

	constructor(categId: string) {
		this.categId = categId
	}

	execute(input: any): Promise<Array<Product>> {

		let items = input.findall('./Items/Item')

		let result = items.map ((item: any) => {

			//
			// get basic details
			let asin = item.findtext('./ASIN')
			let title = item.findtext('./ItemAttributes/Title')
			let click = item.findtext('./DetailPageURL')
			let smallIcon = item.findtext('./SmallImage/URL')
			let largeIcon = item.findtext('./LargeImage/URL')
			let offers = item.findall('./Offers/Offer')

			//
			// get prices
			let amount = 0
			let price = ''

			//
			// try to get offers
			offers.forEach(item => {
				price = item.findtext('./OfferListing/Price/FormattedPrice')
				try {
					amount = Number(item.findtext('./OfferListing/Price/Amount'))
				} catch (e) {

				}
			})

			//
			// try go get lowest price
			if (amount == 0 || isNaN(amount)) {
				price = item.findtext('./OfferSummary/LowestUsedPrice/FormattedPrice')
				try {
					amount = Number(item.findtext('./OfferSummary/LowestUsedPrice/Amount'))
				} catch (e) {
					// do nothing
				}
			}

			//
			// try to get normal price
			if (amount == 0 || isNaN(amount)) {
				console.log('hot here')
				price = item.findtext('./OfferSummary/LowestNewPrice/FormattedPrice')
				try {
					amount = Number(item.findtext('./OfferSummary/LowestNewPrice/Amount'))
				} catch (e) {
					// do nothing
				}
			}

			//
			// get backup prices
			if (amount == 0 || isNaN(amount)) {
				price = item.findtext('./ItemAttributes/ListPrice/FormattedPrice')
				try {
					amount = Number(item.findtext('./ItemAttributes/ListPrice/Amount'))
				} catch (e) {
					// do nothing
				}
			}

			//
			// return new product object
			return new Product(asin, title, amount, price , click, smallIcon, largeIcon, this.categId)
		})

		return Promise.resolve(result)
	}
}
