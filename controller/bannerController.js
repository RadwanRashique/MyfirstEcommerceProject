const Banner = require('../model/bannerModel');

const loadAddBanner = async (req,res)=>{
    try{
        res.render('addbanner');
    }catch(error){
        console.log(error.message);
    }
}

const addBanner = async (req,res)=>{
    try{
         const heading1=req.body.header;
        
         
         const  description1=req.body.description;
         const image1=req.file.filename

             const data =new Banner({
                header:heading1,
                description:description1,
                image:image1
             })
              await data.save()
   res.redirect('/admin/listBanner')

        }
    catch(error){
        console.log(error.message);
    }
}

const listBanner = async (req,res)=>{
    try{
        const ban = await Banner.find({});
       
        
        res.render('listbanner',{ban});
    }catch(error){
        console.log(error.message);
    }
}



const deleteBanner=async  (req,res)=>
{
    try {
         const BannerId= req.query.id  
          await Banner.deleteOne({_id:BannerId})
          res.redirect("/admin/listBanner")

         
    } catch (error) {
          console.log(error.message)
    }
}


module.exports = {
    addBanner,
    loadAddBanner,
    listBanner,
    deleteBanner,
   
}