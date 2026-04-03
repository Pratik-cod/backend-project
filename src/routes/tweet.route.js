import { Router } from 'express';
import {
    createTweet,
    getUserTweet,
    UpdateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT);

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweet);
router.route("/:tweetId").patch(UpdateTweet).delete(deleteTweet);

export default router