const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const connectDB=require("./config/db")
const userRoutes=require("./routes/userRoutes")
const productRoutes=require("./routes/productRoutes")

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

app.listen(PORT,(req,res)=>{
    console.log(`The server is running port number on ${PORT}`)
})

