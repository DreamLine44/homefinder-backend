import { Router } from "express";
import {
  createComment,
  replyToComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
import authorize from "../middleware/auth.middleware.js";

const commentRouter = Router();

// GET all comments + nested replies for a post
commentRouter.get("/:postId", authorize, getComments);

// CREATE a comment
commentRouter.post("/:postId/create", authorize, createComment);

// REPLY to a comment
commentRouter.post("/:postId/create/:commentId", authorize, replyToComment);

// REPLY to a comment
//commentRouter.post("/:postId/reply/:commentId", authorize, replyToComment);

// UPDATE comment or reply
commentRouter.put("/:commentId", authorize, updateComment);

// DELETE comment or reply
commentRouter.delete("/:commentId", authorize, deleteComment);

export default commentRouter;









// import express from "express";
// import {
//   addComment,
//   replyComment,
//   deleteComment,
//   getComments,
// } from "../controllers/commentController.js";
// import { protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/:postId", protect, addComment);
// router.post("/reply/:commentId", protect, replyComment);
// router.delete("/:commentId", protect, deleteComment);
// router.get("/:postId", protect, getComments);
// router.put("/:commentId", protect, updateComment);


// export default router;

