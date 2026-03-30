import { Router } from 'express';
import {
   getAllvideos, PublicedVideo,getVideoId,updateVideoInfo,deletevideo,isPublishedStatus
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllvideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        PublicedVideo
    );

router
    .route("/:videoId")
    .get(getVideoId)
    .delete(deletevideo)
    router
  .route("/:videoId")
  .patch(
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 }
    ]),
    updateVideoInfo
  );

router.route("/toggle/publish/:videoId").patch(isPublishedStatus);

export default router