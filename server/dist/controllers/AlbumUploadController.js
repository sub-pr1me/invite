import cloudinary from '../utils/cloudinary.js';
import { checkVenuesForMatch, checkCustomersForMatch, uploadNewAlbum } from '../models/queries.js';
import asyncHandler from "express-async-handler";
const handleAlbumUpload = asyncHandler(async (req, res) => {
    try {
        const email = req.email;
        if (!email) {
            res.sendStatus(401);
            return;
        }
        ;
        const matchedVenues = await checkVenuesForMatch(email);
        const matchedCustomers = await checkCustomersForMatch(email);
        let accType = null;
        if (matchedVenues) {
            accType = 'venue';
        }
        ;
        if (matchedCustomers) {
            accType = 'customer';
        }
        ;
        const images = req.files;
        if (!Array.isArray(images)) {
            res.status(400).send('No uploaded images found');
            return;
        }
        ;
        const imageURLs = [];
        let postreg;
        let untouched;
        let toRemove;
        const postregParam = req.query.postreg;
        const untouchedParam = req.query.untouched;
        const toRemoveParam = req.query.toRemove;
        if (typeof postregParam === 'string')
            postreg = JSON.parse(postregParam);
        if (typeof untouchedParam === 'string')
            untouched = JSON.parse(untouchedParam);
        if (typeof toRemoveParam === 'string')
            toRemove = JSON.parse(toRemoveParam);
        for (let i = 0; i < images.length; i++) {
            console.log('UPLOADING FILE -', images[i].filename);
            const result = await cloudinary.uploader.upload(images[i].path, { resource_type: "image" });
            imageURLs.push(result.secure_url);
        }
        ;
        if (untouched && untouched.length) {
            for (let i = 0; i < untouched.length; i++) {
                imageURLs.push(untouched[i]);
            }
            ;
        }
        ;
        const psqlArr = '{' + imageURLs.toString() + '}';
        const result = await uploadNewAlbum(accType, email, psqlArr, postreg);
        console.log(result);
        for (let i = 0; i < toRemove?.length; i++) {
            const arr = toRemove[i].split("/");
            const arr2 = arr[arr.length - 1].split(".");
            const oldImgID = arr2[arr2.length - 2];
            cloudinary.uploader.destroy(oldImgID).then(() => console.log('old image deleted!'));
        }
        ;
        res.status(200).send(imageURLs);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('ALBUM CONTROLLER ERROR');
    }
});
export default handleAlbumUpload;
