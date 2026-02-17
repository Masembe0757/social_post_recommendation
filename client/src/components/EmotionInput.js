import React, { useState } from "react";
import { motion } from "framer-motion";

const moodEmojis = [
  { emoji: "\uD83D\uDE0A", label: "Happy", text: "I'm feeling happy and good today" },
  { emoji: "\uD83D\uDE22", label: "Sad", text: "I'm feeling sad and down" },
  { emoji: "\uD83D\uDE1F", label: "Anxious", text: "I'm feeling anxious and worried" },
  { emoji: "\uD83D\uDE21", label: "Angry", text: "I'm feeling frustrated and angry" },
  { emoji: "\uD83D\uDE34", label: "Tired", text: "I'm feeling exhausted and overwhelmed" },
  { emoji: "\uD83E\uDD14", label: "Confused", text: "I'm feeling lost and confused" },
  { emoji: "\uD83D\uDE0C", label: "Calm", text: "I'm feeling peaceful and calm" },
  { emoji: "\uD83C\uDF1F", label: "Excited", text: "I'm feeling excited and motivated" },
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

  const handleEmojiClick = (moodText) => {
    setText(moodText);
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
          How are you feeling?
        </motion.h2>
        <motion.p
          className="text-slate-500 dark:text-slate-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Share what's on your mind, and we'll find posts that resonate with you.
        </motion.p>
      </div>

      {/* Quick mood selectors */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {moodEmojis.map(({ emoji, label, text: moodText }) => (
          <button
            key={label}
            onClick={() => handleEmojiClick(moodText)}
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
          placeholder="How are you feeling today? Share what's on your mind..."
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
                A bit more detail helps us understand you better
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={text.trim().length < 2}
            className="px-6 py-3 rounded-xl font-semibold text-white emotion-gradient hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Find Posts for Me
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
          Your feelings are private and not stored permanently. This is a supportive tool, not a replacement for professional mental health care.
        </p>
      </motion.form>
    </motion.div>
  );
}

export default EmotionInput;
