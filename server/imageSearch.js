const UNSPLASH_BASE_URL = "https://api.unsplash.com";

// Map emotions to social-media-ready image search terms (content to post)
const emotionSearchTerms = {
  joy: ["friends celebrating together", "lifestyle happy aesthetic", "good vibes summer"],
  sadness: ["cozy rainy day aesthetic", "journaling coffee window", "reflective portrait"],
  anger: ["powerful workout fitness", "bold street art graffiti", "intense sports action"],
  fear: ["overcoming challenge courage", "adventure bravery heights", "dark aesthetic moody"],
  anxiety: ["self care routine aesthetic", "yoga meditation mindfulness", "calm workspace minimal"],
  calm: ["sunset beach peaceful", "morning coffee routine", "cozy reading nook"],
  hope: ["sunrise golden hour portrait", "planting seeds garden", "open road travel"],
  gratitude: ["friends gathering dinner table", "handwritten letter aesthetic", "nature thankful outdoors"],
  excitement: ["travel adventure explore", "concert festival crowd", "new experience thrill"],
  contentment: ["cozy home aesthetic", "simple pleasures lifestyle", "slow living comfort"],
  pride: ["graduation achievement celebrate", "fitness transformation progress", "creative work showcase"],
  motivation: ["gym workout progress", "desk hustle productivity", "running trail fitness"],
  loneliness: ["coffee shop people watching", "pet companion cozy", "community gathering social"],
  shame: ["fresh start morning routine", "growth mindset journal", "nature walk healing"],
  stress: ["beach vacation relaxation", "spa self care day", "nature hike escape"],
  overwhelm: ["minimalist aesthetic clean", "organized workspace desk", "simple nature calm"],
  disgust: ["fresh healthy food aesthetic", "clean modern lifestyle", "bright floral arrangement"],
  confusion: ["planning journal organized", "map travel direction", "brainstorm creative ideas"],
  boredom: ["creative hobby art studio", "urban exploration photography", "cooking recipe aesthetic"],
  frustration: ["boxing workout release", "hiking mountain summit", "skateboarding street style"],
  disappointment: ["new beginning fresh start", "sunrise hope morning", "growth plant nature"],
};

// In-memory cache: emotion -> { images, timestamp }
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getAccessKey() {
  return process.env.UNSPLASH_ACCESS_KEY;
}

/**
 * Search Unsplash for social-media-ready images to pair with a post.
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
  const terms = emotionSearchTerms[emotion] || [`${emotion} aesthetic social media`];
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
      alt: photo.alt_description || `Suggested image for ${emotion} post`,
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
 * Attach a suggested image to each recommended post for the user to post with.
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
