import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import contactEnquiryRoutes from "./routes/contactEnquiryRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://blogadmin.vercel.app",
  "https://digitalmarkx-9u52.vercel.app",
  "https://blog-dashboard-git-main-ravigavade1923-wqs-projects.vercel.app",
  "https://digitalmarkx.vercel.app",
];

const vercelPreviewRegex = /^https:\/\/.*\.vercel\.app$/;

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);

    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      vercelPreviewRegex.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/src/uploads", express.static(path.resolve("src/uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Admin Blog Backend Running" });
});

app.get("/api", (req, res) => {
  res.json({ message: "API working" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact-enquiries", contactEnquiryRoutes);

export default app;