const express=require("express")
const Checkout=require("../models/Checkout")
const Cart=require("../models/Cart")
const Product=require("../models/Product")
const Order=require("../models/Order")
const { protectRoute } = require("../middleware/authMiddleware")
const router=express.Router()

// @route POST /api/checkout
// @desc Create a new checkout session
// @access private
router.post("/",protectRoute,async(req,res)=>{
    const {checkoutItems,shippingAddress,paymentMethod,totalPrice}=
    req.body

    if(!checkoutItems || checkoutItems.length==0){
        return res.status(400).json({message:"No Items in Checkout"})
    }
    
    try {
        //Create a new checkout session
        const newCheckout=await Checkout.create({
            User:req.user._id,
            checkoutItems:checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            isPaid:false,
            paymentStatus:"Pending"
        })
        res.status(201).json(newCheckout)


    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
        
    }


})

// @route PUT /api/checkout/:id/pay
// @desc update checkout to mark as paid after successfull payment
// @access private
router.put("/:id/pay",protectRoute,async(req,res)=>{
    const {paymentStatus,paymentDetails}=req.body


    
    try {
 
        const checkout=await Checkout.findById(req.params.id)
        if(!checkout){
            return res.status(404).json({message:"Checkout not found"})
        }

        if(paymentStatus=="paid"){
            checkout.isPaid=true;
            checkout.paymentStatus=paymentStatus;
            checkout.paymentDetails=paymentDetails;
            checkout.paidAt=Date.now()
            await checkout.save();
            res.status(200).json(checkout)
        }else{
           res.status(400).json({message:"Invalid Payment Status"}) 
        }



    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
        
    }


})


// @route POST /api/checkout/:id/finalize
// @desc finalize checkout and convert to an order after payment confirmation

router.post("/:id/finalize",protectRoute,async(req,res)=>{
    try {
        const checkout=await Checkout.findById(req.params.id)
        if(!checkout){
            return res.status(404).json({message:"Checkout not found"})
        }
        if(checkout.isPaid && !checkout.isFinalized){
            //create final order based on the checkout details
            const finalOrder=await Order.create({
                User:checkout.User,
                orderItems:checkout.checkoutItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:"paid",
                paymentDetails:checkout.paymentDetails
            })
            checkout.isFinalized=true
            checkout.finalizedaAt=Date.now()
            await checkout.save()
         //Delete the cart associated with the user
         await Cart.findOneAndDelete({user:checkout.user})
         res.status(201).json(finalOrder)

        }else if(checkout.isFinalized){
            res.status(400).json({message:"Checkout already finalized"})
        }else{
             res.status(400).json({message:"Checkout is not paid"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
    }
})





module.exports=router