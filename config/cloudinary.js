import { v2 as cloudinary } from 'cloudinary';
//import streamifier from 'streamifier';
import { Readable } from 'stream';

import { 
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET } from '../config/env.js';

//Cloudinary Core Configuration (run once)
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

//Upload BUFFER to Cloudinary
export const uploadToCloudinary = (buffer, folder) => {
    return new Promise ((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ 
            folder,
            resource_type: 'image',
         },
            (error, result) => {
                if(error) return reject(error);
                
                resolve({
                url: result.secure_url,
                publicId: result.public_id
            });
            }
        );
        //streamifier.createReadStream(buffer).piple(uploadStream);
        Readable.from(buffer).pipe(uploadStream);
    });
};

//Delete Image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
    if(!publicId) return;
    await cloudinary.uploader.destroy(publicId);
};

//Export Cloudinary Instance (optional)
export default cloudinary;