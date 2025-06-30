const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const connectDB=require("./config/db")
const userRoutes=require("./routes/userRoutes")
const productRoutes=require("./routes/productRoutes")
const cartRoutes=require("./routes/cartRoutes")
const checkoutRoutes=require("./routes/checkoutRoutes")
const orderRoutes=require("./routes/orderRoutes")
const uploadRoutes=require("./routes/uploadRoutes")
const subscribeRoutes=require("./routes/subscriberRoutes")

const app=express()
app.use(express.json())
app.use(cors())

dotenv.config()
const PORT=process.env.PORT

//Connect to MongoDb
connectDB()

//API Routes Here
app.use("/api/users",userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/checkout",checkoutRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/upload",uploadRoutes)
app.use("/api/subscribe",subscribeRoutes)


app.listen(PORT,()=>{
    console.log(`The server is running port number on ${PORT}`)
})

