import { v2 as cloudinary } from "cloudinary";

const deleteCloudinary = async (oldPath) => {
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_API_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    })

if(!oldPath) return null

try {
    const responce = await cloudinary.uploader.destroy(oldPath,{
        resource_type:"auto"
    })

    return responce
    
} catch (error) {
    console.log("cloudinary delete failed",error);
    
}
}

export {deleteCloudinary}