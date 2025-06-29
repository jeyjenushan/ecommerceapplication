const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const connectDB=require("./config/db")


const app=express()
app.use(express.json())
app.use(cors())

dotenv.config()
const PORT=process.env.PORT

//Connect to MongoDb
connectDB()

app.listen(PORT,(req,res)=>{
    console.log(`The server is running port number on ${PORT}`)
})

