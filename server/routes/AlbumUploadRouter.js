import Router from "express"
import handleAlbumUpload from "../controllers/AlbumUploadController.js"
import upload from "../middleware/uploadImage.js"


const LogoUploadRouter = Router();

LogoUploadRouter.post('/', upload.array('album', 10), handleAlbumUpload);

export default LogoUploadRouter;