// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { Link, useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const { data } = await api.get("/profile");
//         setUser(data.user);
//       } catch (error) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     };
//     fetchProfile();
//   }, [navigate]);

//   const logout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <div className="page-center">
//       <div className="profile-card">
//         <h2>Admin Profile</h2>
//         {user && (
//           <>
//             <p><strong>Domain:</strong> {user.domainName}</p>
//             <p><strong>Email:</strong> {user.email}</p>
//             <p><strong>Number:</strong> {user.number}</p>
//           </>
//         )}

//         <div className="profile-actions">
//           <Link to="/dashboard">Dashboard</Link>
//           <Link to="/upload-blogs">Upload Blogs</Link>
//           <Link to="/blogs">Public Blogs</Link>
//           <button onClick={logout}>Logout</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;




import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile");
        setUser(data.user);
      } catch (error) {
        localStorage.clear();
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
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
  <Link to="/profile" className="active">Profile</Link>
  <Link to="/dashboard">My Blogs</Link>
  <Link to="/upload-blogs">Upload Blogs</Link>
  <Link to="/blogs">Public Blogs</Link>
  <Link to="/contact-enquiries">Contact Enquiries</Link>
</nav>

        <button className="admin-logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="admin-dashboard-main">
        <div className="admin-topbar">
          <div>
            <span className="admin-topbar-mini">Overview</span>
            <h1>Admin Profile</h1>
          </div>
        </div>

        <section className="admin-profile-grid">
          <div className="admin-profile-card hero">
            <div className="admin-profile-hero-content">
              <div className="admin-profile-avatar">
                {user?.domainName?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div>
                <h2>{user?.domainName || "Domain Admin"}</h2>
                <p>Manage your blogs, upload PDF content, and control publishing.</p>
              </div>
            </div>
          </div>

          <div className="admin-profile-card">
            <span className="admin-card-label">Domain</span>
            <h3>{user?.domainName || "-"}</h3>
          </div>

          <div className="admin-profile-card">
            <span className="admin-card-label">Email</span>
            <h3>{user?.email || "-"}</h3>
          </div>

          <div className="admin-profile-card">
            <span className="admin-card-label">Contact Number</span>
            <h3>{user?.number || "-"}</h3>
          </div>

          <div className="admin-profile-card wide">
            <span className="admin-card-label">Quick Actions</span>
            <div className="admin-quick-actions">
              <Link to="/dashboard" className="admin-outline-btn">Manage Blogs</Link>
              <Link to="/upload-blogs" className="admin-outline-btn">Upload PDFs</Link>
              <Link to="/blogs" className="admin-outline-btn">View Public Blogs</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;