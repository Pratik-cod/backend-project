import { Router } from "express";
import { changecurrentPassword, currentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshaccessToken, registerUser, updateAvatar, updatecoverImage, updateuserDetail } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//scecured route

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshaccessToken)
router.route("/change-password").post(verifyJWT,changecurrentPassword)
router.route("/current-user").get(verifyJWT,currentUser)
router.route("/update-account").patch(verifyJWT,updateuserDetail )
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/update-cover").patch(verifyJWT,upload.single("coverImage"),updatecoverImage)
router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)
router.route("/watch-history").get(verifyJWT,getWatchHistory)
export default router