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
app.use(express.static('static'))

app.listen(process.env.PORT, process.env.BIND_IP, function () {
  console.log('App listening on ' + process.env.BIND_IP + ':' + process.env.PORT)
})
