const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");

require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("route-s"));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });


 //SIGNUP ENDPOINT

app.post("/signup", async (req, res) => {
  try {
    console.log("📨 Signup request received:", req.body);

    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(3),
      password: z.string().min(3)
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      console.log("❌ Validation error:", parsed.error.format());
      return res.status(400).json({
        message: "Invalid input format",
        errors: parsed.error.flatten()
      });
    }

    const { email, name, password } = parsed.data;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email,
      name,
      password: hashedPassword
    });

    console.log("✅ User created:", newUser._id);

    res.status(201).json({ message: "You are signed up" });
  } catch (err) {
    console.error("❌ Error in /signup:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * SIGNIN ENDPOINT
 */
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({
      message: "Signin successful",
      token
    });
  } catch (err) {
    console.error("❌ Error in /signin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * CREATE TODO (Auth Required)
 */
app.post("/todo", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { title, done } = req.body;

    await TodoModel.create({
      userId,
      title,
      done: done || false
    });

    res.json({ message: "Todo created" });
  } catch (err) {
    console.error("❌ Error in /todo:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET TODOS (Auth Required)
 */
app.get("/todos", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const todos = await TodoModel.find({ userId });

    res.json({ todos });
  } catch (err) {
    console.error("❌ Error in /todos:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * ROOT HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running ✅" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
