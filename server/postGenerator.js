const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

function getGenAI() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Generate social media post suggestions using Gemini based on user input.
 * The LLM researches the topic and crafts ready-to-post content.
 */
async function generatePosts(userInput, count = 4) {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a creative social media content strategist. A user wants to create a social media post. Based on their input, generate ${count} unique, engaging, ready-to-post social media posts.

User Input: "${userInput}"

Instructions:
- Research and incorporate current, relevant information about the topic
- Each post should be tailored for a different social media platform
- Posts should be well-informed, engaging, and ready to copy-paste
- Include relevant hashtags where appropriate
- Vary the tone across posts (informative, witty, inspirational, conversational)
- For each post, include image_keywords: 2-4 words describing the best image to pair with this post

Provide your response ONLY as valid JSON (no markdown, no code fences) in this exact format:
{
  "topic_summary": "brief summary of what the user wants to post about",
  "posts": [
    {
      "platform": "instagram|twitter|facebook|linkedin|tiktok",
      "content": "the full post text with hashtags",
      "tone": "informative|witty|inspirational|conversational|humorous|professional",
      "content_type": "informative|story|opinion|tip|review|announcement",
      "image_keywords": "2-4 descriptive words for an ideal image to attach"
    }
  ]
}

Guidelines:
- Make posts feel authentic and human, not robotic
- Twitter posts should be concise (under 280 chars)
- Instagram posts can be longer with more hashtags
- LinkedIn posts should be professional
- Include facts, stats, or specific details when relevant to make posts informative
- image_keywords should describe a visually compelling photo that complements the post content`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse generated posts from Gemini response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  if (!parsed.posts || !Array.isArray(parsed.posts) || parsed.posts.length === 0) {
    throw new Error("Gemini returned no posts");
  }

  // Add IDs to generated posts
  const posts = parsed.posts.map((post, i) => ({
    post_id: `gen_${Date.now()}_${i}`,
    ...post,
    generated: true,
  }));

  return {
    topic_summary: parsed.topic_summary,
    posts,
  };
}

module.exports = { generatePosts };
