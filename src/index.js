// import mongoose from 'mongoose'
// import {DB_NAME} from './constants'
// import express from 'express'

// const app = express()
// ;( async () => {

//   try {
//     mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)//its a database connection
//     app.on("error",(error) => {
//    console.log("error" ,error);
//    throw error
//     })
//    app.listen(process.env.PORT,() => {
//     console.log(`App is listening on the port ${process.env.PORT}`);
    
//    })

//   } catch (error) {
//      console.error("Error",error)
//      throw error
//   }
// })()

import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'

dotenv.config({
    path:"./.env",
})

connectDB()
.then(() => {

    app.on("error",(error) => {
        console.log("error",error);
        throw error
    })
    
    app.listen(process.env.PORT || 8000, () => {
        console.log(`The Server is running in : ${process.env.PORT}`);
        
    })
})
.catch((err) => {
 console.log("MongoDB connection error",err);
 
})