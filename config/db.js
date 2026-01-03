import mongoose from "mongoose";
import { NODE_ENV, DB_URI } from "../config/env.js";
//import { NODE_ENV, DB_URI } from "./env.js";

//console.log('DB FILE PATH:', import.meta.url);


if(!DB_URI) throw new Error('No Database found');

const connectToDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to DB in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('error connecting to DB:', error.message);
        process.exit(1);
    }
}

export default connectToDB;
