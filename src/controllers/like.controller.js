import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { like } from "../models/like.model.js";
import { user } from "../models/User.model.js";
import { video } from "../models/video.model.js";
import {Comment} from "../models/comments.model.js"
import {tweet} from '../models/tweet.model.js'
import { ApiResponce } from "../utils/apiResponce.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId) throw new ApiError(400, "videoId is required");
  if (!userId) throw new ApiError(400, "userId is required");

  // check user exists
  const findUser = await user.findById(userId);
  if (!findUser) throw new ApiError(404, "User not found");

  // check video exists
  const findVideo = await video.findById(videoId);
  if (!findVideo) throw new ApiError(404, "Video not found");

  // check like exists
  const existingLike = await like.findOne({ video: videoId, likeby: userId });

  if (existingLike) {
    // unlike
    await like.deleteOne({ video: videoId, likeby: userId });
     return res
      .status(200)
      .json(new ApiResponce(200, "Video unliked", null, true));

  }

  // like
  const newLike = await like.create({ video: videoId, likeby: userId });
    return res
    .status(200)
    .json(new ApiResponce(200, "Video liked successfully", newLike, true));

});

const commentLikeToggle = asyncHandler(async (req,res) => {
    const {commentId} = req.params
    const userId = req.user._id

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
             return res
      .status(200)
      .json(new ApiResponce(200, "Comment unliked", null, true));
    }

 const newLike = await like.create({ userId, commentId });
    return res
    .status(200)
    .json(new ApiResponce(200, "Comment liked successfully", newLike, true));

})

const TweetLiketoggle = asyncHandler(async (req,res) => {
    const {tweetId} = req.params
const userId = req.user._id

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
   console.log(tweetId,userId);
   
    const existingTweetLike = await like.findOne({
       tweet: tweetId, likeby: userId
    })
    if(existingTweetLike){
   await like.deleteOne({
      userId,
      tweetId
   })
    .json(new ApiResponce(200, "Comment unliked", null, true));
    }
     const newLike = await like.create({
            tweetId,
            userId
        })
    
     return res
    .status(200)
    .json(new ApiResponce(200, "Tweet liked successfully", newLike, true));
})


export { toggleVideoLike,commentLikeToggle,TweetLiketoggle,getLikeVideo };

