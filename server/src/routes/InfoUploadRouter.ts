import Router from "express"
import handleInfoUpload from "../controllers/InfoUploadController.js"

const InfoUploadRouter = Router();

InfoUploadRouter.post('/', handleInfoUpload);

export default InfoUploadRouter;