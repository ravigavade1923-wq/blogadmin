import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { domainName, email, number, password } = req.body;

    if (!domainName || !email || !number || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanDomainName = domainName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanNumber = number.trim();

    const existingDomain = await User.findOne({ domainName: cleanDomainName });
    if (existingDomain) {
      return res.status(400).json({ message: "Domain already registered" });
    }

    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // PASSWORD HASHED ठेवणेच सुरक्षित आहे
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      domainName: cleanDomainName, // original domain save होईल
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

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
    return res.status(500).json({ message: error.message });
  }
};