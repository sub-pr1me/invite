import multer from "multer";

const getRandomKey = () => crypto.randomUUID();

let storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './uploads')
  // },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + `${getRandomKey()}` + extension);
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      req.errorMessage = 'Invalid file extension!'
      cb(null, false);
    }
  }
});

export default upload