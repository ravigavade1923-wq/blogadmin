import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/blogs/my");
      setBlogs(data);
    } catch (error) {
      console.error("My blogs fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog permanently?")) return;

    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const updateBlog = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.put(`/blogs/${editBlog._id}`, {
        title: editBlog.title,
        content: editBlog.content,
        excerpt: editBlog.excerpt,
        status: editBlog.status,
      });

      setBlogs((prev) =>
        prev.map((blog) => (blog._id === editBlog._id ? data.blog : blog)),
      );

      setEditBlog(null);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-logo-box">A</div>
          <div>
            <h3>Admin Panel</h3>
            <p>Professional Workspace</p>
          </div>
        </div>

<nav className="admin-sidebar-nav">
  <Link to="/profile">Profile</Link>
  <Link to="/dashboard" className="active">My Blogs</Link>
  <Link to="/upload-blogs">Upload Blogs</Link>
  <Link to="/blogs">Public Blogs</Link>
  <Link to="/contact-enquiries">Contact Enquiries</Link>
</nav>
      </aside>

      <main className="admin-dashboard-main">
        <div className="admin-topbar">
          <div>
            <span className="admin-topbar-mini">Blog Management</span>
            <h1>My Blogs</h1>
          </div>
        </div>

        {editBlog && (
          <form className="edit-blog-panel" onSubmit={updateBlog}>
            <div className="admin-input-group">
              <label>Blog Title</label>
              <input
                value={editBlog.title}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, title: e.target.value })
                }
              />
            </div>

            <div className="admin-input-group">
              <label>Excerpt</label>
              <textarea
                rows="3"
                value={editBlog.excerpt || ""}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, excerpt: e.target.value })
                }
              />
            </div>

            <div className="admin-input-group">
              <label>Blog Content</label>
              <textarea
                rows="10"
                value={editBlog.content}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, content: e.target.value })
                }
              />
            </div>

            <div className="admin-input-group">
              <label>Status</label>
              <select
                value={editBlog.status}
                onChange={(e) =>
                  setEditBlog({ ...editBlog, status: e.target.value })
                }
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "14px" }}>
              <button className="admin-primary-btn" type="submit">
                Update Blog
              </button>
              <button
                className="admin-outline-btn"
                type="button"
                onClick={() => setEditBlog(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="public-empty-state">
            <h3>Loading blogs...</h3>
          </div>
        ) : blogs.length > 0 ? (
          <div className="dashboard-blog-grid">
            {blogs.map((blog) => (
              <div className="dashboard-blog-card" key={blog._id}>
                <div className="dashboard-blog-card-top">
                  <span>{blog.domainName}</span>
                  <small>{new Date(blog.createdAt).toLocaleDateString()}</small>
                </div>

                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>

                <div className="dashboard-blog-actions">
                  <button onClick={() => setEditBlog(blog)}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => deleteBlog(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="public-empty-state">
            <h3>No blogs available</h3>
            <p>Upload PDFs first to generate blog posts in your dashboard.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
