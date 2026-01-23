import multer from "multer";

let storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './uploads')
  // },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
  }
})

const upload = multer({
  storage: storage,
  limits: { fieldSize: 5 * 1024 * 1024 }
});

export default upload