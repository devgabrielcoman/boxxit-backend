import { populateUserProfile } from './server/populate-user-profile'
import { populateProducts } from './server/populate-products'
import { getFavouriteProductsForUser } from './server/get-favourite-products-for-user'
import { getProductsForUser } from './server/get-products-for-user'
import { deleteProduct } from './server/delete-product'
import { saveProduct} from './server/save-product'
import { saveToken } from './server/save-token'
import { notifyOneWeek } from './server/notify-birthdays'
import { notifyTwoWeeks } from './server/notify-birthdays'
import { updateProductData } from './server/update-product-data'
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
app.get('/updateProductData', updateProductData)
app.get('/notifyOneWeek', notifyOneWeek)
app.get('/notifyTwoWeeks', notifyTwoWeeks)
app.use(express.static('static'))

// import { NetworkRequest } from './library/network/network-request'
// import { NetworkTask } from './library/network/network-task'
// import { ParseXMLTask } from './library/parse/parse-xml-task'
// import { TransformAmazonProductsTask} from './library/transform/transform-amazon-products-task'
//
// app.get('/test_prod', async function (req, res) {
// 	try {
// 		let request = NetworkRequest.itemLookup(['0020531907', 'B00HMZP7AY'])
// 		let xmlStr = await new NetworkTask().execute(request)
// 		let xmlReq = await new ParseXMLTask().execute(xmlStr)
// 		let products = await new TransformAmazonProductsTask(null).execute(xmlReq)
// 		res.status(200).send(products)
// 	}	catch(e) {
// 		res.status(400).send(e)
// 	}
// })

app.listen(process.env.PORT, process.env.BIND_IP, function () {
  console.log('App listening on ' + process.env.BIND_IP + ':' + process.env.PORT)
})
