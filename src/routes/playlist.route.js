
import { Router } from 'express';
import {
   createPlaylist,getPlaylistByIdUser,getplaylistId,addvideoAtPlaylist,updatePlaylit,removePlaylistVideo,deletePlaylist
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylist)

router
    .route("/:playlistId")
    .get(getplaylistId)
    .patch(updatePlaylit)
    .delete(deletePlaylist);

router.route("/add/:playlistId/:videoId").patch(addvideoAtPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removePlaylistVideo);

router.route("/user/:userId").get(getPlaylistByIdUser);

export default router
