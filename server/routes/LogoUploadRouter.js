import Router from "express";
import handleLogoUpload from "../controllers/LogoUploadController.js";
import multer from "multer";


const LogoUploadRouter = Router();
const upload = multer({ dest: './uploads', limits: { fieldSize: 5 * 1024 * 1024 } });

LogoUploadRouter.post('/', upload.single('file'), handleLogoUpload);

export default LogoUploadRouter;