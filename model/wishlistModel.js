const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    products:[{
        productId:{
            type:ObjectId,
            ref:"products",
            required:true
        }
    }]
})

const wishlistModel = mongoose.model("wishlist",wishlistSchema);
module.exports = wishlistModel; 
// Here the first parameter is the  name of collection and the 2nd is the schema model that the collection need to follow