const express=require("express")
const admin_route=express()
const path = require('path')

// for image
const multer=require("multer")
const storages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../public/admin/img'))
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name)
    }
})
const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  };
  
  const upload =multer({storage:storages,fileFilter:imageFilter})



 const session=require("express-session")


 const config=require("../config/config")

 admin_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false
}))

const adminAuth=require('../middleware/adminAuth')


admin_route.set('view engine','ejs')
admin_route.set('views','views/admin')
const bodyParser=require('body-parser')
admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))


const adminController = require("../controller/adminController")
// user controller
const adminUserController=require("../controller/adminUserController")

// product controller
const adminProductController=require("../controller/adminProductController")

// category controller
const adminCategoryController=require("../controller/adminCategoryController")

// coupon controller
const admincouponController = require('../controller/couponController');

// banner
const adminbannerController=require("../controller/bannerController")

// order
const adminOrderController=require("../controller/ordersController")


// Routes
admin_route.get("/",adminAuth.isLogout,adminController.loginLoad)
admin_route.post("/",adminController.verifyLogin)
// dashboard
admin_route.get("/home",adminAuth.isLogin,adminController.LoadDashboard)


admin_route.get("/logout",adminAuth.isLogin,adminController.adminLogout)
admin_route.post("/logout",adminController.adminIn)


// user

admin_route.get("/user_details",adminAuth.isLogin,adminUserController.showUserDetails)
// block user (user details) 
admin_route.get("/block_user",adminAuth.isLogin,adminUserController.blockUser)



// sales report
admin_route.get("/salesreport",adminAuth.isLogin,adminOrderController.salesReport)

// sales filter
admin_route.post("/salesfilter",adminOrderController.SalesFilter)


// product

// product add
admin_route.get("/addproducts",adminAuth.isLogin,adminProductController.addProducts)

// post product
admin_route.post("/addproducts",upload.array('image',4),adminProductController.postproducts)

// show products
admin_route.get("/Products",adminAuth.isLogin,adminProductController.showProductsPage)

// block products
admin_route.get("/productblock",adminAuth.isLogin,adminProductController.productblock)

// To Edit Product
admin_route.get("/productedit",adminAuth.isLogin,adminProductController.editProduct)

// To post edited product
admin_route.post("/productedit",upload.array('image',4),adminProductController.productUpdate)

// To block product
admin_route.get("/blockProducts",adminProductController.adminBlockProduct)

// To unblock product
admin_route.get("/unBlockProduct",adminProductController.adminUnBlockProduct)




// category

// show category
admin_route.get("/Categories",adminAuth.isLogin,adminCategoryController.showCategories)
// add category

admin_route.get("/addCategory",adminAuth.isLogin,adminCategoryController.addCategory)

// post category
admin_route.post("/addCategory",adminCategoryController.postCategory)

// To edit category
admin_route.get("/categoryedit",adminAuth.isLogin,adminCategoryController.categoryEdit)

// To post edited category
admin_route.post("/categoryedit",adminCategoryController.categoryUpdate)

// To block category
admin_route.get("/categoryblock",adminAuth.isLogin,adminCategoryController.categoryBlock)




// coupon
admin_route.get('/listCoupon',adminAuth.isLogin,admincouponController.listCoupon);


admin_route.post('/addCoupon',admincouponController.postAddCoupon);

admin_route.get('/addCoupon',adminAuth.isLogin,admincouponController.loadAddCoupon);

admin_route.get('/editCoupon',adminAuth.isLogin,admincouponController.loadEditCoupon);

admin_route.post('/editCoupon',admincouponController.postEditCoupon);

admin_route.get('/deleteCoupon',adminAuth.isLogin,admincouponController.deleteCoupon);


//  banner
admin_route.get('/addBanner',adminAuth.isLogin,adminbannerController.loadAddBanner);
admin_route.post('/addBanners',upload.single('image'),adminbannerController.addBanner);
admin_route.get('/listBanner',adminAuth.isLogin,adminbannerController.listBanner);
admin_route.get("/deleteBanner",adminAuth.isLogin,adminbannerController.deleteBanner);



// order
admin_route.get("/showOrdrs",adminAuth.isLogin,adminOrderController.adminShowOrder)
admin_route.get("/viewOrder",adminAuth.isLogin,adminOrderController.viewOrder)
admin_route.post("/orderStatus",adminOrderController.orderStatus)

// to download sales report
admin_route.get("/downloadSales",adminAuth.isLogin,adminOrderController.downloadSalesReport)
admin_route.get("/getsalesreport",adminAuth.isLogin,adminOrderController.loadsalesreport)



module.exports=admin_route








