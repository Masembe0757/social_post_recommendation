import React, { useState } from "react";
import { motion } from "framer-motion";

const topicSuggestions = [
  { emoji: "\uD83C\uDFAC", label: "Movies", text: "I want to post about trending movies" },
  { emoji: "\uD83D\uDCBB", label: "Tech", text: "I want to post about the latest in tech" },
  { emoji: "\uD83C\uDFCB\uFE0F", label: "Fitness", text: "I want to post a fitness motivation update" },
  { emoji: "\uD83C\uDF73", label: "Food", text: "I want to post about a delicious recipe" },
  { emoji: "\u2708\uFE0F", label: "Travel", text: "I want to post about travel destinations" },
  { emoji: "\uD83D\uDCDA", label: "Books", text: "I want to post a book recommendation" },
  { emoji: "\uD83C\uDFB5", label: "Music", text: "I want to post about trending music" },
  { emoji: "\uD83D\uDCA1", label: "Tips", text: "I want to share a useful life hack or tip" },
];

function EmotionInput({ onSubmit, error }) {
  const [text, setText] = useState("");
  const charCount = text.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length >= 2) {
      onSubmit(text.trim());
    }
  };

  const handleTopicClick = (topicText) => {
    setText(topicText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero section */}
      <div className="text-center mb-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          What do you want to post about?
        </motion.h2>
        <motion.p
          className="text-slate-500 dark:text-slate-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Describe your idea and we'll craft ready-to-share posts with images.
        </motion.p>
      </div>

      {/* Quick topic selectors */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {topicSuggestions.map(({ emoji, label, text: topicText }) => (
          <button
            key={label}
            onClick={() => handleTopicClick(topicText)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all text-sm cursor-pointer"
            title={label}
          >
            <span className="text-lg">{emoji}</span>
            <span className="text-slate-600 dark:text-slate-300">{label}</span>
          </button>
        ))}
      </motion.div>

      {/* Text input form */}
      <motion.form
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. I want to post about trending movies this week, healthy meal prep ideas, my gym progress..."
          className="w-full min-h-[200px] p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-base leading-relaxed"
          maxLength={2000}
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <span
              className={`text-sm ${
                charCount > 500
                  ? "text-amber-500"
                  : charCount > 0
                  ? "text-slate-400 dark:text-slate-500"
                  : "text-slate-300 dark:text-slate-600"
              }`}
            >
              {charCount}/2000
            </span>
            {charCount > 0 && charCount < 10 && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Add more detail for better results
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={text.trim().length < 2}
            className="px-6 py-3 rounded-xl font-semibold text-white emotion-gradient hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Generate Posts
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 text-center">
          Posts are generated by AI. Review and personalize before sharing.
        </p>
      </motion.form>
    </motion.div>
  );
}

export default EmotionInput;
