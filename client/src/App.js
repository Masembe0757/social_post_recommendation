import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import ContentInput from "./components/ContentInput";
import LoadingState from "./components/LoadingState";
import PostList from "./components/PostList";
import Footer from "./components/Footer";

const API_BASE = process.env.REACT_APP_API_URL || "";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generatePosts = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/generate-posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong. Please try again.");
        if (data.posts) {
          setResult({
            posts: data.posts,
            topic_summary: data.topic_summary,
            generated: data.generated ?? false,
          });
        }
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Unable to connect to the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <Header darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

        <main className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {!loading && !result && (
              <ContentInput
                key="input"
                onSubmit={generatePosts}
                error={error}
              />
            )}

            {loading && <LoadingState key="loading" />}

            {!loading && result && (
              <div key="results">
                <PostList
                  posts={result.posts}
                  topicSummary={result.topic_summary}
                  generated={result.generated}
                />

                <button
                  onClick={handleReset}
                  className="mt-8 mx-auto block px-6 py-3 rounded-xl text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors font-medium cursor-pointer"
                >
                  Create Another Post
                </button>
              </div>
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
