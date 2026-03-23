import {v2 as cloudinary} from 'cloudinary'
import { ApiError } from '../utils/apiError'

const videoUploader = async (videoPath) => {
  cloudinary.config({
    cloud_name:process.env.CLOUDINARY_API_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
if(!videoPath){
    throw new ApiError(400,"video is required")
}

const responce = await cloudinary.uploader.upload(videoPath,{
    resource_type:"auto"
})
return responce
}

export {videoUploader}