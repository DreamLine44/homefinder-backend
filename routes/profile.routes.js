import { Router } from "express";
import { createProfile, updateProfile,  getProfile, updateAvatar } from "../controllers/profile.controller.js";
//import { getMyProfile } from '../controllers/user.controller.js';
//import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/auth.middleware.js";

const profileRouter = Router();

// ============================
// PROFILE ROUTES
// ============================
profileRouter.post("/create", authorize, createProfile);

profileRouter.get("/", authorize, getProfile);

profileRouter.put("/update", authorize, updateProfile);

profileRouter.put("/avatar", authorize, updateAvatar);

//==========================================================
// // routes/profile.routes.js
// import uploadAvatar from "../middleware/multer.profile.js";

// profileRouter.put(
//   "/avatar",
//   authMiddleware,
//   uploadAvatar.single("avatar"),
//   updateAvatar
// );

// 

// profileRouter.put(
//   "/avatar",
//   authMiddleware,
//   avatarUpload.single("avatar"),
//   updateAvatar
// );

// profileRouter.delete(
//   "/avatar",
//   authMiddleware,
//   deleteAvatar
// );

//=========================================================



export default profileRouter; 

