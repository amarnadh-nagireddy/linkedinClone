import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {cloudinary,storage} from "../config/cloudinary.js";
import multer from "multer";
import Post from "../models/post.js";
const upload = multer({ storage });

const userSignup = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const uploadedImage = req.file
      ? {
          public_id: req.file.filename,
          url: req.file.path, 
        }
      : null;

    const newUser = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      profileImage: uploadedImage,
    });

    
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const {email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getUser = async (req, res) => {
  try {
    const userId = req.params.id; 

    const posts = await Post.find({ user: userId })
      .populate("user", "firstname lastname username profileImage")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { firstname, lastname, username, email, password } = req.body;

  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (username) user.username = username;
    if (email) user.email = email;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    
    if (req.file) {
      
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }

      
      user.profileImage = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export {userLogin,getUser,userSignup,updateUser,upload};

