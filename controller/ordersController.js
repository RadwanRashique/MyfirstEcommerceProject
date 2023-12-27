const orders = require("../model/ordersModel");

// to download salesreport in excel form
const exceljs=require("exceljs")

const Address = require("../model/addressModel");

const User = require("../model/userModel");

const Cart = require("../model/cartModel");

const Product = require("../model/productModel");

const dotenv = require("dotenv");
dotenv.config();

var salesdata

const Razorpay = require("razorpay");



var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const { Console } = require("console");
const { triggerAsyncId } = require("async_hooks");
const { response } = require("../routes/userRoute");
var amount;
var Nwallet
const placeOrder = async (req, res) => {
  try {

    const userData = await User.findOne({ _id: req.session.user_id });
    const session = req.session.user_id;
    const total = await Cart.aggregate([
      { $match: { user: userData.name } },
      { $unwind: "$products" },
      {
        $project: {
          productPrice: "$products.productPrice",
          count: "$products.count",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$productPrice", "$count"] } },
        },
      },
    ]);
    const Total = total[0].total;

    amount = parseInt(req.body.amount);
    

    const payment = req.body.payment;
    const address = req.body.address;

    const cartData = await Cart.findOne({ userName: req.session.user_id });

    const products = cartData.products;

    const status = payment === "COD" ? "Placed" : "Pending";

    const newOrder = new orders({
      deliveryDetails: address,
      user: userData.name,
      user_id: req.session.user_id,
      paymentMethod: payment,
      products: products,
      totalAmount: amount,
      date: new Date(),
      status: status,
    });

    const orderData = await newOrder.save();
    if (req.body.wallet && amount > userData.wallet) {
        
        amount = amount - userData.wallet;
        Nwallet = 0;
      } else if (req.body.wallet && amount < userData.wallet) {
        

        
        Nwallet = userData.wallet - amount;
        amount = 0;
      }
     
        await User.updateOne({_id:session},{$set:{wallet:Nwallet}})
      
    
    if (status === "Placed") {
      for (let i = 0; i < products.length; i++) {
        const productId = products[i].productId;
        const quantity = products[i].count;
        await Product.findByIdAndUpdate(productId, {
          $inc: { stock: -quantity },
        });
        await orders.findByIdAndUpdate({_id:orderData._id},{$set:{ Bill_Amo:amount}})
      }

      await Cart.deleteOne({ userName: req.session.user_id });
      
      res.json({ success: true });
    } else {
      const orderid = orderData._id;
      
    
      if (amount > 0) {
        const totalamount = amount;
        var options = {
          amount: amount * 100,
          currency: "INR",
          receipt: "" + orderid,
        };
        
        instance.orders.create(options, function (err, order) {
          res.json({ order });
        });
      } else {
        
        await Cart.deleteOne({ userName: session });
        
        res.json({ success: true });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadorderHistory = async (req, res) => {
  try {
    const id = req.session.user_id;

    const orderData = await orders
      .find({ user_id: id })
      .sort({ date: -1 })
      .populate("products.productId");

    res.render("orderhistory", { orders: orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const detailedView = async (req, res) => {
  try {
    const Id = req.query.id;

    const viewdetails = await orders
      .findById({ _id: Id })
      .populate("products.productId");

    

    res.render("Detailviewpage", { view: viewdetails });
  } catch (error) {
    console.log(error.message);
  }
};
const verifyOnlinePayment = async (req, res) => {
  try {
       

    
    const details = req.body;
    
    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", "2WzJ6sPfIRfs8uFZRMi5CRHR");

    hmac.update(
      details.payment.razorpay_order_id +
        "|" +
        details.payment.razorpay_payment_id
    );

    hmac = hmac.digest("hex");

  

    if (hmac == details.payment.razorpay_signature) {
      await orders.findByIdAndUpdate(
        { _id: details.order.receipt },
        { $set: { status: "Placed" } }
      );

      await orders.findByIdAndUpdate(
        { _id: details.order.receipt },
        { $set: { payment_id: details.payment.razorpay_payment_id } }
      );

      // if (status === "placed") {
      //     for(let i=0;i<products.length;i++){
      //         const productId=products[i].productId
      //         const quantity=products[i].count
      //         await Product.findByIdAndUpdate(productId,{$inc:{stock:-quantity}})
      //     }
      // }
      const cartData= await orders.findOne({ _id: details.order.receipt });
      const products = cartData.products;
      await Cart.deleteOne({ userName: req.session.user_id });
      for (let i = 0; i < products.length; i++) {
        const productId = products[i].productId;
        const quantity = products[i].count;
        await Product.findByIdAndUpdate(productId, {
          $inc: { stock: -quantity },
        });
      }

      res.json({ success: true });
      
    } else {
      await orders.findByIdAndRemove({ _id: details.order.receipt });
      res.json({ success: false });
    // res.render("/home")
      
    }
  } catch (error) {
    console.log(error.message);
  }
};

// user cancel /return order
const CancelOrder = async (req, res) => {
  try {
    const id = req.body.id;
    const status = req.body.status;
    

    const reas= req.body.reason
    if(reas)
    {
     const order = await orders.findByIdAndUpdate({_id:id},{$set:{reason:reas}})

    }
    
     
    const order = await orders.findOne({ _id: id });
    
    



    // Create a new Date object for the delivery date
    const deliveryDate = new Date(order.date);
    deliveryDate.setDate(deliveryDate.getDate() + 14);

    if (status == "Return") {
      if (new Date() <= deliveryDate) {
        await orders.findByIdAndUpdate(
          { _id: id },
          { $set: { status: status } }
        );
      } else {
        res.json({ success: false });
      }
    } else {
      const Data = await orders.findByIdAndUpdate(
        { _id: id },
        { $set: { status: status } }
      );
      const userorder = await orders.findOne({ _id: id });
    
      if (userorder.status == "Cancelled"  ||  userorder.status == "Shipped" ||  userorder.status == "Packed"     ) {
       
        if (userorder.paymentMethod != "COD") {
          const wallet = await User.findOne({ _id: req.session.user_id });
        
          const amount = wallet.wallet + userorder.totalAmount;
          
          const userWallet = await User.findByIdAndUpdate(
            { _id: req.session.user_id },
            { $set: { wallet: amount } }
          );
          
          // wallet history
        }
        res.json({ success: true });
      }

      if(userorder.status == "Cancelled" || userorder.status == "Return Approved")
      {
        const data=   userorder.products
        console.log(data)
         for (let i = 0; i < data.length; i++) {
    const product = data[i];
    const productId = product.productId;
    const updatedcount = product.count;
    const _id = product._id;

    const prodata= await Product.findById({_id:productId})
    const existingproduct= prodata.stock
    const productdata= await Product.findByIdAndUpdate({_id: productId },{$set:{stock:existingproduct+updatedcount}})
  }


        

      }
     
    }
  } catch (error) {
    console.log(error.message);
  }
};

//  to list order page to admin
const adminShowOrder = async (req, res) => {
  try {
  

    const orderData = await orders.find().populate("products.productId");

    
    res.render("listorder", { orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const orderSuccessPage = async (req, res) => {
  try {
    res.render("orderPlaced");
  } catch (error) {
    console.log(error);
  }
};
const viewOrder = async (req, res) => {
  try {
    const id = req.query.id;
  
    const orderData = await orders
      .findById({ _id: id })
      .populate("products.productId");
    res.render("vieworders", { orders: orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const adminCancelOrder = async (req, res) => {
  try {
    const id = req.query.id;
    const orderData = await orders.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "OrderCancelled" } }
    );
    
    res.redirect("/admin/showOrdrs");
  } catch (error) {
    console.log(error.message);
  }
};

const adminPlaceOrder = async (req, res) => {
  try { 
    const id = req.query.id;
    const orderData = await orders.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "Delivered" } }
    );

    res.redirect("/admin/showOrdrs");
  } catch (error) {
    console.log(error.message);
  }
};

const orderStatus = async (req, res) => {
  try {

    const Rejectreason= req.body.reason 
    console.log(Rejectreason)
    

    const user = await User.findOne({ _id: req.session.user_id });

    const Id = req.body.id;
   
    const Data = req.body.data;

    const walletamount= user.wallet
   
    const order= await orders.findOne({_id:Id})
    const totalAmount=order.totalAmount
   
    // for return reason storage
    const  RejectReason= await orders.findByIdAndUpdate({_id:Id},{$set:{ RejectReason:Rejectreason}})
  

  
    await orders.findByIdAndUpdate(
      { _id: Id },
      { $set: { status: Data } } 
    );
    const update = orders.findById({_id: Id })
    // console.log(update.status+"Llll");
    if (Data == "Return Approved" ) {
     
      const wallet = parseInt(totalAmount )+ parseInt(walletamount);
      await User.findByIdAndUpdate(
        { _id: req.session.user_id },
        { $set: { wallet: wallet } }
      );
      
    }








    if (Data == "Delivered") {
    

      await orders.findByIdAndUpdate(
        { _id: Id },
        { $set: { delivery_date: new Date() } }
      );
    }
    res.json({ success: true });
  } catch (error) {

    res.render("404")
    console.log(error.message);
  }
};




//  sales report
const  salesReport= async (req, res) => {
  try {
    
    orderdetails = await orders.find({status: { $nin: ["Cancelled","Return Approved","pending"] }}).sort({ date: -1 }).populate('products.productId')
    const products=orderdetails.products
    
        
        
   
   res.render('salesreport',{order:orderdetails})





  } catch (error) {
    console.log(error.message);
  }
};

//sales report
const   SalesFilter=async(req,res)=>
{
  try {

    const datestart = req.body.start
    const dateend = req.body.end
    orderdetails = await orders.find({
        date: {
       
          $gte: datestart,
          $lte: dateend
        },status: { $nin:[ "Cancelled","pending"] }
      })
 
      salesdata  = orderdetails

    res.render('salesreport',{order:orderdetails})
    
}
    

    
  catch (error) {
    
  }
}

















// To download sales report

const downloadSalesReport=async (req,res)=>
{
   try {
    const datestart = req.body.start
    const dateend = req.body.end
    




   const workbook=  new  exceljs.Workbook()
   const worksheet = workbook.addWorksheet("My sales report")

   worksheet.columns=
   [
    { header:"S no.",key:"s_no" },
    { header:"User",key:"user" },
    { header:"Status",key:"status" },
    
    { header:"Price",key:"totalAmount" },
    { header:"PayMethod",key:"paymentMethod" },
    { header:"Date",key:"date" }
    
]
let counter = 1;
const orderData = salesdata
orderData.forEach((order)=>{
    order.s_no = counter;
    worksheet.addRow(order);
    counter++;
})

worksheet.getRow(1).eachCell((cell)=>{
    cell.font = { bold:true };
})

res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
res.setHeader("Content-Disposition",`attachment;filename=order.xlsx`)

return workbook.xlsx.write(res).then(()=>{
    res.status(200);
})

} catch (error) {
console.log(error.message);
}
}


const   loadsalesreport = async (req, res) => {
  try {
      let from = new Date(req.query.from)
      let to = new Date(req.query.to)

      req.query.from ? from = new Date(req.query.from) : from = 'ALL'
      req.query.to ? to = new Date(req.query.to) : to = 'ALL'
      if (from !== "ALL" && to !== "ALL") {

          const orderdetails = await orders.aggregate([
              {
                  $match: {
                      $and: [{ date: { $gte: from } }, { date: { $lte: to } }]

                  }
              }
          ])
          req.session.Orderdtls = orderdetails
          const products = orderdetails.products

          res.render('salesReport', { orderdetails, from, to })
      } else {
          const orderdetails = await orders.find({ status: { $nin: ["cancelled","Return Approved","pending"] } })
          req.session.Orderdtls = orderdetails
          res.render('salesReport', { orderdetails, from, to })
      }

  } catch (error) {
      console.log(error.message);
  }
}


module.exports = {
  placeOrder,
  loadorderHistory,
  detailedView,
  verifyOnlinePayment,
  CancelOrder,

  adminShowOrder,
  orderSuccessPage,
  viewOrder,
  adminCancelOrder,
  adminPlaceOrder,

  orderStatus,
  salesReport,
  SalesFilter,

  downloadSalesReport,
  loadsalesreport

};
