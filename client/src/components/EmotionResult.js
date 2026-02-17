import React from "react";
import { motion } from "framer-motion";

const emotionColors = {
  joy: { bg: "bg-amber-50 dark:bg-amber-900/20", accent: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
  sadness: { bg: "bg-blue-50 dark:bg-blue-900/20", accent: "text-blue-600 dark:text-blue-400", badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  anger: { bg: "bg-red-50 dark:bg-red-900/20", accent: "text-red-600 dark:text-red-400", badge: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
  fear: { bg: "bg-purple-50 dark:bg-purple-900/20", accent: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
  anxiety: { bg: "bg-orange-50 dark:bg-orange-900/20", accent: "text-orange-600 dark:text-orange-400", badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300" },
  calm: { bg: "bg-emerald-50 dark:bg-emerald-900/20", accent: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
  excitement: { bg: "bg-pink-50 dark:bg-pink-900/20", accent: "text-pink-600 dark:text-pink-400", badge: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300" },
  hope: { bg: "bg-cyan-50 dark:bg-cyan-900/20", accent: "text-cyan-600 dark:text-cyan-400", badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300" },
  gratitude: { bg: "bg-rose-50 dark:bg-rose-900/20", accent: "text-rose-600 dark:text-rose-400", badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300" },
  motivation: { bg: "bg-lime-50 dark:bg-lime-900/20", accent: "text-lime-600 dark:text-lime-400", badge: "bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300" },
};

const defaultColors = {
  bg: "bg-indigo-50 dark:bg-indigo-900/20",
  accent: "text-indigo-600 dark:text-indigo-400",
  badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
};

function getIntensityLabel(intensity) {
  if (intensity <= 30) return "Mild";
  if (intensity <= 60) return "Moderate";
  if (intensity <= 80) return "Strong";
  return "Very Intense";
}

function EmotionResult({ emotion }) {
  const colors = emotionColors[emotion.primary_emotion] || defaultColors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${colors.bg} rounded-2xl p-6 mb-8 border border-slate-200/50 dark:border-slate-700/50`}
    >
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            We detected you're feeling
          </p>
          <h3 className={`text-2xl font-bold capitalize ${colors.accent}`}>
            {emotion.primary_emotion}
          </h3>
          {emotion.emotional_context && (
            <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">
              {emotion.emotional_context}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Intensity</span>
            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${emotion.intensity}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {emotion.intensity}%
            </span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {getIntensityLabel(emotion.intensity)}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {emotion.secondary_emotions.map((em) => (
          <span
            key={em}
            className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}
          >
            {em}
          </span>
        ))}
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {emotion.sentiment}
        </span>
      </div>

      {emotion.needs_support && !emotion.crisis_indicators && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 border-t border-slate-200/50 dark:border-slate-700/50 pt-3">
          It sounds like you might be going through a tough time. Remember, it's okay to seek help.
          If you need to talk to someone, the{" "}
          <strong>988 Suicide & Crisis Lifeline</strong> is available 24/7 by calling or texting{" "}
          <strong>988</strong>.
        </p>
      )}
    </motion.div>
  );
}

export default EmotionResult;
