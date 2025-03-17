"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Ask me anything about the Bhagavad Gita!" },
  ]);
  const chatEndRef = useRef(null);

  const sendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:8000/search_verses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter: 1, verse: 1, query }), // Include query in request body
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      const botResponses = data.summary
        ? [data.summary]
        : ["I couldn't find a relevant verse. Try another query."];

      setMessages((prev) =>
        prev.concat(botResponses.map((text) => ({ sender: "bot", text })))
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response. Please try again." },
      ]);
    }

    setQuery(""); 
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "32px",
          marginBottom: "20px",
        }}
      >
        GitaGPT
      </h1>

      <div
        style={{
          width: "50%",
          maxHeight: "500px",
          overflowY: "auto",
          backgroundColor: "#1e1e1e",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)",
          marginBottom: "20px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "8px",
                maxWidth: "80%",
                backgroundColor: msg.sender === "user" ? "#007BFF" : "#444",
                color: "#fff",
                whiteSpace: "pre-line",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", width: "50%", gap: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendQuery()}
          placeholder="Ask a question..."
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #444",
            backgroundColor: "#222",
            color: "#fff",
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
          Send
        </button>
      </div>
    </div>
  );
}
