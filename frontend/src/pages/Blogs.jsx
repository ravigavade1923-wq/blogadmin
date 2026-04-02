import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [domain, setDomain] = useState("");

  const fetchBlogs = async (selectedDomain = "") => {
    try {
      const query = selectedDomain ? `?domain=${encodeURIComponent(selectedDomain)}` : "";
      const { data } = await api.get(`/blogs/public${query}`);
      setBlogs(data);
    } catch (error) {
      console.error("Blogs fetch error:", error);
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedDomain = savedUser?.domainName || "";
    setDomain(savedDomain);
    fetchBlogs(savedDomain);
  }, []);

  return (
    <div className="public-blogs-page">
      <div className="public-blogs-hero">
        <span className="public-mini-badge">Content Library</span>
        <h1>Professional Blog Insights</h1>
        <p>
          Explore domain-specific blog articles published through your admin panel
          with a premium reading experience.
        </p>

        <div className="public-filter-bar">
          <input
            type="text"
            placeholder="Filter by domain name"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <button onClick={() => fetchBlogs(domain)}>Filter Blogs</button>
        </div>
      </div>

      <div className="public-blogs-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div className="public-blog-card" key={blog._id || blog.slug}>
              <div className="public-blog-card-top">
                <span className="public-blog-domain">{blog.domainName}</span>
                <span className="public-blog-date">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>

              <div className="public-blog-card-bottom">
                <span className="public-blog-source">
                  {blog.sourcePdfName || "Manual Blog"}
                </span>
                <Link to={`/blogs/${blog.slug}`} className="public-read-btn">
                  Read More
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="public-empty-state">
            <h3>No blogs found</h3>
            <p>This domain has no published blogs right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;