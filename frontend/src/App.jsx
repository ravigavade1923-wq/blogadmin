import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import UploadBlogs from "./pages/UploadBlogs";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";
import ContactEnquiries from "./pages/ContactEnquiries";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/upload-blogs"
          element={
            <PrivateRoute>
              <UploadBlogs />
            </PrivateRoute>
          }
        />

        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route
          path="/contact-enquiries"
          element={
            <PrivateRoute>
              <ContactEnquiries />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
