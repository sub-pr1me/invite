import cloudinary from '../utils/cloudinary.js'
import { tableInfoUpdate } from '../models/queries.js'
import type { Request, Response } from 'express'

export default async function handleTableUpload(
  req: Request & { email?: string, errorMessage?: string, file?: Express.Multer.File },
  res: Response) {

  if (req.errorMessage) return res.status(422);
  if (!req.file) return res.sendStatus(422);
  if (!req.email) return res.sendStatus(401);
 
  const email = req.email;
  const id = req.query.id;

  if (typeof id !== 'string') return res.sendStatus(400);
  if (!req.file) return res.sendStatus(422);

  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err || !result) {
      console.log('CONTROLLER ERROR',err);
      return res.status(500).json({
        success: false,
        message: 'UPLOAD ERROR'
      });
    };
    
    const renew = await tableInfoUpdate(email, id, result.secure_url);
    if (renew) {
      const arr = renew.split("/");
      const arr2 = arr[arr.length - 1].split(".");
      const oldLogoID = arr2[arr2.length -2];
      cloudinary.uploader.destroy(oldLogoID).then(() => console.log('old table photo deleted!'));
    }
    const response = await result.secure_url;
    res.status(200).send(response);
  });
};