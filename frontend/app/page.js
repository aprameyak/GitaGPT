"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gitagpt-api.onrender.com";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/search/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, top_k: 3 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch data");
      }

      const data = await response.json();
      setResults(data.matches || []);
    } catch (error) {
      setError(error.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      sendQuery();
    }
  };

  const exampleQueries = [
    "What is dharma?",
    "How to overcome fear?",
    "What is the meaning of life?",
    "How to find inner peace?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-8 shadow-2xl">
              <span className="text-3xl">🕉️</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              Gita<span className="text-yellow-400">GPT</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover timeless wisdom from the Bhagavad Gita. Ask any question about life, purpose, or spirituality 
              and receive relevant verses with AI-powered explanations.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about life, dharma, or spirituality..."
                    className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm rounded-2xl border-0 focus:ring-4 focus:ring-yellow-400/50 focus:outline-none shadow-lg placeholder-gray-600"
                    disabled={loading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">⏎</span>
                  </div>
                </div>
                <button
                  onClick={sendQuery}
                  disabled={loading || !query.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-2xl hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  ) : (
                    "Search Wisdom"
                  )}
                </button>
              </div>

              {/* Example Queries */}
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-white/70 text-sm mr-2">Try asking:</span>
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(example)}
                    className="px-3 py-1 bg-white/20 text-white/90 text-sm rounded-full hover:bg-white/30 transition-colors duration-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && (
          <div className="mb-8 p-6 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-red-200 font-semibold">Something went wrong</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-lg rounded-2xl">
              <div className="w-8 h-8 border-3 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
              <span className="text-white text-lg">Searching ancient wisdom...</span>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Wisdom from the Bhagavad Gita</h2>
              <p className="text-gray-300">Found {results.length} relevant verse{results.length > 1 ? 's' : ''} for your question</p>
            </div>

            {results.map((match, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-bold text-yellow-400">
                        Chapter {match.chapter}, Verse {match.verse}
                      </h3>
                      <div className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-sm rounded-full">
                        Relevance: {Math.round((1 - match.distance) * 100)}%
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-2xl border-l-4 border-yellow-400">
                        <h4 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
                          <span>📜</span> Sanskrit Verse
                        </h4>
                        <p className="text-gray-200 text-lg italic leading-relaxed">{match.text}</p>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border-l-4 border-blue-400">
                        <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                          <span>🔤</span> Translation
                        </h4>
                        <p className="text-gray-200 leading-relaxed">{match.interpretation}</p>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border-l-4 border-purple-400">
                        <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                          <span>🤖</span> AI Explanation
                        </h4>
                        <p className="text-gray-200 leading-relaxed">{match.ai_explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4 px-8 py-8 bg-white/10 backdrop-blur-lg rounded-2xl">
              <span className="text-6xl">🔍</span>
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-300">Try rephrasing your question or use one of the examples above</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              Built with ❤️ using AI • Bringing ancient wisdom to the modern world
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
