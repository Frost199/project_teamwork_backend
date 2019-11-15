const multer = require('multer');

const MIME_TYPES = {
  'image/gif': 'gif',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'gifs/');
  },

  filename: (req, file, callback) => {
    let name = file.originalname.split('.gif')[0];
    name = name.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
});

module.exports = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    if (extension !== 'gif') {
      req.fileValidationError = 'Only gif are allowed';
      return callback(null, false, req.fileValidationError);
    }

    callback(null, true);
  },
}).single('gif');
