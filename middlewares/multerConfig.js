import multer from "multer";

const storage = multer.memoryStorage();
const fileFilter = (req,res,cb) => {
        if (file.mimetype === 'image/png' ||
         file.mimetype === 'image/jpeg' ||
         file.mimetype === 'image/webp'||
         file.mimetype === 'image/jpg') {
                cb(null, true);
              } else {
                cb(new Error('Invalid file type! Only PNG, JPEG, and WEBP are allowed.'), false);
              }
}

// Initialize Multer middleware
const upload = multer({
        storage,
        fileFilter
      });
      
      export default upload;