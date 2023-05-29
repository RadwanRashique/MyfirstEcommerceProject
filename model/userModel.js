// mongo model is the wrapper of mongo schema
//  mongoose act has an interface    so we can do many thing in data base


// connect the mongoose library

const mongoose=require("mongoose")


// structure of document                        (mongo schema)
const userSchema=mongoose.Schema({


name:{
    type:String,
    required:true
},
age:{type:Number,
      required:true},
phone:{
   type:Number,
   required:true
},

email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
is_admin:{
    type:Number,
    required:true
},
is_varified:{
    type:Number,
    default:0
},
token:{
    type:String,
    default:""
},
wallet:{
    type:Number,
    default:0
},
date:{
    type:Date
}



})

module.exports= mongoose.model("user",userSchema)
// here the first parameter is the collection name  and 2nd one is  schema model that the collection need to follow

