import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/public/${slug}`);
        setBlog(data);
      } catch (error) {
        console.error("Blog detail fetch error:", error);
      }
    };

    fetchBlog();
  }, [slug]);

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-shell">
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-shell">
        <div className="blog-detail-topbar">
          <Link to="/blogs" className="blog-back-link">
            ← Back to Blogs
          </Link>
        </div>

        <article className="blog-article-card">
          <div className="blog-article-meta">
            <span>{blog.domainName}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>

          <h1>{blog.title}</h1>

          <div className="blog-article-source">
            Source File: {blog.sourcePdfName || "Manual Blog"}
          </div>

          <div className="blog-article-content">
            {blog.content}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;