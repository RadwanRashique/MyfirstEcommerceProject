   const category=require("../model/categoryModel")

   

// category page           list category
const showCategories = async (req, res) => {
    try {
      const CategoryData = await category.find();
      res.render("Categories", { Categorys: CategoryData });
    } catch (error) {
      console.log(error.message);
    }
  };



  // add category item
  const addCategory = async (req, res) => {
    try {
      res.render("addCategory");
    } catch (error) {
      console.log(error.message);
    }
  };
  

  //  post item to category
  const postCategory = async (req, res) => {
    try {
  
      const catdata=req.body.category
       const CategoryData= await category.findOne({category:catdata})
      
  if(CategoryData)
  {
    res.render("addCategory",{message:"This Category is Olready present"})
  }
     
  else{
  
    const category1 = new category({
      category: req.body.category
    
    });
  
    const catData = await category1.save();
  
    if (catData) {
      res.redirect("/admin/Categories");
    }
  }
      
    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  // Edit category page
  const categoryEdit = async (req, res) => {
    const id = req.query.id;
  
    const categorydata = await category.findById({ _id: id });
    try {
      if (categorydata) {
        res.render("editcategory", { category: categorydata });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  // update category
  const categoryUpdate = async (req, res) => {
    try {
    const cata = req.body.category
    const categoryData = await category.find()
    const catadata = await category.findOne({category:cata})
    if(catadata){
  res.render('editcategory',{category:categoryData,message:'This category is already present'})
    }else{
      await category.findByIdAndUpdate({_id:req.query.id},{$set:{category:cata}})
      res.redirect('/admin/Categories')
    }
  
    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  // To block category
  const categoryBlock = async (req, res) => {
    const id = req.query.id;
  
    const categorydata = await category.findById({ _id: id });
    const data = req.query.datas;
    try {
      if (data) {
        await category.updateOne({ _id: id }, { $set: { is_block: 0 } });
        res.redirect("/admin/Categories");
      } else {
        await category.updateOne({ _id: id }, { $set: { is_block: 1 } });
        res.redirect("/admin/Categories");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  module.exports={
  showCategories,
  addCategory,
  postCategory,
  categoryEdit,
  categoryUpdate,
  categoryBlock

  }