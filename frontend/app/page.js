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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl w-full mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-4">GitaGPT</h1>
        <p className="mb-4 text-gray-600">
          Ask any question, and I will answer based on the Bhagavad Gita.
        </p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded p-2 w-full text-center"
          placeholder="Ask a question (e.g., What is the meaning of duty?)"
        />
        <button
          onClick={fetchGitaAnswer}
          className="bg-blue-500 text-white p-2 rounded mt-4 w-full"
        >
          Ask GitaGPT
        </button>

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {answer && (
          <div className="mt-6 border p-4 rounded bg-gray-100 text-center">
            <p className="font-bold text-lg">GitaGPT's Answer:</p>
            <p className="text-gray-800 mt-2">{answer}</p>

            {citations.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-bold">Referenced Verses:</p>
                <ul className="list-disc list-inside">
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
