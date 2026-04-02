import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse-debugging-disabled";
import slugify from "slugify";
import Blog from "../models/Blog.js";

const makeExcerpt = (text) => {
  const cleanText = text.replace(/\s+/g, " ").trim();
  return cleanText.length > 180 ? cleanText.slice(0, 180) + "..." : cleanText;
};

const createUniqueSlug = async (title) => {
  let baseSlug = slugify(title, { lower: true, strict: true });

  if (!baseSlug) {
    baseSlug = `blog-${Date.now()}`;
  }

  let slug = baseSlug;
  let count = 1;

  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

export const uploadPdfBlogs = async (req, res) => {
  try {
    console.log("req.files =>", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No PDF files uploaded" });
    }

    const createdBlogs = [];
    const failedFiles = [];

    for (const file of req.files) {
      try {
        const filePath = path.resolve(file.path);

        if (!fs.existsSync(filePath)) {
          failedFiles.push({
            file: file.originalname,
            reason: "Uploaded file not found on server",
          });
          continue;
        }

        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        const extractedText = pdfData?.text?.replace(/\s+/g, " ").trim();

        if (!extractedText || extractedText.length < 30) {
          failedFiles.push({
            file: file.originalname,
            reason: "No meaningful text found in PDF",
          });
          continue;
        }

        const guessedTitle =
          extractedText.split(".")[0]?.trim().slice(0, 80) ||
          file.originalname.replace(".pdf", "");

        const slug = await createUniqueSlug(guessedTitle);

        const blog = await Blog.create({
          owner: req.user._id,
          domainName: req.user.domainName,
          title: guessedTitle,
          slug,
          excerpt: makeExcerpt(extractedText),
          content: extractedText,
          sourcePdfName: file.originalname,
          pdfUrl: `/${file.path.replace(/\\/g, "/")}`,
          status: "published",
        });

        createdBlogs.push(blog);
      } catch (fileError) {
        console.error(
          `Error processing ${file.originalname}:`,
          fileError.message,
        );
        failedFiles.push({
          file: file.originalname,
          reason: fileError.message,
        });
      }
    }

    return res.status(201).json({
      message: "PDF upload process completed",
      successCount: createdBlogs.length,
      failedCount: failedFiles.length,
      blogs: createdBlogs,
      failedFiles,
    });
  } catch (error) {
    console.error("uploadPdfBlogs error:", error);
    return res.status(500).json({
      message: "Server error while uploading PDF blogs",
      error: error.message,
    });
  }
};

export const createManualBlog = async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const slug = await createUniqueSlug(title);

    const blog = await Blog.create({
      owner: req.user._id,
      domainName: req.user.domainName,
      title,
      slug,
      excerpt: excerpt || makeExcerpt(content),
      content,
      status: status || "published",
    });

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("createManualBlog error:", error);
    return res.status(500).json({
      message: "Server error while creating blog",
      error: error.message,
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { title, content, excerpt, status } = req.body;

    if (title && title !== blog.title) {
      blog.title = title;
      blog.slug = await createUniqueSlug(title);
    }

    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (status) blog.status = status;

    await blog.save();

    return res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("updateBlog error:", error);
    return res.status(500).json({
      message: "Server error while updating blog",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPublicBlogs = async (req, res) => {
  try {
    const { domain } = req.query;
    const filter = { status: "published" };

    if (domain) {
      filter.domainName = domain;
    }

    const blogs = await Blog.find(filter)
      .select("_id title slug excerpt domainName createdAt sourcePdfName")
      .sort({ createdAt: -1 });

    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error("getBlogBySlug error:", error);
    return res.status(500).json({
      message: "Server error while fetching blog",
      error: error.message,
    });
  }
};
