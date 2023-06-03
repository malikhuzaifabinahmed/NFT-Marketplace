const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const app = express();
const path = require("path");
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
console.log(__dirname);
// Connect to the local MongoDB database
mongoose
  .connect(
    "mongodb+srv://shahab897:shahab%40123@nftmarketplace.mi8dubs.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  userId: String,
  email: String,
  about: String,
  profileImage: String,
  coverImage: String,
});

// Create User model
const User = mongoose.model("User", userSchema);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// Create multer upload instance
const upload = multer({ storage });

// Define a route to handle image uploads
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  // Get the uploaded file information
  const { filename, path } = req.file;
  console.log(filename, path);
  // Perform additional processing or saving to the database

  res.json({ filename, path });
});

// API endpoints

// Define a route to get an image by filename
app.get("/image/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "/uploads", filename);

  // Send the image file as the response
  res.sendFile(imagePath);
});
// Create a new user
app.post("/users", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Read user data by wallet address
app.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findOne({
      userId: req.params.userId,
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

// Update user data by wallet address
app.put("/users/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user data by wallet address
app.delete("/users/:userId", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      userId: req.params.userId,
    });
    if (deletedUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
