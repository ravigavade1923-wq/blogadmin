import express from "express";
import {
  createContactEnquiry,
  getAllContactEnquiries,
  deleteContactEnquiry,
  updateContactEnquiryStatus,
} from "../controllers/contactEnquiryController.js";

const router = express.Router();

router.post("/", createContactEnquiry);
router.get("/", getAllContactEnquiries);
router.put("/:id", updateContactEnquiryStatus);
router.delete("/:id", deleteContactEnquiry);

export default router;