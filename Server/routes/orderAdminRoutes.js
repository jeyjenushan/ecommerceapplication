const express=require("express")
const Order=require("../models/Order")
const { protectRoute, adminRoute } = require("../middleware/authMiddleware")
const router=express.Router()


//Get All orders
router.get("/orders",protectRoute,adminRoute,async(req,res)=>{
    try {
        const orders=await Order.find({}).populate("User","name email")
        res.json(orders)


    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
    }
})





//update Product
router.put("/orders/:id",protectRoute,adminRoute,async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id)
        if(order){
           order.status=req.body.status || order.status;
           order.isDelivered=req.body.status == "Delivered"? true:order.isDelivered
            order.deliveredaAt=req.body.status == "Delivered"? Date.now():order.deliveredaAt

                    const updatedOrder=await order.save();
             res.status(200).json({message:`Product updated successfully`,order:updatedOrder})
        }else{
            res.status(400).json({message:"Order not found"})
        }




    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
    }
})


//delete User
router.delete("/orders/:id",protectRoute,adminRoute,async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id)
        if(order){
            await order.deleteOne()
            res.json({message:"Order deleted successfully"})
        }else{
            res.status(404).json({message:"Order not found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
    }
})







module.exports=router