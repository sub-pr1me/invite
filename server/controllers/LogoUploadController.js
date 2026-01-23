import cloudinary from '../utils/cloudinary.js'
import { checkVenuesForMatch, checkCustomersForMatch, uploadNewAvatar } from '../db/queries.js'

export default async function handleLogoUpload(req, res) {

    const email = req.email;
    const matchedVenues = await checkVenuesForMatch(email);
    const matchedCustomers = await checkCustomersForMatch(email);
    let accType = null;
    if (matchedVenues) {accType = 'venue'};
    if (matchedCustomers) {accType = 'customer'};

  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      console.log('CONTROLLER ERROR',err);
      res.status(500).json({
        success: false,
        message: 'UPLOAD ERROR'
      })
    }
    // console.log(req.email);
    res.status(200).json({
        success: true,
        message: 'FILE UPLOADED!',
        data: result
    })
    uploadNewAvatar(accType, req.email, result.secure_url);
    // res.send(result.secure_url)
  })
};