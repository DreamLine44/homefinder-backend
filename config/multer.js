import multer from 'multer';

//Memory Storage (for cloudinary)
const storage = multer.memoryStorage();

//File Filter (images only)
const fileFilter = (req, file, cb) => {
   const allowed = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/webp'
   ];

   if(!allowed.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed'), false);
   }

   cb(null, true);
};

//Multer Instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;



































// //Memory Storage (for cloudinary)
// const storage = multer.memoryStorage();

// //File Filter (images only)
// const fileFilter = (req, file, cb) => {
//     if(!file.mimetype.startsWith('image/')) {
//         cb(new Error('Only image files are allowed'), false);
//     } else {
//         cb(null, true);
//     }
// };

// //Multer Instance
// const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: 5 * 1024 * 1024,
//     },
// });

//export default upload;