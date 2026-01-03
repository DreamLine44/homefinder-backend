import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";



// ============ CREATE TOP-LEVEL COMMENT ============
export const createComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    const allowed = ["text"];
    const data = { userId, postId, parentId: null };

    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    const comment = await Comment.create(data);

    res.status(201).json({ msg: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ============ REPLY TO COMMENT ============
export const replyToComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId, commentId } = req.params;

    const allowed = ["text"];
    const data = { userId, postId, parentId: commentId };

    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    const reply = await Comment.create(data);
    
    res.status(201).json({ msg: "Reply added", reply });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ============ UPDATE COMMENT / REPLY ============
export const updateComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.params;

    const allowed = ["text"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, userId },
      updates,
      { new: true }
    );

    if (!comment)
      return res.status(404).json({ 
      msg: "Comment not found or unauthorized" });

    res.json({ msg: "Comment updated", comment });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ============ DELETE COMMENT / REPLY ============
export const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.params;

    const comment = await Comment.findOneAndDelete({ _id: commentId, userId,});

    if (!comment) return res.status(404).json({ 
      msg: "Comment not found or unauthorized" });

    res.json({ msg: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ============ GET COMMENTS + REPLIES ============
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .lean();

    const map = {};
    const roots = [];

    comments.forEach((c) => {
      c.replies = [];
      map[c._id] = c;
    });

    comments.forEach((c) => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(c);
      } else {
        roots.push(c);
      }
    });

    res.json(roots);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
