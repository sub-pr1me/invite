import Router from "express"
import handleArchiveDate from "../controllers/ArchiveDateController.js"


const ArchiveDateRouter = Router();

ArchiveDateRouter.post('/', handleArchiveDate);

export default ArchiveDateRouter;