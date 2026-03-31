import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponce } from "../utils/apiResponce.js";
import { subscription } from "../models/subsciption.model.js";

const toggleSubscription = asyncHandler(async(req,res) => {
    const {channelId} = req.params
    const UserId  = req.user._id

    if(!channelId){
        throw new ApiError(400,"channelId is required")
    }
    if(!UserId){
        throw new ApiError(400,"unauthorized")
    }

    const findChannel = await subscription.findById(channelId)

    if(!findChannel){
        throw new ApiError(400,"not found  channelId")
    }
    const existingsubsciber = await subscription.findOne({
        UserId,
        channelId
    })
    if(existingsubsciber){
        await subscription.deleteOne({
            UserId,
            channelId
        })
    }else{
        await subscription.create({
            UserId,
            channelId
        })
    }
res.status(200).json(new ApiResponce(200,existingsubsciber,"user are subscribe"))
})



export {
    toggleSubscription,getSubscribedChannels,getUserChannelsubscibers
}