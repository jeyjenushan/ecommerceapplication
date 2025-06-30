const express=require("express")
const Order=require("../models/Order");
const { protectRoute } = require("../middleware/authMiddleware");
const router=express.Router()


router.get("/my-orders",protectRoute,async(req,res)=>{
    try {
        const orders=await Order.find({User:req.user._id}).sort({createdAt:-1})
        res.json(orders)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
        
    }
})


router.get("/:id",protectRoute,async(req,res)=>{
    const {id}=req.params;
    try {
        const order=await Order.findById(req.params.id).populate("User","name email")

        if(!order){
            return  res.status(404).json({message:"Order not found"})
        }

        res.json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
        
    }
})


module.exports=router;