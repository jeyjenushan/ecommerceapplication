const mongoose=require("mongoose")

const orderItemSchema=new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    size:String,
    color:String,
    quantity:{
        type:Number,
        required:true
    }
},
{_id:false}
)

const orderSchema=new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    orderItems:[orderItemSchema],
    shippingAddress:{
        address:{type:String,required:true},
        city:{type:String,required:true},
        postalCode:{type:String,required:true},
        country:{type:String,required:true},
    },
    paymentMethod:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:{
        type:Date
    },

    paymentStatus:{
        type:String,
        default:"pending"

    },
    status:{
         type:String,
        enum:["Processing","Shipped","Delivered","Cancelled"],
        default:"Processing"

    },
    isDelivered:{
        type:Boolean,
        default:false
    },
    deliveredaAt:{
        type:Date
    }

},
{timestamps:true}
)

module.exports=mongoose.model("Order",orderSchema)