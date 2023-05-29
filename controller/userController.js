const User = require("../model/userModel");

// for secrect (dotenv)
 const dotenv=require("dotenv")
dotenv.config()

// product
const products = require("../model/productModel");

// banner
const banner=require("../model/bannerModel")

// coupon
const coupon=require("../model/couponModel")


//  cart
const Cart=require("../model/cartModel")
// category
const category = require("../model/categoryModel");



const Address =require("../model/addressModel")
// to send message and verify mail
const nodmailer = require("nodemailer");

const randomString = require("randomstring");

const config = require("../config/config");

// TO SECURE PASSWORD IN HASH
const bcrypt = require("bcrypt");

const SMTPConnection = require("nodemailer/lib/smtp-connection");

let otp;
let opt2;
let newpassword;

let varemail;

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

// to send mail
const sendVerifyMail = async (name, email, otp) => {
  try {
    const transporter = nodmailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.emailUser,

        pass: process.env.emailPassword,
      },
    });
    const mailOption = {
      from:process.env.emailUser,
      to: email,
      subject: "Verification mail",
      html: "Hi " + name + "   your otp  is " + otp,
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
       
        console.log("Email has been sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const veryfiyUser = async (req, res) => {
  try {
    res.render("otp");
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    res.send(error.message);
  }
};

const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);

    const olreadymail = await User.findOne({ email: req.body.email });

    const user = new User({
      name: req.body.name,
      age: req.body.age,
      phone: req.body.phone,
      email: req.body.email,
      password: spassword,
      is_admin: 0,
      date:new Date()

    });
    varemail = req.body.email;

    if (req.body.name.trim() == "") {
      res.render("register", { message: "Blank space is not allowed" });
    } else {
      if (olreadymail) {
        res.render("register", { message: "This Mail olready have Account" });
      } else {
        const userData = await user.save();
        if (userData) {
          //otp generation

          randomNumber = Math.floor(Math.random() * 9000) + 1000;
          otp = randomNumber;
          opt2 = otp;
          sendVerifyMail(req.body.name, req.body.email, randomNumber);
          res.redirect("/verify");
        } else {
          res.render("register", { message: "Registeration Failed" });
        }
      }
    }
  } catch (error) {
    res.send(error.message);
  }
};

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      
      if (passwordMatch) {
        if (userData.is_varified === 0) { 
          res.render("login", {
            message: "please verify your mail. Or you have get blocked .",
          });
        } else {
          req.session.user_id = userData._id;

          res.redirect("/home");
        }
      }
      else { 
      res.render("login", { message: "Email and password is incorrect" });
    } 
    }
  } catch (error) {
    console.log(error.message);
  }
};

