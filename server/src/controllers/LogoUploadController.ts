import cloudinary from '../utils/cloudinary.js'
import { 
  checkVenuesForMatch,
  checkCustomersForMatch, 
  uploadNewAvatar } from '../models/queries.js'
import type { Request, Response } from 'express'

export default async function handleLogoUpload(
  req: Request & { email?: string },
  res: Response) {

  if (!req.file) {
    return res.status(422).json({ message: 'No valid image file was uploaded.' });
  };

  if (!req.email) return res.sendStatus(401);

  const email = req.email;
  const matchedVenues = await checkVenuesForMatch(email);
  const matchedCustomers = await checkCustomersForMatch(email);
  let accType = null;
  if (matchedVenues) {accType = 'venue'};
  if (matchedCustomers) {accType = 'customer'};

  // console.log(req.params);

  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err || !result) {
      return res.status(500).json({ success: false, message: 'UPLOAD ERROR' });
    };

    const renew = await uploadNewAvatar(accType!, req.email!, result.secure_url);
    
    if (renew) {
      const arr = renew.split("/");
      const arr2 = arr[arr.length - 1].split(".");
      const oldLogoID = arr2[arr2.length -2];
      cloudinary.uploader.destroy(oldLogoID).then(() => console.log('old avatar deleted!'));
    };
    
    const response = await result.secure_url;
    res.status(200).send(response);
  });
};