require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { generatePosts } = require("./postGenerator");
const { getRandomPosts, getCrisisResources } = require("./recommendationEngine");
const { attachImagesToPosts } = require("./imageSearch");

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for rate limiter behind reverse proxies / dev servers
app.set("trust proxy", 1);

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Rate limiting: 10 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait a moment before trying again.",
  },
});
app.use("/api/", apiLimiter);

// Serve static frontend in production
app.use(express.static(path.join(__dirname, "../client/build")));

// --- API Routes ---

// Generate social media posts based on user input
app.post("/api/generate-posts", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please describe what you'd like to post about.",
      });
    }

    const trimmed = text.trim();
    if (trimmed.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please provide a bit more detail about your post idea.",
      });
    }

    if (trimmed.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Text is too long. Please keep it under 2000 characters.",
      });
    }

    // Primary: Generate posts with Gemini
    const result = await generatePosts(trimmed);

    // Attach images based on each post's content/keywords
    const postsWithImages = await attachImagesToPosts(result.posts);

    res.json({
      success: true,
      topic_summary: result.topic_summary,
      posts: postsWithImages,
      generated: true,
    });
  } catch (error) {
    console.error("Post generation failed:", error.message);

    // Fallback: serve static posts when Gemini fails
    try {
      const fallbackPosts = getRandomPosts(5);
      const postsWithImages = await attachImagesToPosts(fallbackPosts);
      res.json({
        success: true,
        topic_summary: "Here are some curated post ideas for inspiration",
        posts: postsWithImages,
        generated: false,
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message:
          "We're having trouble generating posts right now. Please try again.",
        posts: getRandomPosts(5),
        generated: false,
      });
    }
  }
});

// Post feedback
app.post("/api/feedback", (req, res) => {
  const { postId, helpful } = req.body;

  if (!postId || typeof helpful !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Please provide postId and helpful (boolean).",
    });
  }

  console.log(`Feedback: post=${postId}, helpful=${helpful}`);

  res.json({ success: true });
});

// Get crisis resources
app.get("/api/crisis-resources", (_req, res) => {
  res.json({ success: true, resources: getCrisisResources() });
});

// Catch-all: serve React app for client-side routing (production only)
const indexPath = path.join(__dirname, "../client/build", "index.html");
app.get("/{*splat}", (_req, res) => {
  const fs = require("fs");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ message: "Not found. In development, use the React dev server." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
