import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import Report from "../models/report.model.js";
import Profile from '../models/profile.model.js';

export const createReport = async (req, res) => {
    try {
        const reporterId = req.user._id;

        //whitelist source
        const whitelist = [
            'targetId', 
            'targetType', 
            'reason', 
            'details'
        ];

        //dase data
        const data = { reporterId };

        //whitelist extraction
        for (const key of whitelist) {
            if(req.body[key]) data[key] = req.body[key];
        }

        //required checks
        if(!data.targetId || !data.targetType || !data.reason) {
            return res.status(400).json({msg: 'Missing required report fields'});
        }

        //PREVENT DUPLICATE REPORT
        const exists = await Report.findOne({
            reporterId: data.reporterId,
            targetId: data.targetId,
            targetType: data.targetType
        });
        if(exists) return res.status(400).json({msg: 'You already reported this item'});

        //CREATE REPORT
        const report = await Report.create(data);

        //COUNT TOTAL REPORTS FOR THIS TARGET
        const totalReports = await Report.countDocuments({
            targetId: data.targetId,
            targetType: data.targetType
        });

        //AUTO DELETE TARGET IF >= 5 REPORTS
        if(totalReports >= 5) {
            switch (data.targetType) {
                case 'post':
                    await Post.findByIdAndDelete(data.targetId);
                    break;

                case 'comment':
                    await Comment.findByIdAndDelete(data.targetId);
                    break;

                case 'user':
                    await User.findByIdAndDelete(data.targetId);
                    break;

                case 'profile':
                    await Profile.findByIdAndDelete(data.targetId);
                    break;
            }

            return res.status(201).json({
                msg: 'Report submitted successfully. Our team will review it.', 
                report
            });
        }

        //NORMAL SUCCESS RESPONSE
        res.status(201).json({msg: 'Report submitted', report});

    } catch (error) {
        res.status(500).json({msg: err.msg});
    }
};


//GET REPORT FOR A SPECIFIC TARGET
export const getReportsByTarget = async (req, res) => {
    try {
        const { targetId } = req.params;

        const reports =  await Report.find({ targetId })
        .sort({ createdAt: -1 }).lean();

        res.status(200).json({ reports });
    } catch (err) {
        res.status(500).json({msg: err.msg});
    }
};

//GET REPORTS MADE BY USER
export const getReportsByUser = async (req, res) => {
    try {
        const reporterId = req.user._id;

        const reports = await Report.find({ reporterId })
        .sort({ createdAt: -1 }).lean();

        res.status(200).json({reports});
    } catch (err) {
        res.status(500).json({msg: err.msg});
    }
};

//===========ADMIN=================

//GET ALL REPORTS (Admin)
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
        .sort({ createdAt: -1 }).lean();

        res.status(200).json({ reports });
    } catch (err) {
        res.status(500).json({msg: err.msg});
    }
};


//UPDATE REPORT STATUS (Admin)
export const updateReport = async (req, res) => {
    try {
        const { reprotId} = req.params;

        const whitelist = ['status'];
        const data = {};

        for (const key of whitelist) {
            if(req.body[key]) data[key] = req.body[key];
        }

        if(!Object.keys(data).length) {
            return res.status(400).json({msg: 'No fields to update.'});
        }

        const updated = await Report.findByIdAndUpdate(
              reprotId,
            { $set: data },
            { new: true }
        );

        if(!updated) {
            return res.status(404).json({msg: 'Report  not found'});
        }

        res.status(200).json({
            msg: 'Report updated',
            report: updated
        });

    } catch (err) {
        res.status(500).json({msg: err.msg});
    }
};

//DELETE REPORT (Admin)
export const deleteReport = async (req, res) => {
    try {
        const { reprotId } = req.params;

        const deleted = await Report.findByIdAndDelete(reprotId);

        if(!deleted) {
            return res.status(404).json({
                msg: 'Report not found.'
            });
        }

        res.status(200).json({msg: 'Report deleted'});
    } catch (err) {
        res.status(500).json({msg: err.msg});
    }
};