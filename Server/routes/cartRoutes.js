const express=require("express")
const router=express.Router()
const Product=require("../models/Product")
const Cart = require("../models/Cart")
const { protectRoute } = require("../middleware/authMiddleware")



//Helper function to get a cart by userId or guest Id
const getCart=async(userId,guestId)=>{
    if(userId){
        return await Cart.findOne({user:userId})
    }else if(guestId){
        return await Cart.findOne({guestId})
    }
    return null;
}

//@route Post /api/cart
//@desc Add a product to the cart for a guest or logged in user
//@access Public
router.post("/",async(req,res)=>{
    const {productId,quantity,size,color,guestId,userId}=req.body;
    try {
        const product=await Product.findById(productId)
        if(!product)return res.status(401).json({message:"Product not found"})
        
        let cart=await getCart(userId,guestId)    
        if(cart){
            const productIndex=cart.products.findIndex(
                (p)=>p.productId.toString()==productId.toString() &&p.size==size &&p.color==color
            )

            if(productIndex>-1){
                //if the product already exists,update the quantity
                cart.products[productIndex].quantity+=quantity
            }else{
                //add new product
                cart.products.push({
                    productId,
                    name:product.name,
                    image:product.images[0].url,
                    price:product.price,
                    size,color,quantity

                })
            }

            //Recalculate total Price
        cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.price*item.quantity,0)

        await cart.save()
        return res.status(200).json(cart)
        }else{
            //create a new cart for guest or user
            const newCart=await Cart.create({
                user:userId?userId:undefined,
                guestId:guestId?guestId:"guest_"+new Date().getTime(),
                products:[
                    {
                        productId,
                        name:product.name,
                        image:product.images[0].url,
                        price:product.price,
                        size,
                        color,
                        quantity
                    }
                ],
                totalPrice:product.price*quantity


            })
 return res.status(200).json(newCart)
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({message:error.message})
    }

})


//update the product quantity
router.put("/",protectRoute,async(req,res)=>{
    const {productId,quantity,size,color,guestId,userId}=req.body;
    try {
        let cart=await getCart(userId,guestId)
        if(!cart)return res.status(404).json({message:"Cart not found"});
         
        const productIndex=cart.products.findIndex((p)=>p.productId.toString()==productId && p.size==size && p.color==color)

        if(productIndex>-1){
            //Update Quantity
            if(quantity>0){
            cart.products[productIndex].quantity=quantity;

            }else{
                cart.products.splice(productIndex,1)

            }
            cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.price*item.quantity,0)
            await cart.save()
            return res.status(200).json(cart)
        }else{
                 return res.status(404).json({message:"Product not found in cart"})
        }




    } catch (error) {
        console.error(error)
        return res.status(500).json({message:error.message})
        
    }

})

//Delete the product from cart
router.delete("/",protectRoute,async(req,res)=>{
const {productId,size,color,guestId,userId}=req.body;
try {
    
    let cart=await getCart(userId,guestId)
    if(!cart)return res.status(404).json({message:"Cart not found"});
    const productIndex=cart.products.findIndex((p)=>p.productId.toString()==productId && p.size==size && p.color==color)

    if(productIndex>-1){
        cart.products.splice(productIndex,1);
        cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.price*item.quantity,0);
        await cart.save();
        return res.status(200).json(cart)

    }else{
        return res.status(404).json({message:"Product not found"})
      }

} catch (error) {
        console.error(error)
        return res.status(500).json({message:error.message})
        
    }



})

//@route GET /api/cart
//@desc GET logged-in user's or guest user's cart
//@access Public

router.get("/",protectRoute,async(req,res)=>{

    const {guestId,userId}=req.query;
    try {
        let cart=await getCart(userId,guestId)
        if(!cart)return res.status(404).json({message:"Cart not found"});
         res.json(cart)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:error.message})
        
    }

})



//Merge cart does not loose any information
//@desc Merge guest cart into user cart on login
router.post("/merge",protectRoute,async(req,res)=>{
    const {guestId}=req.body;
    console.log(req.user)

    try {
        const guestCart=await Cart.findOne({guestId})
        const userCart=await Cart.findOne({user:req.user._id})

        if(guestCart){
            if(guestCart.products.length==0){
                return res.status(400).json({message:"Guest cart is empty"})
            }
            if(userCart){
                //merge guest cart into usercart
                guestCart.products.forEach((guestItem)=>{
                    const productIndex=userCart.products.findIndex((item)=>item.productId.toString()==guestItem.productId.toString() &&
                    item.size==guestItem.size && item.color==guestItem.color
                )
                            if(productIndex>-1){
                    //if the item exists in the user cart ,update the quantity
                    userCart.products[productIndex].quantity+=guestItem.quantity;

                }else{
                    userCart.products.push(guestItem)
                }
                })

                userCart.totalPrice=userCart.products.reduce((acc,item)=>acc+item.price*item.quantity,0)

                await userCart.save()

                //remove the guest cart after removing
                try {
                    await Cart.findOneAndDelete({guestId})

                } catch (error) {
                    console.error(error.message)

                }
                res.status(200).json(userCart)

    

            }else{
                //If the user has no existing cart,assign the guest cart to the user
                guestCart.user=req.user._id;
                guestCart.guestId=undefined
                await guestCart.save()
                res.status(200).json(guestCart)

            }
        }else{
            if(userCart){
                return res.status(200).json(userCart)
            }
            res.status(404).json({message:"Guest cart not found"})

        }


    } catch (error) {
        console.error(error)
              res.status(500).json({message:"Server Error"})
        
    }

})











module.exports=router