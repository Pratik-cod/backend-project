import { Router } from "express";
import{  toggleSubscription,getSubscribedChannels,getUserChannelsubscibers} from '../controllers/subscription.controller.js'

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router
    .route("/c/:channelId")
    // .get(getSubscribedChannels)
    .post(toggleSubscription);
router.route("/u/:subscriberId/channels").get(getSubscribedChannels);
router.route("/c/:channelId/subscribers").get(getUserChannelsubscibers);

export default router