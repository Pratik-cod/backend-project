import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponce } from "../utils/apiResponce.js";
import { tweet } from "../models/tweet.model.js";

const createTweet = asyncHandler(async(req,res) => {
    const {content} = req.body
    const UserId = req.user._id

    if(!content){
        throw new ApiError(400,"tweet is required")
    }
    if(!UserId){
        throw new ApiError(400,"unautiorized")
    }

    const creationTweet = await tweet.create({
        owner:UserId,
        content:content
    })
    if(!creationTweet){
        throw new ApiError(400,"creation of tweet is failed")
    }
    res.status(200).json(new ApiResponce(200,createTweet,"Tweet creation successfully"))
})

const getUserTweet = asyncHandler(async(req,res) => {
    const userId = req.user._id

    if(!userId){
        throw new ApiError(400,"unauthorized")
    }

    const UserTweet = await tweet.find({owner:userId})

    if(!UserTweet){
   throw new ApiError(400,"User tweets are not found ")
    }
    res.status(200).json(new ApiResponce(200,UserTweet,"User tweets are found"))

})

const UpdateTweet = asyncHandler(async(req,res) => {
    const {tweetId} = req.params 
    const {content} = req.body

    if(!tweetId){
        throw new ApiError(400,"tweetId is required")
    }
    if(!content || !content.trim()){
        throw new ApiError(400,"content is required")
    }
    const updatingTweet = await tweet.findByIdAndUpdate(tweetId,
        {
            content:content
        },
        {
            new:true
        }
    )
    if(!updatingTweet){
        throw new ApiError(400,"updating tweet is failed")
    }

    res.status(200).json(new ApiResponce(200,updatingTweet," tweets update successful"))

})

const deleteTweet = asyncHandler(async(req,res) => {
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400,"tweet id not found")
    }

    const deletingTweet = await tweet.findByIdAndDelete(tweetId)

    if(!deletingTweet){
        throw new ApiError(400,"deleting tweet is failed")
    }
        res.status(200).json(new ApiResponce(200,deletingTweet," tweets update successful"))
})


export {
    createTweet,
    getUserTweet,
    UpdateTweet,
    deleteTweet
}

