import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      //maxlength: 2000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Room",
        "Self-Contained",
        "Apartment",
        "House",
        "Shop",
        "Office",
        "Boys Quarter",
        "Other",
      ],
      default: "Apartment"
    },

    images: [
      {
        url: String,
        publicId: String,

        //type: String, // Image URLs
        //required: true,
      },
    ],

    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },

    ///*
    isAvailable: {
      type: Boolean,
      default: true,
    },
    //*/

    status: {
      type: String,
      enum: ['Available', 'Sold', 'Rented'],
      default: 'Available',
    },

    views: {
      type: Number,
      default: 0,
    },

    // Extra optional fields you may use later
    addressDetails: {
      type: String,
      trim: true,
      default: "",
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],
  },

  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;