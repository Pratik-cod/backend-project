import mongoose from "mongoose";
import mongooseaggregatepaginate from 'mongoose-aggregate-paginate-v2'

const commentSchema = new mongoose.Schema({
comment:{
    type:String
},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
},
video:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"video"
},

},{timestamps:true})

commentSchema.plugin(mongooseaggregatepaginate)

export const comment = mongoose.model("comment",commentSchema)