import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      const { data } = await api.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful");
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
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
          <div className="admin-brand-badge">SECURE ACCESS</div>
          <h1>
            Login to your <span>admin dashboard</span>
          </h1>
          <p>
            Access your profile, manage blogs, upload PDF content, and control
            your domain-based admin workspace.
          </p>

          <div className="admin-auth-stats">
            <div className="admin-stat-card">
              <h3>Domain Based</h3>
              <p>Every registered admin gets a separate profile and content flow.</p>
            </div>
            <div className="admin-stat-card">
              <h3>Fast Workflow</h3>
              <p>Login and start managing blog content from your dashboard instantly.</p>
            </div>
            <div className="admin-stat-card">
              <h3>Professional Control</h3>
              <p>Built for admin-level operations with a premium panel experience.</p>
            </div>
          </div>
        </div>

        <div className="admin-auth-right">
          <form className="admin-auth-card" onSubmit={handleSubmit}>
            <div className="admin-auth-card-top">
              <span className="admin-auth-mini">Welcome Back</span>
              <h2>Admin Login</h2>
              <p>Enter your registered credentials to continue.</p>
            </div>

            <div className="admin-form-grid single-column">
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
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className="admin-primary-btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Login Now"}
            </button>

            <div className="admin-auth-footer">
              New admin? <Link to="/register">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;