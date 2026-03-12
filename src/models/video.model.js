import mongoose from "mongoose";
import mongooseaggregatepaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new mongoose.Schema({
videoFile:{
    type:String,
    required:true
},
thumbnail:{
    type:String,
    required:true
},
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
duration:{
    type:Number,
    required:true
},
views:{
    type:Number,
    default:0
},
isPublished:{
    type:Boolean,
    default:0
},
owner:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
]
},{timestamps:true})

videoSchema.plugin(mongooseaggregatepaginate)

export const video = mongoose.model("video",videoSchema)