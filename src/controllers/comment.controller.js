import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import {Comment} from "../models/comments.model.js"


const addComment = asyncHandler(async(req,res) => {
    const {videoId} = req.params
    const {comment} = req.body

    if(!comment){
        throw new ApiError(400,"the comment is required")
    }
    if(!videoId){
        throw new ApiError(400,"the comment is required")
    }
const getComments = await Comment.create({
    comment,
    video:videoId,
    owner:req.user?._id
})

if(!getComments){
    throw new ApiError(400,"the comment not create propely")
}
})

 const updateComment = asyncHandler(async(req,res) => {
    const {commentId} = req.params
    const {comment} = req.body

if(!commentId){
    throw new ApiError(400,"commentId is required")
}
if(!comment || comment.trim()){
    throw new ApiError(400,"comment is not found")
}
   
if(!req.user || req.user._id){
    throw new ApiError("unauthorized user")
}

const updatecomment = await Comment.findOneAndUpdate(
    {
        _id:commentId,
        owner:req.user._id
    },
    {
        comment:comment.trim()
    },
    {
        new:true,
        runValidators:true
    }
)

 })

 const deleteComment = asyncHandler(async (req,res) => {
    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(400,"commentId is required")
    }
    if(!req.user || !req.user._id ){
        throw new ApiError(400,"unauthorized user")
    }

    const deleteComment = await Comment.findOneAndDelete(
        {
            _id:commentId,
            owner:req.user._id
        }
    )

    if(!deleteComment){
        throw new ApiError("comment not found")
    }
 })

 export {
    addComment,updateComment,deleteComment
 }
