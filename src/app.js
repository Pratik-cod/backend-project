import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))//its means kitna data ayega frontend toh maine uske 16kb rakhe nhai limit nah irakhunga toh bohot data ayenag server crass ho jayenga
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))//its use for the set and access the images
app.use(cookieParser())//its using for the curd operation

//Router
import userRouter from './routes/user.route.js'

app.use("/api/v1/users",userRouter)
//https://localhost:8000/api/v1/users


export {app}