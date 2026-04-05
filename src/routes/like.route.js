import { Router } from 'express';
import {
  toggleVideoLike,commentLikeToggle,TweetLiketoggle,getLikeVideo
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(commentLikeToggle);
router.route("/toggle/t/:tweetId").post(TweetLiketoggle);
router.route("/videos").get(getLikeVideo);

export default router