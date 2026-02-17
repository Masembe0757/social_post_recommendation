const posts = require("./data/posts.json");

// Map of emotions to complementary/therapeutic emotions for negative states
const complementaryEmotions = {
  sadness: ["hope", "joy", "gratitude", "contentment"],
  anger: ["calm", "contentment", "hope"],
  fear: ["calm", "hope", "contentment", "pride"],
  anxiety: ["calm", "contentment", "hope", "gratitude"],
  frustration: ["hope", "motivation", "calm", "pride"],
  disappointment: ["hope", "motivation", "gratitude"],
  loneliness: ["contentment", "hope", "gratitude", "joy"],
  shame: ["pride", "hope", "gratitude", "contentment"],
  stress: ["calm", "contentment", "joy", "gratitude"],
  overwhelm: ["calm", "hope", "contentment"],
  disgust: ["hope", "calm", "joy"],
  confusion: ["calm", "motivation", "hope"],
  boredom: ["excitement", "motivation", "joy"],
};

const negativeEmotions = new Set([
  "sadness",
  "anger",
  "fear",
  "anxiety",
  "frustration",
  "disappointment",
  "loneliness",
  "shame",
  "stress",
  "overwhelm",
  "disgust",
  "confusion",
  "boredom",
]);

function calculatePostMatchScore(emotionAnalysis, post) {
  let score = 0;
  const {
    primary_emotion,
    secondary_emotions,
    sentiment,
    suggested_content_tone,
    intensity,
  } = emotionAnalysis;

  const allUserEmotions = [primary_emotion, ...secondary_emotions];
  const isNegative = negativeEmotions.has(primary_emotion);

  // Primary emotion match (35% weight)
  if (post.emotions_matched.includes(primary_emotion)) {
    score += 35;
  }

  // For negative emotions, also score complementary emotions
  if (isNegative && complementaryEmotions[primary_emotion]) {
    const complementary = complementaryEmotions[primary_emotion];
    const compMatches = complementary.filter((e) =>
      post.emotions_matched.includes(e)
    );
    score += compMatches.length * 8; // Up to ~32 bonus
  }

  // Secondary emotions match (20% weight)
  const secondaryMatches = secondary_emotions.filter((emotion) =>
    post.emotions_matched.includes(emotion)
  );
  score += Math.min(20, secondaryMatches.length * 10);

  // Tone alignment (25% weight)
  const toneMatches = suggested_content_tone.filter(
    (tone) => post.tone === tone || post.content_type === tone
  );
  score += Math.min(25, toneMatches.length * 12);

  // Content freshness (10% weight)
  if (post.date_added) {
    const daysSince = Math.floor(
      (Date.now() - new Date(post.date_added).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince < 7) score += 10;
    else if (daysSince < 30) score += 7;
    else if (daysSince < 90) score += 4;
  }

  // Engagement quality (10% weight)
  score += (post.engagement_score || 0) / 10;

  return score;
}

function recommendPosts(emotionAnalysis, count = 8) {
  const isNegative = negativeEmotions.has(emotionAnalysis.primary_emotion);

  // Score all posts
  const scoredPosts = posts.map((post) => ({
    ...post,
    matchScore: calculatePostMatchScore(emotionAnalysis, post),
  }));

  // Sort by score descending
  scoredPosts.sort((a, b) => b.matchScore - a.matchScore);

  // Enforce diversity: no more than 2 posts from same platform or author
  const selected = [];
  const platformCount = {};
  const authorCount = {};

  for (const post of scoredPosts) {
    if (selected.length >= count) break;

    const pCount = platformCount[post.platform] || 0;
    const aCount = authorCount[post.author] || 0;

    if (pCount >= 2) continue;
    if (aCount >= 2) continue;

    selected.push(post);
    platformCount[post.platform] = pCount + 1;
    authorCount[post.author] = aCount + 1;
  }

  // For negative emotions: aim for 70% validation + 30% uplifting
  if (isNegative && selected.length > 3) {
    // Already handled by complementary emotion scoring above,
    // but let's verify we have some uplifting content
    const hasUplifting = selected.some(
      (p) =>
        p.tone === "uplifting" ||
        p.content_type === "motivational" ||
        p.content_type === "supportive"
    );
    if (!hasUplifting) {
      // Swap last item for best uplifting post not already selected
      const upliftingPost = scoredPosts.find(
        (p) =>
          !selected.includes(p) &&
          (p.tone === "uplifting" ||
            p.content_type === "motivational" ||
            p.content_type === "supportive")
      );
      if (upliftingPost) {
        selected[selected.length - 1] = upliftingPost;
      }
    }
  }

  return selected;
}

function getRandomPosts(count = 5) {
  const shuffled = [...posts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getCrisisResources() {
  return [
    {
      name: "988 Suicide & Crisis Lifeline",
      phone: "988",
      description: "24/7, free, confidential support for people in distress",
    },
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      description:
        "Free, 24/7 support via text message with a trained crisis counselor",
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description:
        "Free, confidential, 24/7 treatment referral and information service",
    },
    {
      name: "International Association for Suicide Prevention",
      url: "https://www.iasp.info/resources/Crisis_Centres/",
      description: "Find crisis centers and help worldwide",
    },
    {
      name: "IMAlive Online Crisis Chat",
      url: "https://www.imalive.org/",
      description: "Online crisis chat network staffed by trained volunteers",
    },
  ];
}

module.exports = { recommendPosts, getRandomPosts, getCrisisResources };
