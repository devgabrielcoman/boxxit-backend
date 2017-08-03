//
// imports
import * as moment from 'moment'
import * as jsSHA from 'jssha'
import * as mysql from 'promise-mysql'

//
// declare promises
declare var Promise: any;
declare var process: any;

String.prototype.replaceAll = function(this:string, search:string, replacement:string):string {
	return this.split(search).join(replacement)
}

declare global {
	interface String {
		replaceAll(search:string, replacement:string):string
	}
}

export function getCurrentDate(): string {
	return moment().format("YYYY-MM-DD[T]HH:mm:ss[Z]")
}

export function sortObjectKeys (obj: object): Array<string> {
	return Object.keys(obj).sort((a,b) => {
		if(a < b) return -1;
    if(a > b) return 1;
    return 0;
	})
}

export function encodeValue(value: string): string {
	// Based on: ~!@#$&*()=:/,;?+'
	return encodeURI(value)
		.replaceAll('~', '')
		.replaceAll('!', '')
		.replaceAll('@', '')
		.replaceAll('#', '')
		.replaceAll('$', '')
		.replaceAll('&', '%26')
		.replaceAll('*', '')
		.replaceAll('(', '')
		.replaceAll(')', '')
		.replaceAll('=', '')
		.replaceAll(':', '%3A')
		.replaceAll('\'', '%27')
		.replaceAll('/', '%2F')
		.replaceAll(',', '%2C')
		.replaceAll(';', '')
		.replaceAll('?', '')
		.replaceAll('+', '%2B')
		.replaceAll('\'', '')

}

export function encodeObjectKeysAsQuery(keys:Array<string>, obj: object): string {
	return keys.map((key:string) => {
		return key + '=' + encodeValue(obj[key])
	}).join('&')
}

export function formObjectKeysAsQuery(keys:Array<string>, obj: object): string {
	return keys.map((key:string) => {
		return key + '=' + obj[key]
	}).join('&')
}

export function getSHA256Signature (url:string, key: string) {
	const shaObj = new jsSHA("SHA-256", "TEXT")
	shaObj.setHMACKey(key, "TEXT")
	shaObj.update(url)
	return shaObj.getHMAC("B64").replaceAll("+", '%2B').replaceAll("=", '%3D')
}

export function createDbConnection (): Promise<any> {
	return mysql.createConnection({
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASS
	})
}

export function contains(array: Array<any>, object: any): boolean {
	return array.filter(e => e === object).length > 0
}
