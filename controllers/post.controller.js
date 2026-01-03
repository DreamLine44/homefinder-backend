// ================= IMPORTS ==================
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";


// ============================================================
// ======================== CREATE POST ========================
// ============================================================

export const createPost = async (req, res) => {
  try {
    const userId = req.user._id;

    // Whitelisted fields allowed to be updated/saved
    const allowed = [
      "title",
      "description",
      "price",
      "location",
      "type",
      "contactPhone",
      "status",
      "addressDetails",
      "features",
    ];

    const data = { userId };

    // --- Save normal text fields ---
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    // --- Save uploaded images ---
   if(req.files?.length) {
    const uploads = await Promise.all(
      req.files.map((file) => 
      uploadToCloudinary(file.buffer, 'homefinder/posts'))
    );

    data.images = uploads.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    }));
   };

   //--- Create Post now ---
    const post = await Post.create(data);

    return res.status(201).json({
      msg: "Post created successfully",
      post,
    });

  } catch (err) {
    return res.status(500).json({ msg: "Could not create a post", error: err.message });
  }
};

// ============================================================
// ======================== UPDATE POST ========================
// ============================================================

export const updatePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    const allowed = [
      "title",
      "description",
      "price",
      "location",
      "type",
      "contactPhone",
      "status",
      "addressDetails",
      "features",
    ];

    const updates = {};

    // --- Save updated fields ---
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // --- If new images uploaded → replace old images ---
    if (req.files?.length) {
      const post = await Post.findOne({ _id: postId, userId });
      if (!post) {
        return res.status(404).json({ msg: "Post not found or unauthorized" });
      };

        await Promise.all(
          post.images.map((img) => deleteFromCloudinary(img.publicId))
        );

        const uploads = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer, 'homefinder/posts'))
        );

        updates.images = uploads.map((img) => ({
          url: img.url,
          publicId: img.publicId,
        }));
    }

     //Now Update
    const updated = await Post.findOneAndUpdate(
      { _id: postId, userId },
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Post not found or unauthorized" });
    }

    return res.json({
      msg: "Post updated successfully",
      post: updated,
    });

  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
   }
};

// ============================================================
// ============== DELETE A SINGLE IMAGE FROM POST ==============
// ============================================================

export const deleteSingleImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const { publicId } = req.body; // exact URL: "/uploads/posts/xxx.png"

    const post = await Post.findOne({ _id: postId, userId });
    if (!post) {
      return res.status(404).json({ msg: "Post not found or unauthorized" });
    }

    // Remove image from the DB array
    post.images = post.images.filter((img) => img.publicId !== publicId);
    await post.save();

    // Remove from Cloudinary
    await deleteFromCloudinary(publicId, {
    resource_type: "image",
  });

    return res.json({ msg: "Image deleted", post });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ============================================================
// ========================== DELETE POST ======================
// ============================================================

export const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    // Delete post from DB
    const post = await Post.findOneAndDelete({ _id: postId, userId });

    if (!post) {
      return res.status(404).json({ msg: "Post not found or unauthorized" });
    }

    // Delete all images from Cloudinary
    if(post.images?.length) {
      await Promise.all(
      post.images.map((img) => 
      deleteFromCloudinary(img.publicId))
    );
    }

    return res.json({ msg: "Post deleted successfully" });

  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ============================================================
// ========================= GET ALL POSTS ======================
// ============================================================

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ============================================================
// ========================= GET SINGLE POST ====================
// ============================================================

export const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("userId");

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    return res.json(post);

  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ============================================================
// ========================= SEARCH POSTS =======================
// ============================================================

export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const regex = new RegExp(q, "i");

    const posts = await Post.find({
      $or: [{ title: regex }, { location: regex }],
    });

    return res.json({
      message: "Search results",
      results: posts,
    });

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// ============================================================
// ====================== DELETE ALL POSTS (ADMIN) ==============
// ============================================================

export const deleteAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    // Delete images from filesystem
    for (const post of posts) {
         await Promise.all(
          post.images.map((img) => deleteFromCloudinary(img.publicId))
        );
        
      //await deleteFromCloudinary(post); 
    }

    // Delete all posts from DB
    await Post.deleteMany({});

    return res.json({ msg: "All posts deleted" });

  } catch (err) {
    return res.status(500).json(err);
  }
};


