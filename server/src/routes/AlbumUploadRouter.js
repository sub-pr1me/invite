import Router from "express"
import handleAlbumUpload from "../controllers/AlbumUploadController.js"
import upload from "../middleware/uploadImage.js"
import multer from 'multer'


const AlbumUploadRouter = Router();
const albumUpload = upload.array('album', 5);

AlbumUploadRouter.post('/', (req, res, next) => {
  albumUpload(req, res, (err) => {
     if (err instanceof multer.MulterError) {
       switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(413).json({
            error: 'File is too large',
            message: 'Maximum file size is 5MB',
          });
        case 'LIMIT_FILE_COUNT':
          return res.status(400).json({
            error: 'Too many files',
            message: 'Maximum 5 files allowed',
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
}, handleAlbumUpload);

export default AlbumUploadRouter;