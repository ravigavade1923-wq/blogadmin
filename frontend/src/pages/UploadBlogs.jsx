// import { useState } from "react";
// import api from "../api/axios";

// const UploadBlogs = () => {
//   const [files, setFiles] = useState([]);
//   const [message, setMessage] = useState("");

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!files.length) {
//       alert("Please select PDF files");
//       return;
//     }

//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append("pdfs", files[i]);
//     }

//     try {
//       const { data } = await api.post("/blogs/upload-pdfs", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       });

//       setMessage(`${data.count} blogs uploaded successfully`);
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Upload failed");
//     }
//   };

//   return (
//     <div className="page-center">
//       <form className="card-form" onSubmit={handleUpload}>
//         <h2>Upload PDF Blogs</h2>
//         <input
//           type="file"
//           multiple
//           accept=".pdf"
//           onChange={(e) => setFiles(e.target.files)}
//         />
//         <button type="submit">Upload PDFs</button>
//         {message && <p>{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default UploadBlogs;



// import { useState } from "react";
// import api from "../api/axios";

// const UploadBlogs = () => {
//   const [files, setFiles] = useState([]);
//   const [message, setMessage] = useState("");
//   const [failedFiles, setFailedFiles] = useState([]);

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!files.length) {
//       setMessage("Please select PDF files");
//       return;
//     }

//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append("pdfs", files[i]);
//     }

//     try {
//       const { data } = await api.post("/blogs/upload-pdfs", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       });

//       setMessage(
//         `${data.successCount} blog(s) uploaded successfully, ${data.failedCount} failed`
//       );
//       setFailedFiles(data.failedFiles || []);
//     } catch (error) {
//       console.error("Upload error:", error.response?.data || error.message);
//       setMessage(
//         error.response?.data?.message ||
//           error.response?.data?.error ||
//           "Upload failed"
//       );
//     }
//   };

//   return (
//     <div className="page-center">
//       <form className="card-form" onSubmit={handleUpload}>
//         <h2>Upload PDF Blogs</h2>

//         <input
//           type="file"
//           multiple
//           accept=".pdf"
//           onChange={(e) => setFiles(e.target.files)}
//         />

//         <button type="submit">Upload PDFs</button>

//         {message && <p style={{ marginTop: "12px" }}>{message}</p>}

//         {failedFiles.length > 0 && (
//           <div style={{ marginTop: "16px" }}>
//             <h4>Failed Files</h4>
//             {failedFiles.map((item, index) => (
//               <p key={index}>
//                 {item.file} - {item.reason}
//               </p>
//             ))}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default UploadBlogs;


import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const UploadBlogs = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [failedFiles, setFailedFiles] = useState([]);
  const [successBlogs, setSuccessBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!files.length) {
      setMessage("Please select PDF files");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("pdfs", files[i]);
    }

    try {
      setLoading(true);
      const { data } = await api.post("/blogs/upload-pdfs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(
        `${data.successCount} blog(s) uploaded successfully, ${data.failedCount} failed`
      );
      setFailedFiles(data.failedFiles || []);
      setSuccessBlogs(data.blogs || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
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
  <Link to="/dashboard">My Blogs</Link>
  <Link to="/upload-blogs" className="active">Upload Blogs</Link>
  <Link to="/blogs">Public Blogs</Link>
  <Link to="/contact-enquiries">Contact Enquiries</Link>
</nav>
      </aside>

      <main className="admin-dashboard-main">
        <div className="admin-topbar">
          <div>
            <span className="admin-topbar-mini">Content Management</span>
            <h1>Upload PDF Blogs</h1>
          </div>
        </div>

        <div className="upload-layout">
          <div className="upload-main-card">
            <div className="upload-card-head">
              <span className="admin-card-label">Bulk Upload</span>
              <h2>Convert PDF files into published blogs</h2>
              <p>
                Upload one or multiple PDF files. Each valid file will be parsed
                and stored as a blog post in your admin system.
              </p>
            </div>

            <form className="upload-form-panel" onSubmit={handleUpload}>
              <label className="custom-upload-box">
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                />
                <div className="custom-upload-content">
                  <div className="upload-icon-wrap">↑</div>
                  <h3>Select PDF Files</h3>
                  <p>Choose one or more PDF documents from your device</p>
                </div>
              </label>

              {files.length > 0 && (
                <div className="selected-files-list">
                  <h4>Selected Files</h4>
                  {files.map((file, index) => (
                    <div className="selected-file-item" key={index}>
                      <span>{file.name}</span>
                      <small>{(file.size / 1024).toFixed(1)} KB</small>
                    </div>
                  ))}
                </div>
              )}

              <button className="admin-primary-btn upload-btn" type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload PDFs"}
              </button>
            </form>

            {message && (
              <div className="upload-status-box">
                <strong>Status:</strong> {message}
              </div>
            )}
          </div>

          <div className="upload-side-card">
            <span className="admin-card-label">Upload Summary</span>
            <h3>Processing Result</h3>

            <div className="upload-summary-stats">
              <div className="upload-summary-item">
                <h4>{successBlogs.length}</h4>
                <p>Uploaded Blogs</p>
              </div>
              <div className="upload-summary-item">
                <h4>{failedFiles.length}</h4>
                <p>Failed Files</p>
              </div>
            </div>

            {successBlogs.length > 0 && (
              <div className="upload-result-list">
                <h4>Created Blogs</h4>
                {successBlogs.map((blog) => (
                  <div className="upload-result-item success" key={blog._id}>
                    <span>{blog.title}</span>
                  </div>
                ))}
              </div>
            )}

            {failedFiles.length > 0 && (
              <div className="upload-result-list">
                <h4>Failed Files</h4>
                {failedFiles.map((item, index) => (
                  <div className="upload-result-item failed" key={index}>
                    <span>{item.file}</span>
                    <small>{item.reason}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadBlogs;