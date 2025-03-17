"use client";
import { useState } from "react";
import axios from "axios";

export default function GitaChat() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGitaAnswer = async () => {
    setLoading(true);
    setError(null);
    setAnswer("");
    setCitations([]);

    try {
      const { data } = await axios.post("http://localhost:8000/search_verses", {
        query,
        k: 5,
      });

      if (!data.results || data.results.length === 0) {
        setAnswer("I couldn't find a relevant verse for your question.");
        setLoading(false);
        return;
      }

      const versesContext = data.results
        .map(
          (verse) =>
            `Chapter ${verse.chapter_number}, Verse ${verse.verse_number}: ${verse.text}`
        )
        .join("\n\n");

      const citationsList = data.results.map(
        (verse) => `Chapter ${verse.chapter_number}, Verse ${verse.verse_number}`
      );

      const openaiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are GitaGPT, a spiritual assistant that provides wisdom from the Bhagavad Gita.",
            },
            {
              role: "user",
              content: `Using the Bhagavad Gita, answer this question: "${query}". Here are relevant verses:\n\n${versesContext}`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      const chatbotAnswer =
        openaiResponse.data.choices?.[0]?.message?.content ||
        "I couldn't generate a response.";

      setAnswer(chatbotAnswer);
      setCitations(citationsList);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #1e3a8a, #4c1d95)', padding: '16px' }}>
      <div style={{ maxWidth: '640px', width: '100%', margin: 'auto', padding: '32px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.3)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e3a8a', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>GitaGPT</h1>
        <p style={{ marginTop: '16px', fontSize: '18px', color: '#4c1d95' }}>
          Ask any question, and I will answer based on the Bhagavad Gita.
        </p>

        <div style={{ marginTop: '24px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ border: '1px solid rgba(30, 58, 138, 0.4)', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', padding: '12px', width: '100%', textAlign: 'center', color: '#1e3a8a', placeholder: { color: 'rgba(30, 58, 138, 0.6)' }, outline: 'none', transition: 'all 0.3s', focus: { ring: '2px solid #6366f1' } }}
            placeholder="Ask a question"
          />
          <button
            onClick={fetchGitaAnswer}
            style={{ background: '#6366f1', color: 'white', fontWeight: '600', padding: '12px', borderRadius: '8px', marginTop: '16px', width: '100%', transition: 'all 0.3s', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', hover: { background: '#4f46e5' } }}
          >
            Ask GitaGPT
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderTop: '4px solid #1e3a8a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        )}

        {error && <p style={{ color: '#f87171', marginTop: '16px' }}>{error}</p>}

        {answer && (
          <div style={{ marginTop: '32px', padding: '24px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(30, 58, 138, 0.3)', color: '#1e3a8a', textAlign: 'left', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <p style={{ fontSize: '20px', fontWeight: '700' }}>GitaGPT's Answer:</p>
            <p style={{ marginTop: '16px', color: '#4c1d95' }}>{answer}</p>

            {citations.length > 0 && (
              <div style={{ marginTop: '24px', fontSize: '14px' }}>
                <p style={{ fontWeight: '700', color: '#1e3a8a' }}>Referenced Verses:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#4c1d95' }}>
                  {citations.map((citation, index) => (
                    <li key={index}>{citation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
