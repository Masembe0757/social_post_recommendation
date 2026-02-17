import React, { useState } from "react";
import { motion } from "framer-motion";

const platformIcons = {
  twitter: "\uD83D\uDC26",
  instagram: "\uD83D\uDCF7",
  reddit: "\uD83E\uDD16",
  blog: "\uD83D\uDCDD",
  facebook: "\uD83D\uDC64",
};

const platformColors = {
  twitter: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
  instagram: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
  reddit: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  blog: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  facebook: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
};

function PostCard({ post, index }) {
  const [feedbackGiven, setFeedbackGiven] = useState(null);

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
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {post.content_type}
          </span>
        </div>
        {post.matchScore !== undefined && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {Math.round(post.matchScore)}% match
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-3 text-[15px]">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          &mdash; {post.author}
        </span>

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

      {/* Emotion tags */}
      {post.emotions_matched && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.emotions_matched.slice(0, 4).map((emotion) => (
            <span
              key={emotion}
              className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              {emotion}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function PostList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <p className="text-lg">No posts found matching your mood.</p>
        <p className="text-sm mt-2">Try describing your feelings in more detail.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Posts that match your mood
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
