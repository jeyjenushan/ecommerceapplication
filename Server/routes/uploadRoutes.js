const express=require("express")
const multer=require("multer")
const cloudinary=require("cloudinary").v2
const streamifier=require("streamifier")

const router=express.Router()

require("dotenv").config()


//Cloudinary Configuration
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

//multer setup using memory storage

//tell the multer to store the uploaded files directly in the ramas buffer objects

const storage=multer.memoryStorage()
const upload=multer({storage})



router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Validate file type if needed
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: "Invalid file type" });
        }

        // Function to handle the stream upload to cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto' }, // auto-detect resource type
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                
                // Use streamifier to convert file buffer to a stream
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        const result = await streamUpload(req.file.buffer);
        res.status(201).json({ 
            message: "File uploaded successfully",
            imageUrl: result.secure_url 
        });
        
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ 
            message: "File upload failed",
            error: error.message 
        });
    }
});

module.exports=router