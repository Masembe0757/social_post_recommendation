const UNSPLASH_BASE_URL = "https://api.unsplash.com";

// Map emotions to curated search terms for better image results
const emotionSearchTerms = {
  joy: ["happy people sunshine", "celebration joy", "smiling laughter"],
  sadness: ["rain melancholy", "solitude reflection", "quiet contemplation"],
  anger: ["storm intense", "fire energy", "bold dramatic"],
  fear: ["dark shadows", "fog mystery", "uncertain path"],
  anxiety: ["calm breathing", "peaceful nature", "serene landscape"],
  calm: ["peaceful lake", "zen nature", "tranquil sunset"],
  hope: ["sunrise new beginning", "light through clouds", "spring bloom"],
  gratitude: ["warm golden light", "nature beauty", "hands heart"],
  excitement: ["vibrant colors energy", "adventure travel", "festival celebration"],
  contentment: ["cozy peaceful", "gentle nature", "warm comfort"],
  pride: ["mountain summit", "achievement success", "golden confidence"],
  motivation: ["running determination", "climb overcome", "road ahead journey"],
  loneliness: ["connection togetherness", "community warmth", "friendship bond"],
  shame: ["gentle light healing", "new day hope", "nature renewal"],
  stress: ["ocean waves calm", "forest peaceful", "meditation zen"],
  overwhelm: ["simple minimal", "clear sky space", "calm water"],
  disgust: ["fresh clean nature", "pure water clarity", "bright flowers"],
  confusion: ["clear path direction", "lighthouse guidance", "compass journey"],
  boredom: ["colorful adventure", "explore discover", "creative inspiration"],
  frustration: ["breakthrough perseverance", "open road freedom", "waterfall release"],
  disappointment: ["silver lining clouds", "rainbow after rain", "seeds growth"],
};

// In-memory cache: emotion -> { images, timestamp }
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getAccessKey() {
  return process.env.UNSPLASH_ACCESS_KEY;
}

/**
 * Search Unsplash for images matching an emotion/tone combination.
 * Returns an array of image objects with url, alt, and photographer credit.
 */
async function searchImages(emotion, count = 8) {
  const accessKey = getAccessKey();
  if (!accessKey) {
    return null;
  }

  // Check cache
  const cached = cache.get(emotion);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.images.slice(0, count);
  }

  // Pick a search query from the emotion map
  const terms = emotionSearchTerms[emotion] || [`${emotion} mood atmosphere`];
  const query = terms[Math.floor(Math.random() * terms.length)];

  try {
    const url = `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=${count}&orientation=landscape&content_filter=high`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      console.error(
        `Unsplash API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    const images = data.results.map((photo) => ({
      url: photo.urls.regular,
      thumbUrl: photo.urls.small,
      alt: photo.alt_description || `${emotion} mood image`,
      photographer: photo.user.name,
      photographerUrl: `${photo.user.links.html}?utm_source=social_post_recommender&utm_medium=referral`,
      unsplashUrl: `${photo.links.html}?utm_source=social_post_recommender&utm_medium=referral`,
    }));

    // Cache the results
    cache.set(emotion, { images, timestamp: Date.now() });

    return images.slice(0, count);
  } catch (error) {
    console.error("Unsplash image search failed:", error.message);
    return null;
  }
}

/**
 * Attach an image suggestion to each post based on its emotion.
 * Gracefully returns posts unchanged if images are unavailable.
 */
async function attachImagesToPost(posts, primaryEmotion) {
  const images = await searchImages(primaryEmotion, posts.length);

  if (!images || images.length === 0) {
    return posts;
  }

  return posts.map((post, i) => ({
    ...post,
    suggestedImage: images[i] || null,
  }));
}

module.exports = { searchImages, attachImagesToPost };
