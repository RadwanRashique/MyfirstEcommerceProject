const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
        image:{
            type:String,
            required:true
        },
        header:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        }
})

const bannerModel = mongoose.model("banner",bannerSchema);
module.exports = bannerModel;