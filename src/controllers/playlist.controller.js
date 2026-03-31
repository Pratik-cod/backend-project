import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {playlist as Playlist } from "../models/playlist.model.js";
import { ApiResponce } from "../utils/apiResponce.js";

const createPlaylist = asyncHandler(async(req,res) => {
    const userId = req.user._id;
    const {description , name} = req.body

    if(!userId){
        throw new ApiError(400,"unauthorized User")
    }
  if([description , name].some((filed) =>
     filed?.trim() === "")
   ){
    throw new ApiError(401,"All field required")
   }
   const creationPlaylist = await Playlist.create({
    owner:userId,
    description,
    name
   })

   if(!creationPlaylist){
    throw new ApiError(402,"creation of playlist is failed")
   }
   res.status(200).json(new ApiResponce(200,createPlaylist,"Playlsit created successfully"))

})

 const getPlaylistByIdUser = asyncHandler(async(req,res) => {
  const userId = req.user._id

  if(!userId){
    throw new ApiError(401,"unauthorized")
  }

  const findUserplaylist = await Playlist.find({owner:userId})

  if(!findUserplaylist){
    throw new ApiError(404,"playlist not found in user")
  }
  res.status(200).json(new ApiResponce(200,findUserplaylist,"playlist is get by user"))
})

const getplaylistId = asyncHandler(async(req,res) => {
    const {playlistId} = req.params

    if(!playlistId){
  throw new ApiError(402,"playlist not found")
    }

   const getPlaylist = await Playlistlaylist.findById(playlistId)

    if(!getPlaylist){
        throw new ApiError(404,"playlist not found")
    }
    res.status(200).json(new ApiResponce(200,getPlaylist,"playlist is found"))
})
const addvideoAtPlaylist = asyncHandler(async(req,res) => {
    const {playlistId,videoId} = req.params
    // const {video} = req.body

    if(!playlistId){
        throw new ApiError(401,"playlist is not found")
    }
    if(!videoId){
         throw new ApiError(401,"video is not found")
    }
console.log(videoId,playlistId);

   const addingvideo = await Playlist.findByIdAndUpdate(playlistId,
    {
      $push:{videos:videoId}
    },
    {
        new:true
    }
   )
    if(!addingvideo){
        throw new ApiError(403,"video adding failed")
    }

    res.status(200).json(new ApiResponce(200,addingvideo,"add video successfully"))
})

const removePlaylistVideo = asyncHandler(async(req,res) => {
    const {playlistId,videoId} = req.params

     if(!playlistId){
        throw new ApiError(401,"playlist is not found")
    }
    if(!videoId){
         throw new ApiError(401,"video is not found")
    }
    console.log(playlistId,videoId);
    
   const removevideo = await Playlist.findByIdAndUpdate(playlistId,
    {
     $pull:{videos:videoId}
    },
    {
        new:true
    }
   )
   if(!removevideo){
    throw new ApiError(402,"video remove failed")
   }
   res.status(200).json(new ApiResponce(200,removevideo,"video remove successfully"))
})

const deletePlaylist = asyncHandler(async(req,res) => {
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(402,"playlist not found")
    }
    const deleteplaylist = await Playlist.findByIdAndDelete(
    playlistId
    )

    if(!deleteplaylist){
        throw new ApiError(402,"playlist delete failed")
    }
    res.status(200).json(new ApiResponce(200,deleteplaylist,"playlist remove successful"))
})
const updatePlaylit = asyncHandler(async(req,res) => {
    const {playlistId} = req.params
    const {name,description} = req.body

    if(!playlistId){
        throw new ApiError(400,"playlist not found")
    }
    if(!name || !description){
        throw new ApiError(400,"name and description not found")
    }
    const updateplaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
          name,
          description
        },
        {
            new:true
        }
    )
    if(!updateplaylist){
        throw new ApiError(404,"updating failed")
    }
    res.status(200).json(new ApiResponce(200,updateplaylist,"playlist is update successfully"))
})


export {
    createPlaylist,getPlaylistByIdUser,getplaylistId,addvideoAtPlaylist,updatePlaylit,removePlaylistVideo,deletePlaylist
}

