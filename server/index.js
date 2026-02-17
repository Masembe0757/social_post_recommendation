require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { analyzeEmotion } = require("./emotionAnalyzer");
const {
  recommendPosts,
  getRandomPosts,
  getCrisisResources,
} = require("./recommendationEngine");

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Rate limiting: 10 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests. Please wait a moment before trying again.",
  },
});
app.use("/api/", apiLimiter);

// Serve static frontend in production
app.use(express.static(path.join(__dirname, "../client/build")));

// --- API Routes ---

// Analyze emotion and return recommendations
app.post("/api/analyze-emotion", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide some text to analyze.",
      });
    }

    const trimmed = text.trim();
    if (trimmed.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please write a bit more so we can understand how you feel.",
      });
    }

    if (trimmed.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Text is too long. Please keep it under 2000 characters.",
      });
    }

    const emotionAnalysis = await analyzeEmotion(trimmed);

    // Crisis detection - return resources immediately
    if (emotionAnalysis.crisis_indicators) {
      return res.json({
        success: true,
        crisis_mode: true,
        emotion: emotionAnalysis,
        resources: getCrisisResources(),
        posts: [],
      });
    }

    const posts = recommendPosts(emotionAnalysis);

    res.json({
      success: true,
      crisis_mode: false,
      emotion: emotionAnalysis,
      posts,
    });
  } catch (error) {
    console.error("Analysis failed:", error.message);
    res.status(500).json({
      success: false,
      message:
        "We're having trouble analyzing emotions right now. Please try again.",
      fallback_posts: getRandomPosts(5),
    });
  }
});

// Get recommendations by emotion (direct query)
app.get("/api/recommend-posts", (req, res) => {
  try {
    const { emotion, intensity } = req.query;

    if (!emotion) {
      return res.status(400).json({
        success: false,
        message: "Please provide an emotion parameter.",
      });
    }

    const emotionAnalysis = {
      primary_emotion: emotion.toLowerCase(),
      secondary_emotions: [],
      intensity: Number(intensity) || 50,
      sentiment: "neutral",
      suggested_content_tone: [],
    };

    const posts = recommendPosts(emotionAnalysis);

    res.json({ success: true, posts });
  } catch (error) {
    console.error("Recommendation failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get recommendations.",
      fallback_posts: getRandomPosts(5),
    });
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

  // In production, this would persist to a database
  console.log(`Feedback: post=${postId}, helpful=${helpful}`);

  res.json({ success: true });
});

// Get crisis resources
app.get("/api/crisis-resources", (_req, res) => {
  res.json({ success: true, resources: getCrisisResources() });
});

// Catch-all: serve React app for client-side routing
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
