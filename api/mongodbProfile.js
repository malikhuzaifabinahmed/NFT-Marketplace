const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const app = express();
const path = require("path");
const { fstat } = require("fs");
const { fetchtopcollections } = require("./topcollections");
const { fetchNftOfCollection, fetchTopNFTs } = require("./topnfts.js");
const { fetchAllUserData, checkData } = require("./UserNfts");
const { fetchsearch } = require("./search");

// const { getContractData } = require("./moraliscontractdata");
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"],
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
  userId: {
    type: String,
    lowercase: true, // Convert userId to lowercase
    unique: true, // Optional: Ensure userId is unique
  },
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
    cb(null, file.originalname);
  },
});

// Create multer upload instance
const upload = multer({ storage });

// Define a route to handle image uploads
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  const { address } = req.body;
  let newfilename = address + req.file.filename;

  const newPath = path.join("uploads/", newfilename);
  fs.renameSync(req.file.path, newPath);

  // Get the uploaded file information

  // console.log(filename, path);
  // Perform additional processing or saving to the database
  console.log(newfilename);
  res.json({ filename: newfilename, path: newPath });
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
      userId: req.params.userId.toLowerCase(),
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

app.get("/collections/top", async (req, res) => {
  fetchtopcollections().then((result) => res.json(result));

  // res.status(200).json({});
});
app.get("/search/:name", async (req, res) => {
  fetchsearch(req.params.name).then((value) => res.status(200).json(value));
});

app.get("/collectionNFTs/:collectionAddress", async (req, res) => {
  fetchNftOfCollection(req.params.collectionAddress).then((result) =>
    res.json(result)
  );

  // res.status(200).json({});
});
app.get("/topNFTs/", async (req, res) => {
  fetchTopNFTs().then((result) => res.status(200).json(result));

  // res.status(200).json({});
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
app.get("/usersdata/:userid", async (req, res) => {
  fetchAllUserData(req.params.userid).then((result) =>
    res.status(200).json(result)
  );
});

app.get("/checkData/:tokenId/:collectionAddress/:userId", async (req, res) => {
  let tokenId = req.params.tokenId;
  let collectionAddress = req.params.collectionAddress;
  let userId = req.params.userId;
  let user = {};

  try {
    user = await User.findOne({
      userId: userId.toLowerCase(),
    });
  } catch (e) {}

  checkData(tokenId, collectionAddress, userId, user).then((result) =>
    res.status(200).json(result)
  );
});
// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
