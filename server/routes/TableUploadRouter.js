import Router from "express"
import handleTableUpload from "../controllers/TableUploadController.js"
import upload from "../middleware/uploadImage.js"


const TableUploadRouter = Router();

TableUploadRouter.post('/', upload.single('tablepic'), handleTableUpload);

export default TableUploadRouter;