import mongoose, { trusted } from 'mongoose'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
  },
  password:{
    type:String,
    required:true, 
  },
  fullName:{
    type:String,
    required:true,
    trim:true 
  },
  avatar:{
    type:String,//cloudinary
    required:true, 
  },
  coverImage:{
    type:String,//cloudinary 
  },
  refreshToken:{
    type:String,//cloudinary 
  },
  watchHistory:[
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:"video"
  }
]

},{timestamps:true})

UserSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next
     this.password = await bcrypt.hash(this.password,10)
     next
})

UserSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken = function(){
  return Jwt.sign(
        {
          _id:this._id,
          email:this.email,
          username:this.username,
          fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }

  )
}
UserSchema.methods.generateRefreshToken = function() {
  return Jwt.sign(
    {
      _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const user = mongoose.model("user",UserSchema)