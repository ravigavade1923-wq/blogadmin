// import express from "express";
// import protect from "../middleware/authMiddleware.js";
// import upload from "../middleware/uploadMiddleware.js";
// import {
//   uploadPdfBlogs,
//   createManualBlog,
//   getMyBlogs,
//   updateBlog,
//   deleteBlog,
//   getPublicBlogs,
//   getBlogBySlug
// } from "../controllers/blogController.js";

// const router = express.Router();

// router.get("/public", getPublicBlogs);
// router.get("/public/:slug", getBlogBySlug);

// router.post("/upload-pdfs", protect, upload.array("pdfs", 100), uploadPdfBlogs);
// router.post("/", protect, createManualBlog);
// router.get("/my", protect, getMyBlogs);
// router.put("/:id", protect, updateBlog);
// router.delete("/:id", protect, deleteBlog);

// export default router;




import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadPdfBlogs,
  createManualBlog,
  getMyBlogs,
  updateBlog,
  deleteBlog,
  getPublicBlogs,
  getBlogBySlug,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/public", getPublicBlogs);
router.get("/public/:slug", getBlogBySlug);

router.post("/upload-pdfs", protect, upload.array("pdfs", 100), uploadPdfBlogs);
router.post("/", protect, createManualBlog);
router.get("/my", protect, getMyBlogs);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;