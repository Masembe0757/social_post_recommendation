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

async function analyzeEmotion(userText) {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an expert emotion analyst with deep understanding of human psychology. Analyze the following text and identify the user's emotional state with precision and empathy.

User Input: "${userText}"

Provide your analysis ONLY as valid JSON (no markdown, no code fences) in this exact format:
{
  "primary_emotion": "main emotion (one lowercase word from: joy, sadness, anger, fear, surprise, disgust, anxiety, excitement, frustration, hope, disappointment, contentment, loneliness, pride, shame, gratitude, stress, overwhelm, calm, confusion, motivation, boredom, nostalgia)",
  "secondary_emotions": ["2-3 additional emotions from the same list"],
  "intensity": <number 0-100>,
  "sentiment": "positive|negative|neutral|mixed",
  "emotional_context": "brief context description of what's driving these emotions",
  "suggested_content_tone": ["2-3 tone descriptors from: supportive, calming, practical, uplifting, humorous, motivational, validating, energetic, reflective, inspiring, comforting, empowering"],
  "needs_support": <boolean>,
  "crisis_indicators": <boolean>
}

Guidelines:
- crisis_indicators should be true ONLY if the text contains clear signs of self-harm, suicidal ideation, or immediate danger
- needs_support should be true if the person seems to be struggling and could benefit from supportive resources
- Consider nuance, context, and implicit emotions
- Be compassionate and accurate
- intensity: 0-30 mild, 31-60 moderate, 61-80 strong, 81-100 very intense`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    const required = [
      "primary_emotion",
      "secondary_emotions",
      "intensity",
      "sentiment",
      "emotional_context",
      "suggested_content_tone",
      "needs_support",
      "crisis_indicators",
    ];
    for (const field of required) {
      if (parsed[field] === undefined) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Clamp intensity
    parsed.intensity = Math.max(0, Math.min(100, Number(parsed.intensity)));

    return parsed;
  }

  throw new Error("Failed to parse emotion analysis from Gemini response");
}

module.exports = { analyzeEmotion };
