// routes/post.routes.js
import { Router } from "express";

// Auth middleware (protects routes)
import authorize from "../middleware/auth.middleware.js";

// Multer image upload middleware
import upload from "../config/multer.js";
 
// Post controllers
import {
  createPost,
  updatePost,
  getAllPosts,
  getSinglePost,
  deletePost,
  searchPosts,
  deleteAllPosts,
  deleteSingleImage,
} from "../controllers/post.controller.js";

const postRouter = Router();


/* ============================================================
   SEARCH POSTS
   - Public
============================================================ */
postRouter.get("/search", searchPosts);

/* ============================================================
   CREATE POST
   - Protected
   - Accepts multiple images
   - Uses upload.array("images")
============================================================ */
postRouter.post("/", authorize,
  // Allow up to 10 images (safe limit)
  upload.array("images", 5), 
  createPost);

/* ============================================================
   UPDATE POST
   - Protected
   - Also supports multiple image upload
   - Replaces all images if new ones are uploaded
============================================================ */
postRouter.put("/:postId/update", authorize,
  upload.array("images", 5), 
  updatePost);

/* ============================================================
   DELETE A SINGLE IMAGE FROM POST
   - Protected
   - Body must include image URL
============================================================ */
postRouter.delete("/:postId/image", authorize, deleteSingleImage);

/* ============================================================
   GET ALL POSTS
   - Public
============================================================ */
postRouter.get("/", getAllPosts);

/* ============================================================
   GET A SINGLE POST
   - Protected (because it returns user info)
============================================================ */
postRouter.get("/:postId", authorize, getSinglePost);

/* ============================================================
   DELETE A POST
   - Protected
   - Deletes all images automatically
============================================================ */
postRouter.delete("/:postId/delete", authorize, deletePost);

/* ============================================================
   ADMIN: DELETE ALL POSTS
   - WARNING: removes every post + image
   - Should be protected with admin-only logic later
============================================================ */
postRouter.delete("/delete", deleteAllPosts);

export default postRouter;

