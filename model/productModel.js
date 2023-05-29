const { fileLoader } = require("ejs")
const mongoose=require("mongoose")


//  structure of document                        (mongo schema)
const productSchema=new mongoose.Schema({


name:{
    type:String,
    required:true
},
price:{type:Number,
      required:true},
image:{
   type:Array,
   required:true

},

category:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
stock:{
    type:Number,
    required:true
},

is_block:{
    type:Boolean,
    default:true
}



})

module.exports= mongoose.model("products",productSchema)
// here the first parameter is the collection name  and 2nd one is  schema model that the collection need to follow

