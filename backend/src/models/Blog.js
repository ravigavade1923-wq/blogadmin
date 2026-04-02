import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    domainName: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    excerpt: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      required: true
    },
    sourcePdfName: {
      type: String,
      default: ""
    },
    pdfUrl: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published"
    }
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;