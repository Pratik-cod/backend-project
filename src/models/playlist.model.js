import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
     videos: [   // <-- make this an array
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "video"
    }
  ],

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})

 export const playlist = mongoose.model("playlist",playlistSchema)