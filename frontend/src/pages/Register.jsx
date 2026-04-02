import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [form, setForm] = useState({
    domainName: "",
    email: "",
    number: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const normalizeDomain = (value = "") =>
    value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        domainName: normalizeDomain(form.domainName),
      };

      const { data } = await api.post("/auth/register", payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Registration successful");
      navigate("/profile");
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-bg-shape shape-one"></div>
      <div className="admin-auth-bg-shape shape-two"></div>
      <div className="admin-auth-bg-grid"></div>

      <div className="admin-auth-shell">
        <div className="admin-auth-left">
          <div className="admin-brand-badge">ADMIN PANEL</div>
          <h1>
            Register To <span><br />Open <br /></span> Workspace
          </h1>
          <p>
            Register your domain, securely manage access, and control blog
            publishing from one premium dashboard.
          </p>

          <div className="admin-auth-stats">
            <div className="admin-stat-card">
              <h3>Multi Domain</h3>
              <p>Register and manage multiple domain identities with separate profiles.</p>
            </div>
            <div className="admin-stat-card">
              <h3>Secure Access</h3>
              <p>Protected login flow with password-based admin authentication.</p>
            </div>
            <div className="admin-stat-card">
              <h3>Dynamic Blogs</h3>
              <p>Bulk upload blog content and manage everything from one place.</p>
            </div>
          </div>
        </div>

        <div className="admin-auth-right">
          <form className="admin-auth-card" onSubmit={handleSubmit}>
            <div className="admin-auth-card-top">
              <span className="admin-auth-mini">Get Started</span>
              <h2>Admin Registration</h2>
              <p>Create your admin account to access the dashboard.</p>
            </div>

            <div className="admin-form-grid">
              <div className="admin-input-group">
                <label>Domain Name</label>
                <input
                  type="text"
                  name="domainName"
                  placeholder="webmarkx.com"
                  value={form.domainName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-input-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="number"
                  placeholder="+91 9876543210"
                  value={form.number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className="admin-primary-btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Register Now"}
            </button>

            <div className="admin-auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;