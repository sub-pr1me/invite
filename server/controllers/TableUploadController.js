import cloudinary from '../utils/cloudinary.js'
import { tableInfoUpdate } from '../db/queries.js'

export default async function handleTableUpload(req, res) {

  if (req.errorMessage) return res.status(422);

  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err) {
      console.log('CONTROLLER ERROR',err);
      res.status(500).json({
        success: false,
        message: 'UPLOAD ERROR'
      });
    };
    
    const renew = await tableInfoUpdate(req.email, req.query.id, result.secure_url);
    if (renew) {
      const arr = renew.split("/");
      const arr2 = arr[arr.length - 1].split(".");
      const oldLogoID = arr2[arr2.length -2];
      cloudinary.uploader.destroy(oldLogoID).then(console.log('old table photo deleted!'));
    }
    const response = await result.secure_url;
    res.status(200).send(response);
  });
};