//
// transform fb data
import { Task } from '../task'
import { Product } from '../models'
import { ProductResult } from '../models'
import { TransformAmazonProductsTask } from './transform-amazon-products-task'

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

	async execute(input: any): Promise<ProductResult> {
		var result = new ProductResult()
		result.categId = this.categId
		result.categName = this.cagetName
		result.noResultsError = this.findNoResultsErrors(input)
		result.throttleError = this.findThrottleErrors(input)
		result.products = await new TransformAmazonProductsTask(this.categId).execute(input)
		return Promise.resolve(result)
	}
}
