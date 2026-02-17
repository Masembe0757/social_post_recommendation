const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

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

// JSON schema for Gemini structured output — guarantees valid JSON every time
const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    topic_summary: {
      type: SchemaType.STRING,
      description: "A single sentence summarizing what the user wants to post about",
    },
    posts: {
      type: SchemaType.ARRAY,
      description: "Array of platform-specific social media posts",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          platform: {
            type: SchemaType.STRING,
            description: "Target social media platform",
            enum: ["instagram", "twitter", "facebook", "linkedin", "tiktok"],
          },
          content: {
            type: SchemaType.STRING,
            description:
              "The complete post text, ready to copy-paste. Includes hashtags, emojis, and line breaks as appropriate for the platform.",
          },
          tone: {
            type: SchemaType.STRING,
            description: "The emotional tone of the post",
            enum: [
              "informative",
              "witty",
              "inspirational",
              "conversational",
              "humorous",
              "professional",
              "storytelling",
              "bold",
            ],
          },
          content_type: {
            type: SchemaType.STRING,
            description: "The format/purpose of the post",
            enum: [
              "informative",
              "story",
              "opinion",
              "tip",
              "review",
              "announcement",
              "question",
              "listicle",
            ],
          },
          image_keywords: {
            type: SchemaType.STRING,
            description:
              "3-5 specific, visual words for an Unsplash photo search. Describe concrete objects, scenes, and lighting — e.g. 'coffee shop laptop morning light' not just 'work'.",
          },
        },
        required: ["platform", "content", "tone", "content_type", "image_keywords"],
      },
    },
  },
  required: ["topic_summary", "posts"],
};

/**
 * Generate social media post suggestions using Gemini based on user input.
 * Uses Gemini's structured output mode for guaranteed valid JSON.
 */
async function generatePosts(userInput, count = 5) {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const prompt = `You are a top-tier social media content creator with expertise across all major platforms. A user will describe a topic or idea — your job is to craft ${count} scroll-stopping, ready-to-publish posts, each tailored for a different platform.

=== USER'S IDEA ===
${userInput}
=== END ===

<PLATFORM RULES>
Each post MUST target a DIFFERENT platform. Follow these specs exactly:

TWITTER/X:
- Hard limit: 280 characters (including hashtags and spaces)
- Style: Punchy, opinionated, conversational
- Hashtags: 1-2 max, woven into the text naturally
- Engagement tip: Pose a question or hot take to drive replies

INSTAGRAM:
- Put the hook in the first 125 characters (before the "more" cutoff)
- Use line breaks for readability
- Emojis encouraged — they boost engagement 48%
- Hashtags: 5-10 relevant tags grouped at the end
- End with a call-to-action (save, share, tag a friend)

FACEBOOK:
- Optimal length: 40-80 characters get 66% more engagement, but up to 250 is fine
- Conversational, shareable, community-oriented
- Hashtags: 1-3 max
- Include a question or call-to-action to drive comments

LINKEDIN:
- First 210 characters are visible before "see more" — make them count
- Professional but personable — thought leadership angle
- Use line breaks and short paragraphs
- Hashtags: 3-5 at the end
- Include an insight, lesson, or data point

TIKTOK:
- Caption under 150 characters (the rest gets buried)
- Trendy, casual, Gen-Z friendly language
- Hashtags: 3-5 including at least one trending/broad tag
- Write as if speaking to camera
</PLATFORM RULES>

<QUALITY RULES>
- Start every post with an attention-grabbing hook (question, bold claim, surprising fact, or emotional opener)
- Write like a real human — no corporate speak, no filler, no "In today's fast-paced world..."
- Use emojis naturally where the platform expects them (Instagram, TikTok, Facebook) and sparingly elsewhere (LinkedIn, Twitter)
- Do NOT fabricate statistics, quotes, or unverifiable claims
- Each post should stand alone — a user should be able to copy-paste it directly
- Vary the tone across posts (don't make them all sound the same)
</QUALITY RULES>

<IMAGE GUIDANCE>
For image_keywords, think like a photographer searching Unsplash:
- Use 3-5 concrete, visual words describing objects, scenes, colors, and lighting
- GOOD: "aerial city skyline sunset golden hour"
- GOOD: "person hiking mountain trail misty morning"
- BAD: "technology" (too vague)
- BAD: "cool stuff" (not visual)
The image should complement the post's message and feel native to the platform.
</IMAGE GUIDANCE>

<EXAMPLE>
User idea: "I want to post about morning routines"

Example output for ONE post (generate ${count} like this, each on a different platform):
{
  "platform": "instagram",
  "content": "The 5 AM club is a scam. There, I said it. ☕\\n\\nYour perfect morning routine isn't about waking up before the sun — it's about intentionality.\\n\\nHere's what actually changed my mornings:\\n→ Phone stays on airplane mode for the first hour\\n→ 10 min stretch before coffee\\n→ One priority written down before opening email\\n\\nThe time you wake up matters less than what you do with it.\\n\\nWhat's your non-negotiable morning habit? Drop it below 👇\\n\\n#MorningRoutine #Productivity #IntentionalLiving #WellnessJourney #SelfImprovement #MindfulMornings",
  "tone": "conversational",
  "content_type": "tip",
  "image_keywords": "coffee journal wooden desk morning sunlight"
}
</EXAMPLE>

Now generate ${count} posts for the user's idea above. Each on a different platform.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const parsed = JSON.parse(response.text());

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
