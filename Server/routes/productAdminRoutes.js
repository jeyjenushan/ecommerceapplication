const express=require("express")
const Product=require("../models/Product")
const { protectRoute, adminRoute } = require("../middleware/authMiddleware")
const router=express.Router()


//Get All products
router.get("/products",protectRoute,adminRoute,async(req,res)=>{
    try {
        const products=await Product.find({})
        res.json(products)


    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
    }
})





//update Product
router.put("/products/:id",protectRoute,adminRoute,async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id)
        if(product){
      
        }
        const updatedProduct=await product.save();
             res.status(200).json({message:`Product updated successfully`,user:updatedUser})



    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
    }
})


//delete User
router.delete("/products/:id",protectRoute,adminRoute,async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id)
        if(product){
            await product.deleteOne()
            res.json({message:"Product deleted successfully"})
        }else{
            res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
    }
})







module.exports=router