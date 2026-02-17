import React from "react";
import { motion } from "framer-motion";

function CrisisResources({ resources, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
            You Matter
          </h2>
          <p className="text-red-600 dark:text-red-400 leading-relaxed">
            It sounds like you might be going through an extremely difficult time.
            Please know that help is available, and you don't have to face this alone.
          </p>
        </div>

        <div className="space-y-4">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-red-100 dark:border-red-900/50"
            >
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">
                {resource.name}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                {resource.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call {resource.phone}
                  </a>
                )}
                {resource.contact && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {resource.contact}
                  </span>
                )}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Website
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-red-500 dark:text-red-400 mt-6">
          If you or someone you know is in immediate danger, please call 911 (US) or your local emergency services.
        </p>
      </div>
    </motion.div>
  );
}

export default CrisisResources;
