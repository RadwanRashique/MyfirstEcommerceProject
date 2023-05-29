const User = require("../model/userModel");


const bcrypt = require("bcrypt");

const multer = require("multer");
const Order=require("../model/ordersModel")

const Product=require("../model/productModel")

const config = require("../config/config");

// To load adminHome page
const loginLoad = async (req, res) => {
  try {
    res.render("Adminlogin");
  } catch (error) {
    console.log(error.message);
  }
};

//  To verify login details and procced
const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_admin === 0) {
          res.render("Adminlogin", {
            message: "you dont have permission to access",
          });
        } else {
          req.session.user_id = userData._id;

          res.redirect("/admin/home");
        }
      } else {
        res.render("Adminlogin", {
          message: "Enter the correct mail and password",
        });
      }
    } else {
      res.render("Adminlogin", {
        message: "Enter the email and password correctly",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};


// To move to admin home

const loadHome = async (req, res) => {
  try {
    res.render("Adminhome");
  } catch (error) {
    console.log(error.message);
  }
};

// logout
const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.render("Adminlogin");
  } catch (error) {
    console.log(error.message);
  }
};

// admin in
const adminIn = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_admin === 0) {
          res.render("Adminlogin", {
            message: "you dont have permission to access",
          });
        } else {
          req.session.user_id = userData._id;

          res.redirect("/admin/home");
        }
      } else {
        res.render("Adminlogin", {
          message: "Enter the correct mail and password",
        });
      }
    } else {
      res.render("Adminlogin", {
        message: "Enter the email and password correctly",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};




const LoadDashboard=async (req,res)=>
{
  try {
       
     
    const orderData = await Order.find({ status: {  $nin: ["cancelled","Return Approved","pending"]} })

    let SubTotal = 0
    orderData.forEach(function (value) {
        SubTotal = SubTotal + value.totalAmount
        ;
    })

    const cod = await Order.find({ paymentMethod
      : "COD",status: { $nin: ["cancelled","Return Approved","pending"]} }).count()
    const online = await Order.find({ paymentMethod: "online",status: { $nin: ["cancelled","Return Approved","pending"]} }).count()
    const totalOrder = await Order.find({ status: { $nin: ["cancelled","Return Approved","pending"]} }).count()
    const totalUser = await User.find().count()
    const totalProducts = await Product.find().count()

    const date = new Date()
    const year = date.getFullYear()
    const currentYear = new Date(year, 0, 1)

    const salesByYear = await Order.aggregate([
        {
            $match: {
                date: { $gte: currentYear }, status: { $nin: ["cancelled","Return Approved","pending"] }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%m", date:  "$date" } },
                total: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])
   //user progressssss




const userCountByMonth = await User.aggregate([
{
$match: {
Date: { $gte: currentYear } // get all user records created from the start of the current year
}
},
{
$group: {
_id: { $dateToString: { format: "%m", date: "$Date" } }, // group by month and year
total: { $sum: 1 },
count: { $sum: 1 } // calculate the total count of users for each month
}
},
{
$sort: { _id: 1 } // sort by month in ascending order
}
]);



    let sales = []
    for (i = 1; i < 13; i++) {
        let result = true
        for (j = 0; j < salesByYear.length; j++) {
            result = false
            if (salesByYear[j]._id == i) {
                sales.push(salesByYear[j])
                break;
            } else {
                result = true

            }
        }
        if (result) {
            sales.push({ _id: i, total: 0, count: 0 })
        }

    }

    let yearChart = []
    for (i = 0; i < sales.length; i++) {
        yearChart.push(sales[i].total)
    }


// users progress
let user = []
for (i = 1; i < 13; i++) {
let result = true
for (j = 0; j < userCountByMonth.length; j++) {
result = false
if (userCountByMonth[j]._id == i) {
user.push(userCountByMonth[j])
break;
} else {
result = true

}
}
if (result) {
user.push({ _id: i, total: 0, count: 0 })
}

}

let yearChartuser = []
for (i = 0; i < user.length; i++) {
yearChartuser.push(user[i].total)
}
let salescount = []
for (i = 0; i < sales.length; i++) {
salescount.push(sales[i].count)
}




    res.render('Adminhome',{data:orderData,total:SubTotal,cod,online,totalOrder,totalUser,totalProducts, yearChart ,yearChartuser,salescount})



} catch (error) {
console.log(error.message);
}
  
}




module.exports = {
  loginLoad,
  verifyLogin,
  loadHome,
  adminLogout,
  adminIn,
  LoadDashboard
 
};