const otpset = async (req, res) => {
  try {
    if (opt2 == req.body.otp) {
      const updateInfo = await User.findOneAndUpdate(
        { email: varemail },
        { $set: { is_varified: 1 } }
      );
      res.render("login");
    } else {
      res.render("otp", { message: "OTP is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
// banner
    const bannerData= await banner.find()

    // cart
    const cart= await Cart.find()
    

    const data = await products.find();
    res.render("home", { data,bannerData,cart });
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("login");
  } catch (error) {
    console.log(error.message);
  }
};

// forget password code start
const forgetLoad = async (req, res) => {
  try {
    res.render("forget");
  } catch (error) {
    console.log(error.message);
  }
};

const forgetVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });

    if (userData) {
      if (userData.is_varified === 0) {
        res.render("forget", { message: "plese verify your mail." });
      } else {
        varemail = userData.email;
        randomNumber = Math.floor(Math.random() * 9000) + 1000;
        otp = randomNumber;
        opt2 = otp;
         await sendVerifyMail(userData.name, req.body.email, randomNumber);
        res.redirect("/forgetotp");
      }
    } else {
      res.render("forget", { message: "email is incorrect " });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadOTP = async (req, res) => {
  try {
    res.render("forgetotp");
  } catch (error) {
    console.log(error.message);
  }
};

const createNewpassword = async (req, res) => {
  try {
    if (opt2 == req.body.otp) {
      res.redirect("/createNewpassword");
    } else {
      res.render("forgetotp", { message: "OTP is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const passwordsetup = async (req, res) => {
  try {
    res.render("createNewpassword");
  } catch (error) {
    console.log(error.message);
  }
};

const passwordseted = async (req, res) => {
  try {
    console.log(req.body.Password);
    if (req.body.Password.trim().length == "") {
      res.render("createNewpassword", { message: "Space Not Allowed" });
    } else {
      const spassword = await securePassword(req.body.Password);
      newpassword = spassword;
      const userdata = await User.updateOne(
        { email: varemail },
        { $set: { password: newpassword } }
      );

      res.redirect("/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const productview = async (req, res) => {
  try {


    const id = req.query.id;
    const productdata = await products.findOne({ _id: id });

    if(productdata){
      res.render("product-detail", { product: productdata });
    }
   
    
   
   

    
 
}
  catch (error) {
    res.render('404')
    console.log(error.message);
  }
};

const showShop = async (req, res) => {
  try {
    const cat = await category.find();
  
    const data = await products.find();
    res.render("shop", { data, cat });
  } catch (error) {
    console.log(error.message);
  }
};

// search
const searchProduct = async (req, res) => {
  try {
    const searchValue = req.body.search;

    const search = searchValue.trim();

    if (search != "") {
      let product = await products.find({
        $and: [{ name: { $regex: `^${search}`, $options: "i" } }],
      });

      let cat = await category.find({
        $and: [{ name: { $regex: `^${search}`, $options: "i" } }],
      });

      res.render("shop", { data: product, cat });
    }
  } catch (error) {
    console.log(error.message);
  }
};


// profile
const  loadProfile=async (req,res)=>
{
  try{
    const userName = await User.findOne({_id:req.session.user_id});
   
    
    const addressData=await Address.findOne({userId:req.session.user_id});

    const coup= await   coupon.find()

    
    if(req.session.user_id){
        const customer = true;
        if(addressData){
          if(addressData.addresses.length>0)
          {         const address=addressData.addresses           
          res.render('profile',{address,customer,userName,coup});
          }
        else{
          res.redirect("/home")
        }
    }else{
        res.redirect('/home');
    }
  }
    else{

      res.redirect('/home');
    }


}catch(error){
    console.log(error.message);
}
}


// error page
const errorPage= async(req,res)=>
{

    try {
        res.render("404")
    } catch (error) {
              console.log(error.message)
    }
}


// serach
const SearchResult = async (req, res) => {
  try {
   const search = req.body.search
   const cat = await category.find();
    const productData=   await   products.find({"name":{ $regex: ".*" + search + ".*", $options: 'i' }})
    if(productData.length>0)
    {
      res.render("shop",{ data:productData,cat})

    }
    else{

      res.redirect("/shop")
    }
  } catch (error) {
      console.log(error.message);
  }
}



const filterResult=async(req,res)=>
{


    try {
         const value1=  req.query.value1;
         const value2=  req.query.value2
        

        
         
          console.log('12312');
          const cat = await category.find();
          const Data= await products.find({price:{$gte:value1,$lt:value2}})         
          res.render("shop",{ data:Data,cat})
          
     
        
         
  

       

    } catch (error) {
      
    }


}
const filtercat= async(req,res)=>{
  const categoryy=req.query.category
  console.log(categoryy);


  console.log('1111111');
  const cat = await category.find({})
  const Data= await products.find({category:categoryy})
  console.log(Data);
  res.render("shop",{ data:Data,cat})
}




module.exports = {
  loadRegister,
  insertUser,
  veryfiyUser,
  otpset,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  forgetLoad,
  forgetVerify,
  loadOTP,
  createNewpassword,
  passwordsetup,
  passwordseted,
  productview,
  showShop,
  searchProduct,
  loadProfile,
  errorPage,
  SearchResult,
  filterResult,
  filtercat
};
