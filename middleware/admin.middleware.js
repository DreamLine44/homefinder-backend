import User from '../models/user.model.js';

const adminOnly = async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).json({msg: 'Unauthorized.'});
        };

        if(req.user.role !== 'admin') {
            return res.status(404).json({msg: 'Only admin is allowed.'});
        };

        next();

    } catch (err) {
        res.status(500).json({msg: err.msg});
    }
};

export default adminOnly;