import { v2 as cloudinary } from "cloudinary";

const deleteCloudinary = (oldPath) => {
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_API_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_KEY
    })

if(!oldPath) return null

try {
    const responce = cloudinary.uploader.destroy(oldPath,{
        resource_type:"auto"
    })
    
} catch (error) {
    console.log("cloudinary delete failed",error);
    
}
}

export {deleteCloudinary}