import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
const mobileRegex = /^[0-9+\-\s]{10,15}$/;

const normalizeDomain = (value = "") =>
  value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

export const registerUser = async (req, res) => {
  try {
    const { domainName, email, number, password } = req.body;

    if (!domainName || !email || !number || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanDomainName = normalizeDomain(domainName);
    const cleanEmail = email.trim().toLowerCase();
    const cleanNumber = number.trim();
    const cleanPassword = password.trim();

    if (!domainRegex.test(cleanDomainName)) {
      return res.status(400).json({ message: "Enter a valid domain name" });
    }

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (!mobileRegex.test(cleanNumber)) {
      return res.status(400).json({ message: "Enter a valid mobile number" });
    }

    if (cleanPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingDomain = await User.findOne({ domainName: cleanDomainName });
    if (existingDomain) {
      return res.status(400).json({ message: "Domain already registered" });
    }

    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    const user = await User.create({
      domainName: cleanDomainName,
      email: cleanEmail,
      number: cleanNumber,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        domainName: user.domainName,
        email: user.email,
        number: user.number,
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        domainName: user.domainName,
        email: user.email,
        number: user.number,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ message: error.message });
  }
};