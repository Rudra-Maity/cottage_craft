const express=require("express")
const bodyParser=require('body-parser')
const morgan=require("morgan")
const cookieparser=require('cookie-parser')
const session = require('express-session');
const rateLimit=require('express-rate-limit')
const favicon=require('serve-favicon')
require("dotenv/config")

//mongodb connection 
require('./MySchema/connection')();

//Routers modules
const admin_login=require('./routers/Admin_login')
const ProductsRouter=require('./routers/products')
const UserLogin=require('./routers/UserLogin')
const OrdersRouter=require('./routers/Orders')
const cartItems=require('./routers/cartProduct')
const Payment=require('./routers/payment')
const adminViewOrder=require('./routers/OrdersChecked');
const search=require('./routers/search')
const SuccessMessageAndFailed=require('./routers/RequestNotFound')
const viewOrders=require('./routers/UserOrders')

const app=express()
//morgan
app.use(morgan('tiny'))
app.use(cookieparser())
app.use(bodyParser.json())
app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(session({
    secret: process.env.auth_secrete, // Replace with a strong secret key in production
    resave: false,
    saveUninitialized: true,
  })
  )

  app.use(favicon(__dirname + '/views/favicon.ico'));

  // app.set('port', process.env.PORT || 8080);
//ejs configuration
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.static(__dirname+'/styleing'))
app.use(express.static(__dirname+'/scripting'))
//cors for policy
// app.use(cors());

//Routers
const apiEnv=process.env.API_URL;
app.use(`/`,ProductsRouter)
app.use(`/`,admin_login)
app.use(`/`,UserLogin)
app.use('/',OrdersRouter)
app.use('/',cartItems)
app.use('/',Payment)
app.use('/',adminViewOrder);
app.use('/',search)
app.use('/',SuccessMessageAndFailed)
app.use('/',viewOrders)

//dDOS attack limit request
app.use(rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 100, 
}))

app.listen(2000,()=>{
    console.log(apiEnv)
})