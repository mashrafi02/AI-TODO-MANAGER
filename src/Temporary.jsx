import { useState } from "react";
import { generateTodos } from "./utils/gemini";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const aiTodos = await generateTodos(prompt);

    if (aiTodos?.error) {
      alert(aiTodos.error);
      setLoading(false);
      return;
    }

    setTodos(aiTodos);
    setLoading(false);
    setPrompt("")
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        AI Structured Todo List 🧠
      </h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your tasks..."
        className="w-full max-w-lg p-3 border rounded-md shadow"
        rows={5}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-3 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {loading ? "Thinking..." : "Generate Todos"}
      </button>

      <div className="mt-6 w-full max-w-lg">
        {todos.length > 0 && (
          <ul className="space-y-3">
            {todos.map((t, i) => (
              <li
                key={i}
                className="p-3 bg-white rounded-md shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{t.title}</h2>
                  <p className="text-sm text-gray-500">{t.category}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    t.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : t.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {t.priority}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

