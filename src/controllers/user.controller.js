import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { user } from "../models/User.model.js"
import { uploadCloudinary } from '../service/cloudinary.js'
import { ApiResponce } from '../utils/apiResponce.js'
import Jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {v2 as cloudinary} from 'cloudinary'

const generateAcesstokenandRefreshtoken = async (userid) => {
  try {
   const UserInfo = await user.findById(userid)
     const refreshToken = UserInfo.generateRefreshToken()
     const accessToken = UserInfo.generateAccessToken()
     
    UserInfo.refreshToken = refreshToken

   await UserInfo.save({validateBeforeSave : false})

   return {refreshToken , accessToken}

  } catch (error) {
    throw new ApiError(401,"something went wrong referesh and access token not found")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, fullName } = req.body
  //   console.log("email",email)

  if (
    [fullName, username, email, password].some((field) =>
      field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All the field required")
  }

  const existedUser = await user.findOne({
    $or: [{ email }, { username }]
  })

  if (existedUser) {
    throw new ApiError(409, "user with email and username is alerady exist")
  }

  const localavatarPath = req.files?.avatar?.[0]?.path;
//  const localcoverImagepath = req.files?.coverImage?.[0]?.path;
let coverImagePath;

if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
  coverImagePath = req.files.coverImage[0].path
}


  if (!localavatarPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadCloudinary(localavatarPath)
  //const coverImage = await uploadCloudinary(localcoverImagepath)
  const coverImage = await uploadCloudinary(coverImagePath)

  if (!avatar) {
    throw new ApiError(400, "avatar is reqired")
  }

  const User = await user.create({
    fullName,
    email,
    password,
    coverImage: coverImage?.url || "",
    avatar: avatar.url,
    username: username.toLowerCase()
  })

  const createdUser = await user.findById(User._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "smething went wrong then user not registered")
  }

  return res.status(201).json(
    new ApiResponce(200, createdUser, "user successfully created")
  )
})

const loginUser = asyncHandler(async (req,res) => {

 const {email,username,password} = req.body

 if(!email || !username){
   throw new ApiError(400,"email or email is required")
 }

 const uservalidity = await user.findOne({
  $or:[{username}, {email}]
 })

if(!uservalidity){
  throw new ApiError(401,"user is not found")
}
const passwordValid = await uservalidity.isPasswordCorrect(password)

if(!passwordValid){
  throw new ApiError(401,"invalid user password")
}

  const {accessToken ,refreshToken} = await generateAcesstokenandRefreshtoken(uservalidity._id)

  const loggiedUSer = await user.findById(uservalidity._id).select("-password -refreshToken")

  const options = {
    httpOnly:true,
    secure:true
  }
  return res.status(200).cookie("accessToken", accessToken,options).cookie("refreshToken", refreshToken , options).json(
  new ApiResponce(200,{
User:loggiedUSer,refreshToken,accessToken
    
    },
    "User successfully loggedIn"
  )
  )
})

const logoutUser = asyncHandler(async (req,res) => {

 await user.findByIdAndUpdate(
  req.user._id, {
    $set: {
      $unset:{
        refreshToken:""
      }
    }
  },
  {
    new: true
  }
)

const options = {
  httpOnly:true,
  secure:true
}
return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken" ,options).json(
  new ApiResponce(200, {}, "User logout successfully")
)
})

