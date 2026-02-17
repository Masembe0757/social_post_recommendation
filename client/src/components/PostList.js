import React, { useState } from "react";
import { motion } from "framer-motion";

const platformIcons = {
  twitter: "\uD83D\uDC26",
  instagram: "\uD83D\uDCF7",
  reddit: "\uD83E\uDD16",
  blog: "\uD83D\uDCDD",
  facebook: "\uD83D\uDC64",
  linkedin: "\uD83D\uDCBC",
  tiktok: "\uD83C\uDFB5",
};

const platformColors = {
  twitter: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
  instagram: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
  reddit: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  blog: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  facebook: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  linkedin: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  tiktok: "bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300",
};

function PostCard({ post, index }) {
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const sendFeedback = async (helpful) => {
    setFeedbackGiven(helpful);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.post_id, helpful }),
      });
    } catch {
      // Feedback is non-critical
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="glass-card rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${
              platformColors[post.platform] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {platformIcons[post.platform] || ""} {post.platform}
          </span>
          {post.tone && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {post.tone}
            </span>
          )}
          {post.content_type && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {post.content_type}
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Suggested Image to Post */}
      {post.suggestedImage && (
        <div className="mb-3">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Suggested image to attach:
          </p>
          <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <a
              href={post.suggestedImage.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={post.suggestedImage.thumbUrl}
                alt={post.suggestedImage.alt}
                className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                loading="lazy"
              />
            </a>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
            <span>Photo by</span>
            <a
              href={post.suggestedImage.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 dark:hover:text-slate-300"
            >
              {post.suggestedImage.photographer}
            </a>
            <span>on</span>
            <a
              href={post.suggestedImage.unsplashUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 dark:hover:text-slate-300"
            >
              Unsplash
            </a>
          </div>
        </div>
      )}

      {/* Post Content */}
      <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-3 text-[15px] whitespace-pre-line">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
        {/* Author for fallback static posts */}
        {post.author && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            &mdash; {post.author}
          </span>
        )}
        {!post.author && <span />}

        {/* Feedback buttons */}
        <div className="flex items-center gap-1">
          {feedbackGiven === null ? (
            <>
              <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">
                Helpful?
              </span>
              <button
                onClick={() => sendFeedback(true)}
                className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                title="Yes, this was helpful"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
              <button
                onClick={() => sendFeedback(false)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Not helpful"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {feedbackGiven ? "Thanks for the feedback!" : "We'll do better"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function PostList({ posts, topicSummary, generated }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <p className="text-lg">No post suggestions found.</p>
        <p className="text-sm mt-2">Try describing what you'd like to post about in more detail.</p>
      </div>
    );
  }

  return (
    <div>
      {topicSummary && (
        <div className="mb-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            {topicSummary}
          </p>
        </div>
      )}
      {!generated && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            AI generation is currently unavailable. Here are some curated post ideas for inspiration.
          </p>
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
        {generated ? "Your generated posts" : "Curated post ideas"}
      </h3>
      <div className="grid gap-4">
        {posts.map((post, index) => (
          <PostCard key={post.post_id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}

export default PostList;
