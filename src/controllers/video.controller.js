import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponce } from "../utils/apiResponce.js";
import { ApiError } from "../utils/apiError.js";
import { uploadCloudinary } from "../service/cloudinary.js";
import {video} from '../models/video.model.js'
import { deleteCloudinary } from '../service/deleteCloundinary.js'

const getAllvideos = asyncHandler(async(req,res) => {
 let { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

 page = parseInt(page)
 limit = parseInt(limit)

 const filter = {}

 if(userId){
    filter.userId = userId
 }
 if(query){
    filter.title = {$regex: query, $options: "i"}
 }

 const sortorder = sortType === "asc"?1:-1

 const getallvideo = await video.aggregate([
    {$match:filter},
    {$sort:{[sortBy]: sortorder}},
    {$skip:(page-1)*limit},
    {$limit:limit},
    {
        $project : {
            title:1,
            createdAt:1,
            likes:1
        }
    }
 ]);
 res.status(200).json(new ApiResponce(200,{
    count: getallvideo.length,
        videos: getallvideo},
        "video fetched succefully"
    ))
})

 const PublicedVideo = asyncHandler(async(req,res) => {

    const {title , description} = req.body

    const localPath = req.files?.videoFile?.[0]?.path;
  const thumbnailPath = req.files?.thumbnail?.[0]?.path;

   if(!thumbnailPath){
    throw new ApiError(400,"thumbnail file is required")
   }
   if(!localPath){
    throw new ApiError(400," video file is required")
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
     res.status(200).json(new ApiResponce(201,"video searching successfully",videolocation))
    })

const updateVideoInfo = asyncHandler(async (req,res) => {
    const {videoId} = req.params
    const {title,description} = req.body

    const updatelocalpath =  req.files?.videoFile?.[0]?.path;
    const updatethumbnailPath = req.files?.thumbnail?.[0]?.path;

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
  const updatedAllInfo = await video.findByIdAndUpdate(videoId,
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
res.status(200).json(new ApiResponce(200,publishedStattus,"status are published"))
})

export{getAllvideos, PublicedVideo,getVideoId,updateVideoInfo,deletevideo,isPublishedStatus}