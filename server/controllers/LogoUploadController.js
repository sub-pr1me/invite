import cloudinary from '../utils/cloudinary.js'
import { checkVenuesForMatch, checkCustomersForMatch, uploadNewAvatar } from '../db/queries.js'

export default async function handleLogoUpload(req, res) {

    if (req.errorMessage) return res.status(422);

    const email = req.email;
    const matchedVenues = await checkVenuesForMatch(email);
    const matchedCustomers = await checkCustomersForMatch(email);
    let accType = null;
    if (matchedVenues) {accType = 'venue'};
    if (matchedCustomers) {accType = 'customer'};

    // console.log(req.params);

  cloudinary.uploader.upload(req.file.path, async (err, result) => {
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
    
    const renew = await uploadNewAvatar(accType, req.email, result.secure_url);
    if (renew) {
    const arr = renew.split("/");
    const arr2 = arr[arr.length - 1].split(".");
    const oldLogoID = arr2[arr2.length -2];
    cloudinary.uploader.destroy(oldLogoID).then(console.log('old logo deleted!'));
    }    
  })
};