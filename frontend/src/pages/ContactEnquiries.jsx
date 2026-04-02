import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./ContactEnquiries.css";


const ContactEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const { data } = await api.get("/contact-enquiries");
      setEnquiries(data);
    } catch (error) {
      console.error("Fetch enquiry error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;

    try {
      await api.delete(`/contact-enquiries/${id}`);
      setEnquiries((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/contact-enquiries/${id}`, { status });

      setEnquiries((prev) =>
        prev.map((item) => (item._id === id ? data.enquiry : item))
      );
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "contacted":
        return "status-contacted";
      case "closed":
        return "status-closed";
      default:
        return "status-new";
    }
  };

  return (
    <div className="ce-page">
      <aside className="ce-sidebar">
        <div className="ce-brand">
          <div className="ce-brand-logo">A</div>
          <div>
            <h2>Admin Panel</h2>
            <p>Professional Workspace</p>
          </div>
        </div>

        <nav className="ce-nav">
          <Link to="/profile">Profile</Link>
          <Link to="/dashboard">My Blogs</Link>
          <Link to="/upload-blogs">Upload Blogs</Link>
          <Link to="/blogs">Public Blogs</Link>
          <Link to="/contact-enquiries" className="active">
            Contact Enquiries
          </Link>
        </nav>
      </aside>

      <main className="ce-main">
        <div className="ce-header">
          <span className="ce-badge">Lead Management</span>
          <h1>Contact Enquiries</h1>
          <p>Track, manage, and update incoming customer enquiries professionally.</p>
        </div>

        {loading ? (
          <div className="ce-empty-card">
            <h3>Loading enquiries...</h3>
          </div>
        ) : enquiries.length > 0 ? (
          <div className="ce-table-card">
            <div className="ce-table-toolbar">
              <div>
                <h3>All Enquiries</h3>
                <p>Total Leads: {enquiries.length}</p>
              </div>
            </div>

            <div className="ce-table-wrap">
              <table className="ce-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {enquiries.map((item) => (
                    <tr key={item._id}>
                      <td className="ce-name-cell">
                        <strong>
                          {item.firstName || "-"} {item.lastName || ""}
                        </strong>
                      </td>

                      <td>{item.company || "-"}</td>

                      <td className="ce-email">
                        <a href={`mailto:${item.email}`}>{item.email}</a>
                      </td>

                      <td>{item.phone || "-"}</td>

                      <td>
                        <span className="ce-service-pill">
                          {item.service || "-"}
                        </span>
                      </td>

                      <td className="ce-message-cell">
                        {item.message || "-"}
                      </td>

                      <td>
                        <div className={`ce-status-box ${getStatusClass(item.status)}`}>
                          <select
                            className="ce-status-select"
                            value={item.status || "new"}
                            onChange={(e) =>
                              handleStatusChange(item._id, e.target.value)
                            }
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </td>

                      <td>{formatDate(item.createdAt)}</td>

                      <td>
                        <button
                          className="ce-delete-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="ce-empty-card">
            <h3>No enquiries found.</h3>
            <p>Incoming contact leads will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContactEnquiries;