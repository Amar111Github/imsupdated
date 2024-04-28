
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("he;")
      cb(null, "./tmp");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    }
  });
  


const upload = multer({
    storage: storage,
    preservePath: true
})


const fileUploadMiddleware = upload.single('image');

// Middleware to check file size  and file formate after upload
const checkFileSize = async (req, res, next) => {
    
    const { file } = req;
    console.log('upload afile  ------ ', file);
    if (!file) {
        res.status(400).send('plase upload a file');
    }
    else {
        if (req.file.size >= 10 * 1024 && req.file.size <= 50 * 1024) {
        const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedFormats.includes(file.mimetype)) {
            return res.status(400).send('Invalid image format. Supported formats: JPEG, JPG PNG,');
            } else {
            next()
            }
        } else {
            await fs.unlinkSync(req.file.path)
            res.status(400).send('File size must be between 10 KB and 50 KB.');
        }
    }
};

module.exports = {
    fileUploadMiddleware,
    checkFileSize,
};
