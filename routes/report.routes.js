import Router from 'express';
import {
    createReport,
    getAllReports,
    getReportsByTarget,
    getReportsByUser,
    updateReport,
    deleteReport
} from '../controllers/report.controller.js';
import authorize from '../middleware/auth.middleware.js';
import adminOnly from '../middleware/admin.middleware.js';


const reportRouter = Router();

//================================
//USER ROUTES
//================================

//Create report
reportRouter.post('/', authorize, createReport);

//Get report by logged-in user
reportRouter.get('/me', authorize, getReportsByUser);

//================================
//ADMIN ROUTES
//================================

//Get all reports
reportRouter.get('/', authorize, adminOnly,  getAllReports);

//Get reports for a specific target
reportRouter.get('/:targetId', authorize, adminOnly, getReportsByTarget);

//Update report status (reviewed / resulved)
reportRouter.patch('/:reportId', authorize, adminOnly, updateReport);

//Delete report
reportRouter.delete('/:reportId', authorize, adminOnly, deleteReport);


export default reportRouter;