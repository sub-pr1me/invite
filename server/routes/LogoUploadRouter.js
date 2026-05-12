import Router from 'express'
import handleLogoUpload from '../controllers/LogoUploadController.js'
import upload from '../middleware/uploadImage.js'
import multer from 'multer'

const LogoUploadRouter = Router();
const singleUpload = upload.single('file');

LogoUploadRouter.post('/', (req, res, next) => {
  singleUpload(req, res, (err) => {
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
}, handleLogoUpload);

export default LogoUploadRouter;