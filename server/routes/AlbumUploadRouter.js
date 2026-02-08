import Router from "express"
import handleAlbumUpload from "../controllers/AlbumUploadController.js"
import upload from "../middleware/uploadImage.js"


const AlbumUploadRouter = Router();

AlbumUploadRouter.post('/', upload.array('album', 5), handleAlbumUpload);

export default AlbumUploadRouter;