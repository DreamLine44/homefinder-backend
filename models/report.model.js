//import { required, string } from "joi";
import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
    {
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },

        targetType: {
            type: String,
            enum: ['post', 'comment', 'user', 'profile'],
            required: true
        },

        reason: {
            type: String,
            required: true,
            trim: true,
            //maxlength: 300
        },
        
        details: {
            type: String,
            trim: true,
            //maxlength: 600
        },

        status: {
            type: String,
            enum: ['pending', 'reviewed'],
            default: 'pending'
        }
    }, { timestamps: true }
);

const Report = mongoose.model('Report', ReportSchema);
export default Report;