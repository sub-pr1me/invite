import Router from "express"
import handleTableUpload from "../controllers/TableUploadController.js"
import upload from "../middleware/uploadImage.js"
import multer from 'multer'


const TableUploadRouter = Router();
const tableUpload = upload.single('tablepic');

TableUploadRouter.post('/', (req, res, next) => {
  tableUpload(req, res, (err) => {
     if (err instanceof multer.MulterError) {
       switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(413).json({
            error: 'File is too large',
            message: 'Maximum file size is 5MB',
          });
        default:
          return res.status(400).json({
            error: 'Upload error',
            message: err.message,
          });
      }
       } else if (err) {
       // An unknown error occurred when uploading
       const err = new Error('Server Error')
       next(err)
     }
    // Everything went fine
    next();
  })
}, handleTableUpload);

export default TableUploadRouter;