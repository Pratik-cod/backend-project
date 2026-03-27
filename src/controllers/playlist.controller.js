import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { user } from "../models/User.model.js";
import { video } from "../models/video.model.js";
import { playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async(req,res) => {
    const {userId} = req.params
    const {description , name} = req.body

    if(!userId){
        throw new ApiError(400,"unauthorized User")
    }
  if([description , name].some((filed) =>
     filed?.trim() === "")
   ){
    throw new ApiError(401,"All field required")
   }
   const creationPlaylist = await playlist.create({
    owner:userId,
    description,
    name
   })

   if(!creationPlaylist){
    throw new ApiError(402,"creation of playlist is failed")
   }

})

