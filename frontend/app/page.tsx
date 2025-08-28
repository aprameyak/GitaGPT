"use client";
import { useState, type KeyboardEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gitagpt-api.onrender.com";

interface SearchMatch {
  chapter: number;
  verse: number;
  distance: number;
  text: string;
  interpretation: string;
  ai_explanation: string;
}

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendQuery = async (): Promise<void> => {
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

      const data = (await response.json()) as { matches?: SearchMatch[] };
      setResults(data.matches || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-lg mb-6 shadow-lg">
              <span className="text-2xl font-bold text-white">G</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Gita<span className="text-indigo-600">GPT</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover timeless wisdom from the Bhagavad Gita. Ask any question about life, purpose, or spirituality 
              and receive relevant verses with AI-powered explanations.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about life, dharma, or spirituality..."
                    className="w-full px-6 py-4 text-lg bg-gray-50 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none shadow-sm placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={sendQuery}
                  disabled={loading || !query.trim()}
                  className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>

              {/* Example Queries */}
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-gray-500 text-sm mr-2">Try asking:</span>
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(example)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">Something went wrong</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-gray-700 text-lg">Searching ancient wisdom...</span>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Wisdom from the Bhagavad Gita</h2>
              <p className="text-gray-600">Found {results.length} relevant verse{results.length > 1 ? 's' : ''} for your question</p>
            </div>

            {results.map((match, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Chapter {match.chapter}, Verse {match.verse}
                      </h3>
                      <div className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
                        Relevance: {Math.round((1 - match.distance) * 100)}%
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                        <h4 className="text-amber-800 font-semibold mb-2">Sanskrit Verse</h4>
                        <p className="text-gray-700 text-lg italic leading-relaxed">{match.text}</p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                        <h4 className="text-blue-800 font-semibold mb-2">Translation</h4>
                        <p className="text-gray-700 leading-relaxed">{match.interpretation}</p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400">
                        <h4 className="text-purple-800 font-semibold mb-2">Explanation</h4>
                        <p className="text-gray-700 leading-relaxed">{match.ai_explanation}</p>
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
            <div className="inline-flex flex-col items-center gap-4 px-8 py-8 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-2xl font-bold">?</span>
              </div>
              <div>
                <h3 className="text-gray-900 text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-600">Try rephrasing your question or use one of the examples above</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500">
              Bringing ancient wisdom to the modern world
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
