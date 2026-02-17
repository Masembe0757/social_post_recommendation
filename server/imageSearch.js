const UNSPLASH_BASE_URL = "https://api.unsplash.com";

// In-memory cache: query -> { images, timestamp }
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getAccessKey() {
  return process.env.UNSPLASH_ACCESS_KEY;
}

/**
 * Search Unsplash for an image matching the given query string.
 * Returns a single image object or null.
 */
async function searchImage(query) {
  const accessKey = getAccessKey();
  if (!accessKey) {
    return null;
  }

  const cacheKey = query.toLowerCase().trim();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.images[0] || null;
  }

  try {
    const url = `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=3&orientation=landscape&content_filter=high`;

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
      alt: photo.alt_description || `Image for: ${query}`,
      photographer: photo.user.name,
      photographerUrl: `${photo.user.links.html}?utm_source=social_post_recommender&utm_medium=referral`,
      unsplashUrl: `${photo.links.html}?utm_source=social_post_recommender&utm_medium=referral`,
    }));

    cache.set(cacheKey, { images, timestamp: Date.now() });

    return images[0] || null;
  } catch (error) {
    console.error("Unsplash image search failed:", error.message);
    return null;
  }
}

/**
 * Attach a suggested image to each post based on its image_keywords or content.
 * For generated posts, uses image_keywords from the LLM.
 * For fallback static posts, extracts keywords from content.
 * Gracefully returns posts unchanged if images are unavailable.
 */
async function attachImagesToPosts(posts) {
  if (!getAccessKey()) {
    return posts;
  }

  const results = await Promise.all(
    posts.map(async (post) => {
      const query = post.image_keywords || post.content.slice(0, 60);
      const image = await searchImage(query);
      return {
        ...post,
        suggestedImage: image,
      };
    })
  );

  return results;
}

module.exports = { searchImage, attachImagesToPosts };
