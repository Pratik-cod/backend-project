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

export {
    toggleSubscription,getSubscribedChannels,getUserChannelsubscibers
}