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
    const postreg = JSON.parse(req.query.postreg);
    const untouched = JSON.parse(req.query.untouched);
    const toRemove = JSON.parse(req.query.toRemove);

    console.log('IMGS: ', images);

    for (let i=0; i<images.length; i++) {
      console.log('UPLOADING FILE -',images[i].filename);
      const result = await cloudinary.uploader.upload(images[i].path, {resource_type: "image"});
      imageURLs.push(result.secure_url);
    };

    if (untouched && untouched.length) {
      for (let i=0; i<untouched.length; i++) { imageURLs.push(untouched[i]) };
    };
    
    const psqlArr = '{' + imageURLs.toString() + '}';

    const result = await uploadNewAlbum(accType, email, psqlArr, postreg);
    console.log(result);

    for (let i=0; i<toRemove.length; i++) {
      const arr = toRemove[i].split("/");
      const arr2 = arr[arr.length - 1].split(".");
      const oldImgID = arr2[arr2.length -2];
      cloudinary.uploader.destroy(oldImgID).then(console.log('old image deleted!'));
    };

    res.status(200).send(imageURLs);

  } catch (err) {
    console.log(err);
    res.status(500).send('ALBUM CONTROLLER ERROR');
  }
});

export default handleAlbumUpload