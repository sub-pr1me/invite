import cloudinary from '../utils/cloudinary.js'
import { checkVenuesForMatch, checkCustomersForMatch, uploadNewAlbum } from '../db/queries.js'
import asyncHandler from "express-async-handler"

const handleAlbumUpload = asyncHandler(async (req, res)=> {
  try {
    const email = req.email;
    const matchedVenues = await checkVenuesForMatch(email);
    const matchedCustomers = await checkCustomersForMatch(email);
    let accType = null;
    if (matchedVenues) {accType = 'venue'};
    if (matchedCustomers) {accType = 'customer'};

    const images = req.files;
    const imageURLs = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image"
      });
      imageURLs.push(result.secure_url);
    }

    const psqlArr = '{' + imageURLs.toString() + '}';
    const result = await uploadNewAlbum(accType, email, psqlArr);
    console.log(result);
    res.status(200).send(imageURLs);

  } catch (err) {
    console.log(err);
    res.status(500).send('ALBUM CONTROLLER ERROR')
  }
});

export default handleAlbumUpload