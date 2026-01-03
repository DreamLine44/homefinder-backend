import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
     profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      default: null
      //required: true,
      //unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "agent", "landlord", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

  },

  { timestamps: true }
);


const User = mongoose.model("User", UserSchema)
export default User;