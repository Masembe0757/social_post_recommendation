import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const loadingMessages = [
  "Researching your topic...",
  "Crafting engaging posts...",
  "Tailoring for each platform...",
  "Finding the perfect images...",
  "Adding the finishing touches...",
  "Almost ready to share...",
];

function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Animated dots */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full bg-indigo-500"
            animate={{
              y: [0, -12, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-lg text-slate-600 dark:text-slate-300 font-medium"
      >
        {loadingMessages[messageIndex]}
      </motion.p>

      <p className="text-sm text-slate-400 dark:text-slate-500 mt-3">
        This usually takes a few seconds
      </p>
    </motion.div>
  );
}

export default LoadingState;
