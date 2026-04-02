import ContactEnquiry from "../models/ContactEnquiry.js";

export const createContactEnquiry = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      company,
      email,
      phone,
      service,
      message,
      privacy,
      source,
    } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        message: "First name, last name, email and message are required",
      });
    }

    const enquiry = await ContactEnquiry.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company?.trim() || "",
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      service: service?.trim() || "",
      message: message.trim(),
      privacy: privacy || "Accepted",
      source: source || "Website Contact Form",
    });

    return res.status(201).json({
      message: "Contact enquiry saved successfully",
      enquiry,
    });
  } catch (error) {
    console.error("createContactEnquiry error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllContactEnquiries = async (req, res) => {
  try {
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
    return res.status(200).json(enquiries);
  } catch (error) {
    console.error("getAllContactEnquiries error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteContactEnquiry = async (req, res) => {
  try {
    const enquiry = await ContactEnquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    await enquiry.deleteOne();

    return res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("deleteContactEnquiry error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateContactEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const enquiry = await ContactEnquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    enquiry.status = status || enquiry.status;
    await enquiry.save();

    return res.status(200).json({
      message: "Status updated successfully",
      enquiry,
    });
  } catch (error) {
    console.error("updateContactEnquiryStatus error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};