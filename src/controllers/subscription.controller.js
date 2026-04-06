import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponce } from "../utils/apiResponce.js";
import { subscription } from "../models/subsciption.model.js";
import mongoose from "mongoose";
import { user as User } from "../models/User.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!channelId) throw new ApiError(400, "channelId is required");
  if (!subscriberId) throw new ApiError(400, "subscriber id not found");

  const findChannel = await User.findById(channelId);
  if (!findChannel) throw new ApiError(404, "Channel user not found");

  const existing = await subscription.findOne({
    subscriber: subscriberId,
    channel: channelId
  });

  if (existing) {
    await subscription.deleteOne({ subscriber: subscriberId, channel: channelId });
    return res.status(200).json(new ApiResponce(200, null, "Unsubscribed successfully"));
  } else {
    const newSub = await subscription.create({ subscriber: subscriberId, channel: channelId });
    return res.status(200).json(new ApiResponce(200, newSub, "Subscribed successfully"));
  }
});

const getUserChannelsubscibers = asyncHandler(async(req,res) => {
    const {channelId} = req.params
    let {page = 1,limit = 10} = req.query
    
page = parseInt(page)
limit = parseInt(limit)

  const subscribers = await subscription.aggregate([
    
{$match:{
    channel: new mongoose.Types.ObjectId(channelId)
}},

 {$skip:(page -1)*limit},
{$limit:limit},

    {
        $lookup:{
            from:"users",
            localField:"subscriber",
            foreignField:"_id",
            as:"userdetail"
        }   
    },
    {
        $unwind:"$userdetail"
    },
   
    {
        $project:{
            _id:0,
            id:"$userdetail._id",
            email:"$userdetail.email",
            name:"$userdetail.username"
        }
    }

  ])
  res.status(200).json(new ApiResponce(200,subscribers,"subscribers are here"))
})

const getSubscribedChannels = asyncHandler(async (req, res) => {

    const { subscriberId } = req.params
    let {page = 1,limit = 10} = req.query
  
    page = parseInt(page)
    limit = parseInt(limit)

    const getsubsciber = await subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $skip:(page - 1)*limit
        },
        {
            $limit:limit
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channeldetail"
            }
        },
        {$unwind:"$channeldetail"},
        {
            $project:{
                 _id: 0,
                channelId: "$channeldetail._id",
                name: "$channeldetail.username",
                email: "$channeldetail.email"
            }
        }
    ])
    res.status(200).json(new ApiResponce(200,getsubsciber,"get subscribedChannels successfully"))
})

export {
    toggleSubscription,getSubscribedChannels,getUserChannelsubscibers
}