const express=require("express")
const Product=require("../models/Product");
const { protectRoute, adminRoute } = require("../middleware/authMiddleware");
const router=express.Router()


router.post("/",protectRoute,adminRoute,async(req,res)=>{
    try {
        const{name,description,price,discountPrice,countInStock,category,brand,sizes,colors,collections,
            material,gender,images,isFeatured,isPublished,tags,
            dimensions,weight,sku
        }=req.body

        const product=new Product({name,description,price,discountPrice,countInStock,category,brand,sizes,colors,collections,
            material,gender,images,isFeatured,isPublished,tags,
            dimensions,weight,sku,user:req.user._id //Reference to admin
        })

        const createdProduct=await product.save()
        res.status(201).json(createdProduct)
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
        
    }
})


router.put("/:id",protectRoute,adminRoute,async(req,res)=>{
try {
            const{name,description,price,discountPrice,countInStock,category,brand,sizes,colors,collections,
            material,gender,images,isFeatured,isPublished,tags,
            dimensions,weight,sku
        }=req.body
        const product=await Product.findById(req.params.id);
        if(product){
          product.name = name || product.name;
         product.description = description || product.description;
          product.price = price || product.price;
product.discountPrice = discountPrice || product.discountPrice;
product.countInStock = countInStock || product.countInStock;
product.category = category || product.category;
product.brand = brand || product.brand;
product.sizes = sizes || product.sizes;
product.colors = colors || product.colors;
product.collections = collections || product.collections;
product.material = material || product.material;
product.gender = gender || product.gender;
product.images = images || product.images;
product.isFeatured = isFeatured!==undefined ? isFeatured: product.isFeatured;
product.isPublished = isPublished!==undefined ? isPublished: product.isPublished;
product.tags = tags || product.tags;
product.dimensions = dimensions || product.dimensions;
product.weight = weight || product.weight;
product.sku = sku || product.sku;



//save the updated product
const updatedProduct=await product.save()
res.json(updatedProduct)
        }
        else{
          res.status(400).json({message:"Product not found"})  
        }
    
} catch (error) {
    console.log(error)
    res.status(400).json({message:"Server Error"})
}
})


router.delete("/:id",protectRoute,adminRoute,async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id)
        if(product){
            await product.deleteOne()
            res.status(200).json({message:"The product deleted successfully"})
        }else{
              res.status(404).json({message:"The product not found"})
        }
        
    } catch (error) {
        console.error(error)
             res.status(404).json({message:"Internal Server Error"})

    }
})


//Get All Products with optional query filters
router.get("/",async(req,res)=>{
    try {
        const {collections,size,color,gender,minPrice,maxPrice,sortBy,
            search,category,material,brand,limit
        }=req.query;

        let query={}

        //Filter Logic
        if(collections && collections.toLocaleLowerCase()!=="all"){
            query.collections=collections;
        }
        if(category && category.toLocaleLowerCase()!=="all"){
            query.category=category;
        }
        if(brand){
            query.brand={$in: brand.split(",")}
        }
        if(size){
            query.size={$in: size.split(",")}
        }
        if(color){
            query.color={$in: [color]}
        }
        if(gender){
            query.gender=gender;
        }
        if(minPrice || maxPrice){
            query.price={}
            if(minPrice)query.price.$gte=Number(minPrice);
            if(maxPrice)query.price.$lte=Number(maxPrice)
        }
    if(search){
        query.$or=[
            {name:{$regex:search,$options:"i"}},
             {description:{$regex:search,$options:"i"}},
        ]
    }

    let sort={}
    if(sortBy){
        switch(sortBy){
            case "priceAsc":
                sort={price:1};
                break;
            case "priceDesc":
                sort={price:-1};
                break;
            case "popularity":
                sort={rating:-1};
            default:
                break;

        }
    }
    //fetch products and apply sorting and limit
let products=await Product.find(query)
                .sort(sort) 
             .limit(Number(limit)|| 0);


res.json(products)




    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Some error in your code please correct them"})
        
    }
})


//new arrivals
//retrieve latest products
router.get("/new-arrivals",async(req,res)=>{
    try {
        const newArrivals=await Product.find().sort({createdAt:-1}).limit(8)
        res.status(200).json(newArrivals)
    } catch (error) {
                console.error(error)
        res.status(500).json({message:"Server Error"})
    }
})


// @route GET /api/products/best seller
// @desc  Retrieve the producct with highest rating
// @access public
router.get("/best-seller",async(req,res)=>{
    try {
        const bestSeller=await Product.findOne().sort({rating:-1})
        if(bestSeller){
            res.json(bestSeller)
        }else{
            res.status(404).json({message:"No best seller found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
})



router.get("/:id",async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(product){
            res.json(product)
        }else{
            res.status(400).json({message:"Product Not found"})
        }

    } catch (error) {
        console.error(error.message)
         res.status(500).json({message:error.message})
        
    }
})



//similar products we get
router.get("/similar/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        const similarProducts=await Product.find({
            _id:{$ne:id},
            gender:product.gender,
            category:product.category
        }).limit(4)
        res.json(similarProducts)


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})








module.exports=router;