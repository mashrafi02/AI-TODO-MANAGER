import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetTodosQuery, useCreateTodoMutation } from "../services/todoApi";
import { generateTodos } from "../utils/gemini";
import Todo from "./TodoComponents/Todo";
import toast from "react-hot-toast";

const TodoWindow = () => {
  const { currentTodo } = useSelector((state) => state.todo);
  const { data, isLoading, refetch } = useGetTodosQuery({
    collectionId: currentTodo?._id,
  });
  const [createTodo] = useCreateTodoMutation();

  const [prompt, setPrompt] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (currentTodo?._id) refetch();
  }, [currentTodo?._id, refetch]);

  useEffect(() => {
    if (data?.todos) {
      setTodos(data.todos);
    } else {
      setTodos([]);
    }
  }, [data, isLoading, currentTodo?._id]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !deadline.trim()) {
      toast.error('Please fill both fields');
      return
    };
    setLoading(true);

    const aiTodos = await generateTodos(prompt);
    const response = await createTodo({
      todos: aiTodos,
      collectionId: currentTodo._id,
      deadline
    }).unwrap();

    const updatedTodo = response?.todos;
    setTodos(updatedTodo);
    setLoading(false);
    setPrompt("");
    setDeadline("");
  };

  if (!currentTodo)
    return (
      <p className="h-screen bg-purple-100 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-semibold text-gray-800 tracking-tight mb-36">
          AI Structured Todo List 🧠
        </h1>
        <span className=" text-gray-600 text-lg font-light">Crete a New Project</span>
      </p>
    );

  const groupedTodos = todos.reduce((acc, todo) => {
    const date = todo.deadline.split("T")[0]; // get YYYY-MM-DD
    if (!acc[date]) acc[date] = [];
    acc[date].push(todo);
    return acc;
  }, {});

  // Sort deadlines
  const sortedDates = Object.keys(groupedTodos).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  console.log(sortedDates);
  console.log(groupedTodos)

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-semibold mb-6 text-gray-800 tracking-tight">
        AI Structured Todo List 🧠
      </h1>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your tasks..."
            className="flex-1 resize-none p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            rows={3}
          />

          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className="text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer transition"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`mt-2 py-2.5 px-5 rounded-lg text-white font-medium transition-all duration-200 ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-700 shadow-md hover:shadow-lg cursor-pointer"
          }`}
        >
          {loading ? "Thinking..." : "Generate Todos"}
        </button>
      </div>

      <div className="mt-8 w-full max-w-4xl">
        {
        sortedDates.map((date) => (
          <div key={date} className="bg-gray-50 rounded-2xl p-6 shadow-md mb-3">

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Deadline:{" "}
              {new Date(date).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>

            <ul className="space-y-4">
              {
                groupedTodos[date].map((todo) => (
                    <Todo key={todo._id} todo={todo} refetch={refetch} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoWindow;
