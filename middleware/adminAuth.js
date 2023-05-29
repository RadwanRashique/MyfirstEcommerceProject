const user =require("../model/userModel")



const isLogin=async(req,res,next)=>{
    try {

        
        
        

        if(req.session.user_id ){


        }
        else{
            res.redirect('/admin')
        }
        next()
        
    } catch (error) {
        console.log(error.message
            )
        
    }
}





const isLogout=async(req,res,next)=>{
    try {
        const userdata= await user.find({_id:req.session.user_id})
        
        if (req.session.user_id &&  userdata.is_admin==1) {
            res.redirect("/admin/home")
            
        } next()
        
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports={
    isLogin,
    isLogout
}