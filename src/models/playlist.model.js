import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"video"
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})

const playlist = mongoose.model("playlist",playlistSchema)