import React from "react";

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 mt-12 py-6">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          PostCraft generates post suggestions using AI. Always review and personalize content before sharing.
        </p>
        <p className="text-xs text-slate-300 dark:text-slate-600 mt-2">
          Powered by Google Gemini &amp; Unsplash.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
