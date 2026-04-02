// import mongoose from "mongoose";

// const contactEnquirySchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     company: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },
//     phone: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//     service: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//     message: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     privacy: {
//       type: String,
//       default: "Accepted",
//     },
//     source: {
//       type: String,
//       default: "Website Contact Form",
//     },
//     status: {
//       type: String,
//       enum: ["new", "contacted", "closed"],
//       default: "new",
//     },
//   },
//   { timestamps: true }
// );

// const ContactEnquiry = mongoose.model("ContactEnquiry", contactEnquirySchema);

// export default ContactEnquiry;

import mongoose from "mongoose";

const contactEnquirySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    service: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    privacy: { type: String, default: "Accepted" },
    source: { type: String, default: "Website Contact Form" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

const ContactEnquiry = mongoose.model("ContactEnquiry", contactEnquirySchema);

export default ContactEnquiry;