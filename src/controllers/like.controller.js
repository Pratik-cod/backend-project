import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { like } from "../models/like.model.js";
import { user } from "../models/User.model.js";
import { video } from "../models/video.model.js";
import {Comment} from "../models/comments.model.js"
import {tweet} from '../models/tweet.model.js'

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId, userId } = req.params;

    // validate input
    if (!videoId) {
        throw new ApiError(400, "videoId is required");
    }

    if (!userId) {
        throw new ApiError(400, "userId is required");
    }

    // check user exists
    const findUser = await user.findById(userId);
    if (!findUser) {
        throw new ApiError(404, "User not found");
    }

    // check video exists
    const findVideo = await video.findById(videoId);
    if (!findVideo) {
        throw new ApiError(404, "Video not found");
    }

    // check like exists
    const existingLike = await like.findOne({
        videoId,
        userId
    });

    if (existingLike) {
        // unlike
        await like.deleteOne({ userId, videoId });

        return res.status(200).json({
            message: "Video unliked"
        });
    } else {
        // like
        await like.create({ userId, videoId });

        return res.status(200).json({
            message: "Video liked"
        });
    }
});

const commentLikeToggle = asyncHandler(async (req,res) => {
    const {commentId,userId} = req.params

    if(!commentId){
        throw new ApiError(401," commentId is required")
    }
    if(!userId){
        throw new ApiError(400,"unauthorized user")
    }

    const findcomment = await Comment.findById(commentId)

    if(!findcomment){
        throw new ApiError(402,"comment is not found")
    }
    const findUser = await user.findById(userId)

    if(!findUser){
        throw new ApiError(402,"user not found")
    }

    const existingcommentLike = await like.findOne({
        userId,
        commentId
    })
    if(existingcommentLike){
        await like.deleteOne({userId,commentId})
    }
    else{
        await like.create({
            userId,commentId
        })
    }
})

const TweetLiketoggle = asyncHandler(async (req,res) => {
    const {tweetId,userId} = req.params

    if(!tweetId){
        throw new ApiError(404,"tweetId is required")
    }
    if(!userId){
        throw new ApiError(401,"unauthorized user")
    }
    const findtweet = await tweet.findById(tweetId)
    if(!findtweet){
        throw new ApiError(404,"tweet is not found")
    }
    const findUser = await user.findById(userId)
    if(!findUser){
        throw new ApiError(404,"user is not found")
    }

    const existingTweetLike = await tweet.findOne({
        tweetId,
        userId
    })
    if(existingTweetLike){
   await tweet.deleteOne({
      userId,
      tweetId
   })
    }else{
        await tweet.create({
            tweetId,
            userId
        })
    }
})

export { toggleVideoLike,commentLikeToggle,TweetLiketoggle };

