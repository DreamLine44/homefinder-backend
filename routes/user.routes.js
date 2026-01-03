import { Router } from 'express';
import authorize from '../middleware/auth.middleware.js';
//import authMiddleware from '../middleware/auth.middleware.js';
import { 
    signUp, 
    signIn, 
    getUser, 
} from '../controllers/user.controller.js';

const userRouter = Router();

// Public routes
userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);

// Protected route//

//===============User=====================
userRouter.get('/', authorize, getUser);


export default userRouter;


