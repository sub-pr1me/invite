import Router from "express"
import handleLogoUpload from "../controllers/LogoUploadController.js"
import upload from "../middleware/uploadSingleImage.js"


const LogoUploadRouter = Router();

LogoUploadRouter.post('/', upload.single('file'), handleLogoUpload);

export default LogoUploadRouter;