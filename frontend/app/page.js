"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setResults(data.matches || []);
    } catch (error) {
      setError(error.message);
      setResults([]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div style={{ backgroundColor: "#121212", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "32px", marginBottom: "20px" }}>GitaGPT</h1>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendQuery()}
          placeholder="Enter a keyword..."
          style={{
            width: "50%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #444",
            backgroundColor: "#222",
            color: "#fff",
            marginRight: "10px",
          }}
        />
        <button
          onClick={sendQuery}
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        {results.length > 0 ? (
          results.map((match, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#1e1e1e",
                padding: "15px",
                borderRadius: "8px",
                width: "60%",
                boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)",
              }}
            >
              <h3>
                Chapter {match.chapter}, Verse {match.verse}
              </h3>
              <p><strong>Sanskrit:</strong> {match.text}</p>
              <p><strong>Meaning:</strong> {match.interpretation}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#bbb" }}>No results found</p>
        )}
      </div>
    </div>
  );
}
