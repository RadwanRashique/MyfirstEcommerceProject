const User = require("../model/userModel");



const showUserDetails = async (req, res) => {
    try {
      const userData = await User.find({ is_admin: 0 });
      res.render("User_details", { user: userData });
    } catch (error) {
      console.log(error.message);
    }
  };



  // block user
const blockUser = async (req, res) => {
    const id = req.query.id;
    try {
      if (req.query.data) {
        await User.updateOne({ _id: id }, { $set: { is_varified: 1 } });
      } else {
        await User.updateOne({ _id: id }, { $set: { is_varified: 0 } });
      }
  
      res.redirect("/admin/user_details");
    } catch (error) {
      console.log(error.message);
    }
  };
  
 
  
  module.exports={

    showUserDetails,
    blockUser

  }