const express=require("express")
const User=require("../models/User")
const jwt=require("jsonwebtoken")
const { protectRoute } = require("../middleware/authMiddleware")
const router=express.Router()


//Register a person
router.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        let user=await User.findOne({email})
        if(user) return res.status(400).json({message:"User already exists"})
        
        user=new User({name,email,password})
        await user.save()

        //Create JWT Payload
        const payload={user:{id:user._id,role:user.role}}

        //Sign and return the token along with user data
        //generate token
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: "40h" },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                });
            }
        );

        
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

//login a person
router.post("/login",async(req,res)=>{

    const {email,password}=req.body
    try {
        
        let user=await User.findOne({email})
        if(!user)return res.status(400).json({message:"Invalid credintails"})
        
        const isMatch=await user.matchPassword(password);
        if(!isMatch)return res.status(400).json({message:"Invalid credintails"})
       
        const payload={user:{id:user._id,role:user.role}}
        jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"40h"},(err,token)=>{ 
            if(err)throw err;
            res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                });



        })

        
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }

})

//UserProfile get
router.get("/profile",protectRoute,async(req,res)=>{
    console.log(req.user)


})


module.exports=router;