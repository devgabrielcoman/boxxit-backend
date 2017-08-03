import { createDbConnection } from '../library/aux/aux'
import { getProductData } from './aux/get-product-data'
import { writeProductData } from './aux/write-product-data'
import { NetworkRequest } from '../library/network/network-request'
import { NetworkTask } from '../library/network/network-task'
import { ParseJsonTask } from '../library/parse/parse-json-task'
import { TransformFbLikesTask } from '../library/transform/transform-fb-likes-task'
import { TransformFbProfileTask } from '../library/transform/transform-fb-profile-task'
import { SqlRequest } from '../library/sql/sql-request'
import { SqlTask } from '../library/sql/sql-task'
import { DbRequest } from '../library/database/db-request'
import { DbTask } from '../library/database/db-task'
import { FbLike } from '../library/models'
import { contains } from '../library/aux/aux'

export async function populateUserProfile(req, res) {

	//
	// get query data
	let token = req['query']['fbToken']
	var fbId = req['query']['fbId']
	fbId = fbId == null ? 'me' : fbId

	try {

		//
		// create a database connection
		let conn = await createDbConnection()

		//
		// get profile data from network
		let profileReq = NetworkRequest.fbProfile(fbId, token)
		let profileData = await new NetworkTask().execute(profileReq)
		let profileJSON = await new ParseJsonTask().execute(profileData)
		let profile = await new TransformFbProfileTask().execute(profileJSON)

		//
		// get likes/categories data from network
		let likesReq = NetworkRequest.fbLikes(fbId, token)
		let likesData = await new NetworkTask().execute(likesReq)
		let likesJSON = await new ParseJsonTask().execute(likesData)
		let allLikes = await new TransformFbLikesTask().execute(likesJSON)

		let categs = {
			// Books
			'Books & Magazines': 'Books',
			'Book': 'Books',
			'Book Series': 'Books',
			'Author': 'Books',
			'Writer': 'Books',
			// Movies
			'Show': 'DVD',
			'TV': 'DVD',
			'Movie': 'DVD',
			'TV Show': 'DVD',
			'Movie Character': 'DVD',
			'Actor': 'DVD',
			'Film Director': 'DVD',
			// Music
			'Album': 'Music',
			'Song': 'Music',
			'Symphony': 'Music',
			'Band': 'Music',
			'Musician/Band': 'Music',
			'Musician': 'Music',
			'Orchestra': 'Music',
			// Games
			'Board Game': 'VideoGames',
			'Video Game': 'VideoGames',
			'Games/Toys': 'VideoGames',
			// Persons
			'Artist': 'All',
			'Athlete': 'All',
			'Comedian': 'All',
			'Entrepreneur': 'All',
			'Scientist': 'All',
			'Wine/Spirits': 'All',
			'Drink': 'All',
			'Arts & Humanities Website': 'All'
		}

		var filtered: Array<FbLike> = new Array<FbLike>()
		allLikes.forEach((like: FbLike) => {
			let c = categs[like.category]
			if (c != null) {
				like.searchIndex = c
				like.isGenre = false
				filtered.push(like)
			}
		})

		var fin = filtered
		filtered.forEach((like: FbLike) => {
			if (like.genre != null) {
				let genres = like.genre.split(',')
				genres.forEach((genre: string) => {
					let igenres = genre.split('/')
					igenres.forEach((name: string) => {
						let l = new FbLike(name.trim(), name.trim())
						l.searchIndex = like.searchIndex
						l.category = like.category
						l.isGenre = true
						fin.push(l)
					})
				})
			}
		})

		var flags = {}
		let likes = fin.filter((like: FbLike) => {
		    if (flags[like.name]) {
		        return false
		    }
		    flags[like.name] = true
		    return true
		})

		//
		// form all the SQL query data needed to insert values into the DB
		let sqlReqs = [
			SqlRequest.disableFKChecks(),
			SqlRequest.fbProfile(profile),
			SqlRequest.fbFriends(profile),
			SqlRequest.fbLikes(likes),
			SqlRequest.fbLikesForUser(profile, likes)
		]
		let sqlTasks = sqlReqs.map(req => {
			return new SqlTask().execute(req)
		})
		let sqls = await Promise.all(sqlTasks) // array of SQL

		//
		// execute the profile queries to the dabtabse
		let dbReq = sqls.map(sqlString => {
			return new DbRequest(sqlString)
		})
		let dbTasks = dbReq.map((dbReq: DbRequest) => {
			return new DbTask(conn).execute(dbReq)
		})
		let profileResults = await Promise.all(dbTasks)

		//
		// and now do the same thing for the products
		let productResults = await getProductData(conn, likes.splice(0, 7))
		let dbResult = await writeProductData(conn, productResults)

		//
		// close the connection
		conn.end()

		let response = {
			'meta': {
				'status': 200,
				'operation': 'populateUserProfile'
			},
			'done': true,
			'result': {
				'user': profile.id,
				'name': profile.name,
				'likes': likes.map((like: FbLike) => { return like.name }),
				'products': dbResult
			}
		}

		res.status(200).json(response)
	} catch (e) {
		res.status(500).send(e)
	}
}