const refreshaccessToken = asyncHandler(async (req,res) => {

const incomingTokenAccess = req.cookies.refreshToken || req.body.refreshToken

if(!incomingTokenAccess){
  throw new ApiError(401,"unauthorized token")
}

const decodedToken = Jwt.verify(incomingTokenAccess,process.env.REFRESH_TOKEN_SECRET)


const userValid = await user.findById(decodedToken?._id)

if(!userValid){
  throw new ApiError(500,"unauthorized user")
}

console.log("Incoming:", incomingTokenAccess);
console.log("Stored:", userValid.refreshToken);


if(incomingTokenAccess !== userValid.refreshToken){
  throw new ApiError(400,"refresh token is expired")
}

const {refreshToken:newRefreshToken,accessToken} = await generateAcesstokenandRefreshtoken(userValid._id)

userValid.refreshToken = newRefreshToken
await userValid.save()
console.log("DB after save:", userValid.refreshToken);


const options = {
  httpOnly:true,
  secure:true
}

return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newRefreshToken,options).json(
  new ApiResponce(
    200, {
      accessToken,refreshToken:newRefreshToken
    },
    "Access token refreshed"
  )
  )

})

  const changecurrentPassword = asyncHandler(async(req,res) => {
    const {oldPassword,newPassword} = req.body

    // if(newPassword !== conformPassword){
    //   throw new ApiError("400,not matching the password")
    // }

    const userValidity = await user.findById(req.user?._id)

  const isPasswordCorrect = await userValidity.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"wrong password")
  }
  userValidity.password = newPassword

  userValidity.save({validateBeforeSave:false})

  return res.status(200).json(new ApiResponce(200,{},"password changed Successful"))
  })

  const currentUser = asyncHandler(async(req,res) => {
    return res.status(200).json(new ApiResponce(200,req.user, "current user fetched successful"))
  })

  const updateuserDetail = asyncHandler(async(req,res) => {
    const {email,fullName,username} = req.body

    if(!email || !fullName || !username){
      throw ApiError(400,"All fields required")
    }

 const upadateUser= await user.findByIdAndUpdate( req.user?._id, 
    {
    $set:{
      fullName,
      username,
      email
    }
    },
    {
      new:true
    }
   ).select("-password")

   return res.status(200).json(new ApiResponce(200,upadateUser,"Account deatils change successfully"))
  })

  const updateAvatar = asyncHandler(async(req,res) => {
     const updateAvtare = req.file?.path

     if(!updateAvtare){
      throw new ApiError(400,"file are required")
     }

  const uploadAvtare = await uploadCloudinary(updateAvtare)

  if(!uploadAvtare.url){
     throw new ApiError(400," avatar file are required")
  }

 const UserUpload = await user.findByIdAndUpdate(req.user?._id,
  {
   $set: {
    avatar:uploadAvtare.url
   }
  },
  {
    new:true
  }
 ).select("-password")

 

 return res.status(200).json(new ApiResponce(200,UserUpload,"upadate the avatar succcessfully"))
  })

  const updatecoverImage = asyncHandler(async(req,res) => {

    const updateCover = req.file?.path

    if(!updateCover){
       throw new ApiError(400," coverImage file are required")
    }
    const uploading = await uploadCloudinary(updateCover)

    if(!uploading.url){
       throw new ApiError(400," coverImage file are required")
    }

    const uploadCoverUser = await user.findByIdAndUpdate(req.user?._id,
      {
        $set:{
          coverImage:uploading.url
        }
      },
      {
        new:true
      }
    ).select("-password")

    return res.status(200).json(new ApiResponce(200,uploadCoverUser,"upadate the coverImage succcessfully"))
  })

  const getUserChannelProfile = asyncHandler(async(req,res) => {
    const {username} = req.params

    if(!username?.trim()){
      throw new ApiError(400,"username is not found")
    }

const channel = await user.aggregate([
      {
        $match:{
          username:username?.toLowerCase()
        },
      },
      {
        $lookup:{
           from:"subscription",
           localField:"_id",
           foreignField:"channel",
           as:"subscribers"
        }
      },
      {
        $lookup:{
          from:"subscription",
          localField:"_id",
          foreignField:"subscriber",
          as:"subsciberTo"
        }
      },
      {
        $addFields:{
          subscibersCount:{
            $size:"$subscribers"
          },
          channsubscibersCount:{
            $size: "$subsciberTo"
          },
          isSubscribed:{
           $cond:{
            if:{$in: [req.user?._id,"$subscribers.subscriber"]},
            then:true,
            else:false
           }
          }
        }
      },
      {
        $project:{
          fullName:1,
          username:1,
          avatar:1,
          coverImage:1,
          email:1,
          subsciberTo:1,
          subscribers:1

        }
      }
    ])
    if(!channel?.length){
      throw new ApiError(400,"channel does not exist")
    }

    return res.status(200).json(
      new ApiResponce(200,channel[0],"user fetch successfully")
    )
  })

  const getWatchHistory = asyncHandler(async(req,res) => {
    const userCheck = await user.aggregate([
      {
        $match:{
          _id: new mongoose.Types.ObjectId(req.user?._id)
        }
      },
      {
        $lookup:{
          from:"video",
          localField:"watchHistory" ,
          foreignField:"_id",
          as:"watchHistory",
          pipeline:[
            {
              $lookup:{
                from:"user",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                  {
                    $project:{
                      fullName:1,
                      username:1,
                      avatar:1
                    }
                  },

                ]
              }
            },
            {
              $addFields:{
                owner:{
                  $first:"$owner"
                }
              }
            }
          ]
        }
      }
    ])

    return res.status(200).json(
      new ApiResponce(200,userCheck[0].watchHistory,"watch history fetched successfully")
    )
  })

  const videofile = asyncHandler(async(req,res) => {

    const localPath = req.files?.video[0]?.path

    if(!localPath){
      throw new ApiError(400,"video file is required")
    }

    const uploadVideo = await uploadCloudinary(localPath)

    if(!uploadVideo?.url){
      throw new ApiError(400,"video file is required")
    }

    res.status(200).json(
      new ApiResponce(200,uploadVideo,"video file upload successfully")
    )

    })
export { registerUser, loginUser,logoutUser,refreshaccessToken,changecurrentPassword,currentUser,updateuserDetail,updatecoverImage,updateAvatar,getUserChannelProfile,getWatchHistory,videofile }

//req body se mera data leke aao
//frontend se data lo pahle
// phir woh data ko check karo ki usme email,password hai kya
// phir woh data ko compare mongo db db ke data se 
//access and refresh toke generate karo
//cookies mai dal doh
//compare suceefully hogya toh user message throw karo login successful
//nahi toh throw error user not found phale accoun tbaao
