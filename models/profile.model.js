import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // allows multiple nulls
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },

    avatar: {
        url: String,
        publicId: String,

      // type: String, // URL
      // default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    postsCount: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;