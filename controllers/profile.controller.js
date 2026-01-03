import mongoose from 'mongoose';
import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';

// =====================================================
// CREATE PROFILE
// =====================================================
export const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if already exists
    const exists = await Profile.findOne({ userId });
    if (exists) {
      return res.status(400).json({ msg: "Profile already exists" });
    }

    const allowed = [
      'firstName',
      'lastName',
      'username',
      'phone',
      'whatsapp',
      'avatar',
      'location',
      'bio',
      'postsCount'
    ];

    const profileData = { userId };

    // Whitelist fields
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        profileData[key] = req.body[key];
      }
    }

    // Create profile
    const profile = await Profile.create(profileData);

    // Link profile to user
    await User.findByIdAndUpdate(userId, { profileId: profile._id });

    res.status(201).json({
      msg: 'Profile created successfully',
      profile
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating profile',
      error: error.message
    });
  }
};


// =====================================================
// UPDATE PROFILE (text fields only)
// =====================================================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const allowed = [
      'firstName',
      'lastName',
      'username',
      'phone',
      'whatsapp',
      'avatar',
      'location',
      'role',
      'bio',
      'postsCount'
    ];

    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { userId }, updates, { new: true }
    );

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    res.status(201).json({
      msg: "Profile updated successfully",
      profile
    });

  } catch (error) {
    res.status(500).json({
      msg: 'Error updating profile',
      error: error.message
    });
  }
};

// =====================================================
// UPDATE AVATAR (upload new file, delete old one)
// =====================================================
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    // Delete old avatar if exists
    if (profile.avatar) {
      const oldPath = path.resolve("." + profile.avatar);
      await deleteFile(oldPath);
    }

    // Save new avatar
    profile.avatar = avatarPath;
    await profile.save();

    res.status(201).json({
      msg: "Avatar updated successfully",
      avatar: avatarPath,
      profile
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to update avatar",
      error: error.message
    });
  }
};

// =====================================================
// DELETE AVATAR (remove file + clear field)
// =====================================================
export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    // Delete avatar file if exists
    if (profile.avatar) {
      const filePath = path.resolve("." + profile.avatar);
      await deleteFile(filePath);
    }

    // Remove avatar field
    profile.avatar = null;
    await profile.save();

    res.status(200).json({
      msg: "Avatar deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to delete avatar",
      error: error.message
    });
  }
};




// =====================================================
// GET PROFILE (merge user + profile)
// =====================================================
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ msg: "Profile not found" });

    // Merge
    const combined = {
      ...user.toObject(),
      ...profile.toObject(),
    };

    res.status(200).json(combined);

  } catch (error) {
    res.status(500).json({
      msg: "Server error",
      error: error.message
    });
  }
};
