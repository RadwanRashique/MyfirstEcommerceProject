const mongoose=require("mongoose")

const categorySchema= new mongoose.Schema({

 category:{
    type:String,
    required:true
 },
 is_block:{
   type:String,
   default:0
 }

}


)


module.exports=mongoose.model("Category",categorySchema)