import { config } from 'dotenv';

config({
    path: `.env.${process.env.NODE_ENV || 
           'development'}.local`
});

export const { 
    PORT,
    DB_URI,
    NODE_ENV,
    JWT_SECRET,
    ADMIN_EMAIL,
    JWT_EXPIRES_IN,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;
