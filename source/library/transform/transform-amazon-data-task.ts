//
// transform fb data
import { Task } from '../task'
import { Product } from '../models'
import { ProductResult } from '../models'

//
// external imports
import * as et from 'elementtree'

//
// declare promises
declare var Promise: any;

export class TransformAmazonDataTask implements Task <any, ProductResult> {

	categId: string
	cagetName: string

	constructor(categId: string, categName: string) {
		this.categId = categId
		this.cagetName = categName
	}

	private findNoResultsErrors(input: any): boolean {
		let possibleNoResultsError = input.findall('./Items/Request/Errors')
		var result = false
		possibleNoResultsError.forEach(err => {
		  let code = err.findtext('./Error/Code')
			if (code.indexOf('NoExactMatches') !== -1) {
				result = true
			}
		})
		return result
	}

	private findThrottleErrors(input: any): boolean {
		let possibleThrottleError = input.findall('./Error')
		var result = false
		possibleThrottleError.forEach(err => {
			let code = err.findtext('./Code')
			if (code.indexOf('RequestThrottled') !== -1) {
				result = true
			}
		})
		return result
	}

	private findItems(input: any): Array<Product> {

		let items = input.findall('./Items/Item')

		return items.map ((item: any) => {

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
			offers.forEach(item => {
				price = item.findtext('./OfferListing/Price/FormattedPrice')
				try {
					amount = Number(item.findtext('./OfferListing/Price/Amount'))
				} catch (e) {
					// do nothing
				}
			})

			//
			// return new product object
			return new Product(asin, title, amount, price , click, smallIcon, largeIcon, this.categId)
		})
	}

	execute(input: any): Promise<ProductResult> {
		var result = new ProductResult()
		result.categId = this.categId
		result.categName = this.cagetName
		result.noResultsError = this.findNoResultsErrors(input)
		result.throttleError = this.findThrottleErrors(input)
		result.products = this.findItems(input)
		return Promise.resolve(result)
	}
}
