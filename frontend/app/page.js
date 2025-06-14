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

  return (
    <div className="min-h-screen bg-[#121212] text-white p-5">
      <h1 className="text-center text-3xl font-bold mb-5">GitaGPT</h1>
      <div className="flex justify-center mb-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendQuery()}
          placeholder="Ask a question about the Bhagavad Gita..."
          className="w-1/2 p-2.5 text-base rounded border border-[#444] bg-[#222] text-white mr-2.5"
        />
        <button
          onClick={sendQuery}
          disabled={loading}
          className="bg-blue-500 text-white border-none py-2.5 px-5 text-base cursor-pointer rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && <p className="text-center">Searching the Bhagavad Gita...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

      <div className="flex flex-col items-center gap-4">
        {results.map((match, index) => (
          <div
            key={index}
            className="bg-[#1e1e1e] p-6 rounded-lg w-3/5 shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-3">
              Chapter {match.chapter}, Verse {match.verse}
            </h3>
            <p className="mb-3 text-gray-300"><strong>Sanskrit:</strong> {match.text}</p>
            <p className="mb-3"><strong>Translation:</strong> {match.interpretation}</p>
            <p className="text-blue-300"><strong>AI Explanation:</strong> {match.ai_explanation}</p>
          </div>
        ))}
        {!loading && !error && results.length === 0 && query && (
          <p className="text-[#bbb]">No results found. Try a different question.</p>
        )}
      </div>
    </div>
  );
}
