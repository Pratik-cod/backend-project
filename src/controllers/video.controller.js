import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponce } from "../utils/apiResponce";
import { ApiError } from "../utils/apiError";
import { uploadCloudinary } from "../service/cloudinary";
import {video} from '../models/video.model.js'
import { deleteCloudinary } from '../service/deleteCloundinary.js'

const getAllvideos = asyncHandler(async(req,res) => {

})

 const PublicedVideo = asyncHandler(async(req,res) => {

    const {title , description} = req.body

   const localPath = req.file?.video[0]?.path
   const thumbnailPath = req.file?.thumbnail[0]?.path

   if(!thumbnailPath){
    throw new ApiError(400,"file is required")
   }
   if(!localPath){
    throw new ApiError(400,"file is required")
   }
   const Videoupload = await uploadCloudinary(localPath)
   const thumbanailupload = await uploadCloudinary(thumbnailPath)

   if(!Videoupload.url){
    throw new ApiError(400,"uploading failed")
   }
   if(!thumbanailupload.url){
    throw new ApiError(400,"uploading failed")
   }
   const videoCreation = await video.create({
       title,
    description,
    videoFile: Videoupload.url,
    thumbnail: thumbanailupload.url,
    duration: Videoupload.duration,
    isPublished: true,
   })
   
   if(!videoCreation){
    throw new ApiError(400,"creating video failed")
   }

   res.status(201).json(new ApiResponce("video created successfully",videoCreation))
    })

    const getVideoId = asyncHandler(async(req,res) =>{
     const {videoId} = req.params

     const videolocation = await video.findById(videoId)
     if(!videolocation){
        throw new ApiError(404,"video not found")
     }
     res.status(200).json(new ApiResponce("video searching successfully",videolocation))
    })

const updateVideoInfo = asyncHandler(async (req,res) => {
    const {videoid} = req.params
    const {title,description} = req.body

    const updatelocalpath = req.file?.video[0]?.path
    const updatethumbnailPath = req.file?.thumbnail[0]?.path

    let updatedVideo,updatedThumbnail

    if(updatelocalpath){
updatedVideo = await uploadCloudinary(updatelocalpath)
    }

    if(updatelocalpath && !updatedVideo?.url){
    throw new ApiError(400,"video uploading failed")
}

    if(updatethumbnailPath){
        updatedThumbnail = await uploadCloudinary(updatethumbnailPath)
    }
    if(!updatedThumbnail){
        throw new ApiError(400,"thumbanil uploading failed")
    }
  const updatedAllInfo = await video.findByIdAndUpdate(videoid,
        {
          $set:{
            title,
            description,
            videoFile: updatedVideo?.url,
            thumbnail:updatedThumbnail.url
          }
        },
        {
            new:true
        }
    )
    if(!updatedAllInfo){
        throw new ApiError(400,"video info not updating failed")
    }
    res.status(200).json(new ApiResponce(200,updatedAllInfo,"video All info updating successfully"))
    })

    const deletevideo = asyncHandler(async(req,res) => {
        const {videoId} = req.params

        if(!videoId){
            throw new ApiError(400,"videoId is not found")
        }
       const videodeletion = await video.findByIdAndDelete(videoId)

       if(videodeletion){
        await deleteCloudinary(videodeletion.videoFile)
        await deleteCloudinary(videodeletion.thumbnail)
       }
       res.status(200).json(new ApiResponce(200,videodeletion,"video deleted successfully"))
    })

    const isPublishedStatus = asyncHandler(async(req,res) => {
    const {videoId} = req.params   
   const {isPublished} = req.body

   const publishedStattus = await video.findByIdAndUpdate(videoId,
    {
        $set:{
            isPublished:isPublished
        }
    },
    {
        new:true
    }

    
   )

})

export{getAllvideos, PublicedVideo,getVideoId,updateVideoInfo}