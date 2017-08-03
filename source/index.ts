import { populateUserProfile } from './server/populate-user-profile'
import { populateProducts } from './server/populate-products'
import { getFavouriteProductsForUser } from './server/get-favourite-products-for-user'
import { getProductsForUser } from './server/get-products-for-user'
import { deleteProduct } from './server/delete-product'
import { saveProduct} from './server/save-product'
import { saveToken } from './server/save-token'
import { getUpcomingBirthdays } from './server/get-upcoming-birthdays'
import * as uuidv4 from 'uuid'

//
// create express app
import * as dotenv from 'dotenv'
dotenv.config()
import * as express from 'express'
let app = express()

//
// declare promises
declare var Promise: any;
declare var process: any;

app.get('/populateUserProfile', populateUserProfile)
app.get('/populateProducts', populateProducts)
app.get('/saveToken', saveToken)
app.get('/saveProduct', saveProduct)
app.get('/deleteProduct', deleteProduct)
app.get('/getProductsForUser', getProductsForUser)
app.get('/getFavouriteProductsForUser', getFavouriteProductsForUser)
app.get('/getUpcomingBirthdays', getUpcomingBirthdays)

import { NetworkRequest } from './library/network/network-request'
import { NetworkTask } from './library/network/network-task'
import { ParseJsonTask } from './library/parse/parse-json-task'
import { TransformFbLikesTask } from './library/transform/transform-fb-likes-task'
import { FbLike } from './library/models'
import { contains } from './library/aux/aux'

// app.get('/testProfileLikes', async function (req, res) {
//   try {
// 		let fbId = req['query']['fbId']
// 		let token = 'EAACk9c0lMPoBADPhsSVo4E0RO6eTAOJ13xwXJZBD6LigBRDkobTCkIADCsJyWjZC6nGsOUZAZCZBFtcJYmBZCQFvlupRyTJIsK4M1qXEuenrwq0V1HiAbTu9PYfZBDjAJV6xZAju64AngCyh8LkzScVoZCOVZCC1Aape2UIMUWoHZBf854l60hIXf8SVeTaOWOlJku4pSqZAPlFl6KZA9zh1l14ZA1YowJspKe0bf9XI4kL88ZBUwZDZD'
//
// 		//
// 		// get likes/categories data from network
// 		let likesReq = NetworkRequest.fbLikes(fbId, token)
// 		let likesData = await new NetworkTask().execute(likesReq)
// 		let likesJSON = await new ParseJsonTask().execute(likesData)
// 		let likes = await new TransformFbLikesTask().execute(likesJSON)
//
// 		let categs = {
// 			// Books
// 			'Books & Magazines': 'Books',
// 			'Book': 'Books',
// 			'Book Series': 'Books',
// 			'Author': 'Books',
// 			'Writer': 'Books',
// 			// Movies
// 			'Show': 'DVD',
// 			'TV': 'DVD',
// 			'Movie': 'DVD',
// 			'TV Show': 'DVD',
// 			'Movie Character': 'DVD',
// 			'Actor': 'DVD',
// 			'Film Director': 'DVD',
// 			// Music
// 			'Album': 'Music',
// 			'Song': 'Music',
// 			'Symphony': 'Music',
// 			'Band': 'Music',
// 			'Musician/Band': 'Music',
// 			'Musician': 'Music',
// 			'Orchestra': 'Music',
// 			// Games
// 			'Board Game': 'Video Games',
// 			'Video Game': 'Video Games',
// 			'Games/Toys': 'Video Games',
// 			// Persons
// 			'Artist': 'All',
// 			'Athlete': 'All',
// 			'Comedian': 'All',
// 			'Entrepreneur': 'All',
// 			'Scientist': 'All',
// 			'Wine/Spirits': 'All',
// 			'Drink': 'All',
// 			'Arts & Humanities Website': 'All'
// 		}
//
// 		var filtered: Array<FbLike> = new Array<FbLike>()
// 		likes.forEach((like: FbLike) => {
// 			let c = categs[like.category]
// 			if (c != null) {
// 				like.searchIndex = c
// 				filtered.push(like)
// 			}
// 		})
//
// 		var fin = filtered
// 		filtered.forEach((like: FbLike) => {
// 			if (like.genre != null) {
// 				let genres = like.genre.split(',')
// 				genres.forEach((genre: string) => {
// 					let igenres = genre.split('/')
// 					igenres.forEach((name: string) => {
// 						let l = new FbLike(name.trim(), name.trim())
// 						l.searchIndex = 'All'
// 						l.category = like.category
// 						fin.push(l)
// 					})
// 				})
// 			}
// 		})
//
// 		var flags = {}
// 		let uniques = fin.filter((like: FbLike) => {
// 		    if (flags[like.name]) {
// 		        return false
// 		    }
// 		    flags[like.name] = true
// 		    return true
// 		})
//
// 		res.status(200).json({
// 			'nrTotal': likes.length,
// 			'nrFiltered': uniques.length,
// 			'filtered': uniques.map((like: FbLike) => { return like.name }),
// 			'total': likes/*.map((like: FbLike) => { return like.name})*/
// 		})
// 	} catch (e) {
// 		res.status(500).send(e)
// 	}
// })

app.listen(process.env.PORT, process.env.BIND_IP, function () {
  console.log('App listening on ' + process.env.BIND_IP + ':' + process.env.PORT)
})
