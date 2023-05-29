const User = require('../model/userModel');

const Coupon = require('../model/couponModel');



const postAddCoupon = async(req,res)=>{
    try{
        const coupon = new Coupon({
            code:req.body.code,
            discountType:req.body.discount,
            expiryDate:req.body.date,
            discountAmount:req.body.amount,
            maxCartAmount:req.body.cartAmount,
            maxDiscountAmount:req.body.discountAmount,
            maxUsers:req.body.couponCount
        })
        const couponData = await coupon.save();
    
        if(couponData){
            
            res.redirect("/admin/listCoupon")
        }
        // else{
        //     res.redirect('/admin/listCoupon')
        // }
    }catch(error){
        console.log(error.message);
    }
}


const loadAddCoupon = async(req,res)=>{
    try{
        res.render('addcoupon');
    }catch(error){
        console.log(error.message);
    }
}


const listCoupon = async (req,res)=>{
    try{
        const couponData = await Coupon.find({});
        res.render('listcoupon',{couponData});
    }catch(error){
        console.log(error.message);
    }
}

const loadEditCoupon= async (req,res)=>{
    try{
        const couponId = req.query.id;
        const couponData = await Coupon.findOne({_id:couponId});
        res.render('editcoupon',{coupon:couponData});
    }catch(error){
        console.log(error.message);
    }
}

const postEditCoupon = async (req,res)=>{
    try{
        const couponId = req.query.id;
        const coupon = await Coupon.findByIdAndUpdate({_id:couponId},{
            code:req.body.code,
            discountType:req.body.discount,
            discountAmount:req.body.amount,
            expiryDate:req.body.date,
            maxCartAmount:req.body.cartAmount,
            maxDiscountAmount:req.body.discountAmount,
            maxUsers:req.body.couponCount
        })
        await coupon.save();
        res.redirect('/admin/listCoupon');
    }catch(error){
        console.log(error.message);
    }
}

const deleteCoupon = async (req,res)=>{
    try{
        const couponId = req.query.id;
       
        await Coupon.deleteOne({_id:couponId});
        res.redirect('/admin/listCoupon');
    }catch(error){
        console.log(error.message);
    }
}


// apply coupon in user side
const applyCoupon= async(req,res)=>
{

 try{
    const code = req.body.code;
    console.log(req.body.code)
        const amount = Number(req.body.amount);
        const userExist = await Coupon.findOne({code:code,user:{$in:[req.session.user_id]}});
        if(userExist){
            res.json({user:true});
        }else{
            const couponData = await Coupon.findOne({code:code});
            console.log(couponData);
            if(couponData){
                if(couponData.maxUsers<=0){
                    res.json({limit:true});
                }else{
                    if(couponData.status == false){
                        res.json({status:true})
                    }else{
                        if(couponData.expiryDate<=new Date()){
                            res.json({date:true});
                        }else{
                            if(couponData.maxCartAmount <=amount){
                                res.json({cartAmount:true});
                            }else{
                                await Coupon.findByIdAndUpdate({_id:couponData._id},{$push:{user:req.session.user_id}});
                                await Coupon.findByIdAndUpdate({_id:couponData._id},{$inc:{maxUsers:-1}});
                                if(couponData.discountType == "Percentage Type"){
                                    const disAmount = couponData.discountAmount;
                                    const disTotal = Math.round(amount - disAmount);
                                    return res.json({amountOkey:true,disAmount,disTotal});

                                    const perAmount = (amount * couponData.discountAmount)/100;
                                    if(perAmount <= maxDiscountAmount){
                                        const disAmount = perAmount;
                                        const disTotal = Math.round(amount-disAmount);
                                        return res.json({amountOkey:true,disAmount,disTotal});
                                    }
                                }else{
                                    const disAmount = couponData.maxDiscountAmount;
                                    const disTotal = Math.round(amount-disAmount);
                                    return res.json({amountOkey:true,disAmount,disTotal});
                                }
                            }
                        }
                    }
                }
            }else{
                res.json({invalid:true});
            }
        }
 }
 catch(error)
 {
    console.log(error.message)
 }


}


// coupon button
const couponButton=async(req,res)=>
{
  try {

    const coup= await  Coupon.find()
    console.log(coup)

    res.render("couponlist",{coup})
    
  } catch (error) {
    
  }

}



module.exports = {
    loadAddCoupon,
    postAddCoupon,
    listCoupon,
    
    loadEditCoupon,
    postEditCoupon,
     deleteCoupon,

     applyCoupon,
     couponButton
}