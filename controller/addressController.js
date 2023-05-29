const User=require("../model/userModel")

const Address =require("../model/addressModel")



const addAddress = async(req,res)=>{
    try{
        const userName = await User.findOne({_id:req.session.user_id});
        if(req.session.user_id){
            let customer = true;
            res.render('addAddress',{customer,userName});
        }else{
            res.redirect('/');
        }
    }catch(error){
        console.log(error.message);
    }
}

const insertAddress = async(req,res)=>{
    try{
        const userData = await User.findOne({_id:req.session.user_id});
        const addressDetails = await Address.findOne({userId:req.session.user_id});
        if(addressDetails){
            const updatedOne = await Address.updateOne({userId:req.session.user_id},{$push:{addresses:{userName:req.body.userName,
                mobile:req.body.mobile,
                alternativeMob:req.body.alterMobile,
                address:req.body.address,
                city:req.body.city,
                state:req.body.state,
                pincode:req.body.pincode,
                landmark:req.body.landmark}}})
                if(updatedOne){
                    res.redirect('/checkout');
                }else{
                    res.redirect('/checkout');
                }
        }else{
            const address = new Address({
                userId:userData._id,
                addresses:[{
                    userName:req.body.userName,
                    mobile:req.body.mobile,
                    alternativeMob:req.body.alterMobile,
                    address:req.body.address,
                    city:req.body.city,
                    state:req.body.state,
                    pincode:req.body.pincode,
                    landmark:req.body.landmark
                }]
            });
            const addressData = await address.save();
            if(addressData){
                res.redirect('/checkout')
            }else{
                res.redirect('/checkout');
            }
        }
    }catch(error){        
        console.log(error.message);
    }
}

const removeAddress = async (req,res)=>{
    try{
        await Address.updateOne({userId:req.session.user_id},{$pull:{addresses:{_id:req.query.id}}});
        res.redirect('/checkout');
    }catch(error){        
        console.log(error.message);
    }
}

module.exports = {
    addAddress,
    insertAddress,
    removeAddress
}