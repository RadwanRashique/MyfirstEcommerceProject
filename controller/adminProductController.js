const products = require("../model/productModel");

const category=require("../model/categoryModel")


const multer = require("multer");



// add products
const addProducts = async (req, res) => {
    try {

      const cat= await category.find()
      res.render("addproducts",{cat});
    } catch (error) {
      console.log(error.message);
    }
  };



  const postproducts = async (req, res) => {
    try {
      const image = [];
      for (let i = 0; i < req.files.length; i++) {
        image[i] = req.files[i].filename;
      }
  
      const product = new products({
        name: req.body.name,
        price: req.body.price,
        image: image,
        category: req.body.category,
        description: req.body.discription,
        stock: req.body.stocks,
        is_block:true
      });
  
      const ProductData = await product.save();
  
      if (ProductData) {
        res.redirect("/admin/Products");
      }
    } catch (error) {
      console.log(error.message);
    }
  };



//getProductsPage
const showProductsPage = async (req, res) => {
    try {
      const ProductData = await products.find();
      res.render("Products", { products: ProductData });
    } catch (error) {
      console.log(error.message);
    }
  };



  // to block product
const productblock = async (req, res) => {
    const id = req.query.id;
    const data = req.query.data;
  
    try {
      if (data) {
        await products.updateOne({ _id: id }, { $set: { block: 0 } });
        res.redirect("/admin/Products");
      } else {
        await products.updateOne({ _id: id }, { $set: { block: 1 } });
        res.redirect("/admin/Products");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  // Edit Product
const editProduct = async (req, res) => {
    const id = req.query.id;
    const productdata = await products.findById({ _id: id });
    try {
        const cat= await category.find()
        const categ= cat.category

      if (productdata) {
        res.render("editproduct", { product: productdata,cat,categ});
      } else {
        res.redirect("/admin/Products");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  



  //  update edited product (post)
const productUpdate = async (req, res) => {
    try {
      const image = [];
      for (let i = 0; i < req.files.length; i++) {
        image[i] = req.files[i].filename;
      }
      const id = req.query.id;
      if (image.length > 0) {
        const product = await products.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              image: image,
              category:req.body.category,
              description: req.body.discription,
              stock: req.body.stocks,
            },
          }
        );
  
        const ProductData = await product.save();
  
        if (ProductData) {
          res.redirect("/admin/Products");
        }
      } else {
        const product = await products.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: req.body.name,
              price: req.body.price,
              category: req.body.category,
              description: req.body.discription,
              stock: req.body.stocks,
            },
          }
        );
  
        const ProductData = await product.save();
  
        if (ProductData) {
          res.redirect("/admin/Products");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  // To block product
const adminBlockProduct = async (req, res) => {
    try {
      const id = req.query.id;
      
  
       await   products.findByIdAndUpdate({ _id: id },{$set:{is_block:false}});
  
      res.redirect("/admin/Products");
    } catch (error) {
      console.log(error.message);
    }
  };
  

  // un block product
  const adminUnBlockProduct = async (req, res) => {
    try {
      const id = req.query.id;
      console.log("working")
  
     await   products.findByIdAndUpdate({ _id: id },{$set:{is_block:true}});
  
      res.redirect("/admin/Products");
    } catch (error) {
      console.log(error.message);
    }
  };
  



  module.exports={
  addProducts,
  postproducts,
  showProductsPage,
  productblock,
  editProduct,
  productUpdate,
  adminBlockProduct,
  adminUnBlockProduct

  }