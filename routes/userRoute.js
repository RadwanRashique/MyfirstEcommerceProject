const bodyParser = require('body-parser');

const express = require('express');


const path = require('path')

const user_route=express()



const session=require("express-session")


const config=require("../config/config")

user_route.use(session({
   secret:config.sessionSecret,
   saveUninitialized:true,
   resave:false
}))

const auth=require("../middleware/auth")


user_route.set('view engine','ejs')
user_route.set('views',path.join(__dirname,"../views/users"))

 
 user_route.use(bodyParser.json())
 user_route.use(bodyParser.urlencoded({extended:true}))


const userController=require("../controller/userController")
// require cart controller
const cartController=require("../controller/cartController")

// require Wish list controller
const  wishlistController=require("../controller/wishlistController")

// require address controller
const addressController =require("../controller/addressController")
// require order
const orderController=require("../controller/ordersController")

// require coupon
const couponController=require("../controller/couponController")

user_route.get("/register",auth.isLogout,userController.loadRegister)


user_route.post("/register",userController.insertUser)

user_route.get("/verify",userController.veryfiyUser)
user_route.post("/verify",userController.otpset)

user_route.get("/login",auth.isLogout,userController.loginLoad)
user_route.get("/",auth.isLogout,userController.loginLoad)


user_route.post("/login",userController.verifyLogin)


user_route.get("/home",auth.isLogin,userController.loadHome)

user_route.get('/logout',userController.userLogout)

user_route.get("/forget",auth.isLogout,userController.forgetLoad)

user_route.post("/forget",userController.forgetVerify)
user_route.get("/forgetotp",auth.isLogout,userController.loadOTP)
user_route.post("/forgetotp",userController.createNewpassword)
user_route.get("/createNewpassword",auth.isLogout,userController.passwordsetup)
user_route.post("/createNewpassword",userController.passwordseted)

// for single product view
user_route.get("/productview",auth.isLogin,userController.productview)

// to show shop page
user_route.get("/shop",auth.isLogin,userController.showShop)

// search product
user_route.post("/shop",userController.searchProduct)



// cart
// To show cart page while clicking add to cart
user_route.post("/addToCart",cartController.addToCart)
user_route.get("/cart",auth.isLogin,cartController.loadCart)

user_route.post('/removeProduct',auth.isLogin,cartController.removeProduct);

user_route.post('/changeProductQuantity',cartController.changeProductCount);

user_route.get('/checkout',auth.isLogin,cartController.loadCheckout);



// wish list
user_route.get('/wishlist',auth.isLogin,wishlistController.loadWishList);

user_route.post('/addToWishlist',wishlistController. addToWishlist);

user_route.get("/removewishlist",auth.isLogin,wishlistController.removeWishlist)

user_route.post("/addFromWish",wishlistController.addFromWish)



// address 
user_route.get('/addAddress',auth.isLogin,addressController.addAddress);

user_route.post('/addAddress',addressController.insertAddress);

user_route.get('/removeAddress',auth.isLogin,addressController.removeAddress);




// profile
user_route.get('/profile',auth.isLogin,userController.loadProfile);


// order
user_route.post('/checkout',orderController.placeOrder);

user_route.get("/orderHistory",auth.isLogin,orderController.loadorderHistory);

user_route.get('/historyView',auth.isLogin,orderController.detailedView)

user_route.post("/onlinePayment",orderController. verifyOnlinePayment)

user_route.post('/cancel-order',orderController.CancelOrder)

user_route.get("/ordersuccess",auth.isLogin,orderController.orderSuccessPage)



// empty page
user_route.get("/emptyPage",auth.isLogin,cartController.emptyPage)



//  coupon
user_route.post('/applyCoupon',couponController.applyCoupon);
user_route.get('/couponbutton',couponController.couponButton);






// error page
user_route.get("/errorPage",auth.isLogin,userController.errorPage)

// search
user_route.post("/search",userController.SearchResult)
// filter\
user_route.get("/filter",auth.isLogin,userController.filterResult)

user_route.get("/filtercat",auth.isLogin,userController.filtercat)








module.exports=user_route