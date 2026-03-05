import { user } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import JWT from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async (req,res,next) => {
  
try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    if(!token){
        throw new ApiError(401,"Unauthorized Request")
    }
    
     const decodedToken = JWT.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
    const UserValid = await user.findById(decodedToken?._id).select("-password -refreshToken")
    
    if(!UserValid){
        throw new ApiError(401,"invalid access token")
    }
    
  req.user = UserValid;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }

})