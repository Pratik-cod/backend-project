import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"video"
    },
    likeby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    tweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tweet"
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    },
},{timestamps:true})

export const like = mongoose.model("like",likeSchema)