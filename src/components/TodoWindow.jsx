import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetTodosQuery, useCreateTodoMutation, useDeleteTodoMutation } from "../services/todoApi";
import { generateTodos } from "../utils/gemini";
import Todo from "./TodoComponents/Todo";
import toast from "react-hot-toast";
import { TbRefresh } from "react-icons/tb";

const TodoWindow = () => {
  const { currentTodo } = useSelector((state) => state.todo);
  const { data, isLoading, refetch } = useGetTodosQuery({
    collectionId: currentTodo?._id,
  });
  const [createTodo] = useCreateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [prompt, setPrompt] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [showInput, setShowInput] = useState(true);

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

  const handleGenerate = async (regeneratePrompt, regenerateDeadline) => {
    const activePrompt = regeneratePrompt || prompt;
    const activeDeadline = regenerateDeadline || deadline;

    if (!activePrompt.trim() || !activeDeadline.trim()) {
      toast.error('Please fill both fields');
      return
    };
    setLoading(true);

    const aiTodos = await generateTodos(activePrompt);

    if (aiTodos?.error) {
      toast.error(aiTodos.error);
      setLoading(false);
      return;
    }

    if (!aiTodos.length) {
      toast.error("Couldn't generate todos from that input. Try again.");
      setLoading(false);
      return;
    }

    const response = await createTodo({
      todos: aiTodos,
      collectionId: currentTodo._id,
      deadline: activeDeadline,
      sourcePrompt: activePrompt
    }).unwrap();

    const updatedTodo = response?.todos;
    setTodos(updatedTodo);
    setLoading(false);
    setPrompt("");
    setDeadline("");
    setShowInput(false);
  };

  const handleRegenerate = async (sectionTodoIds, sectionDeadline, sectionPrompt) => {
    if (!sectionPrompt) return;
    setLoading(true);

    // Delete all todos in this section
    try {
      await Promise.all(sectionTodoIds.map(id => deleteTodo({ todoId: id }).unwrap()));
    } catch (err) {
      console.error("Error deleting old todos:", err);
    }

    await handleGenerate(sectionPrompt, sectionDeadline);
  };

  if (!currentTodo)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight mb-4">
            AI Todo Manager 🧠
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-light">Select or create a project to get started</p>
        </div>
      </div>
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
    <div className="min-h-screen bg-slate-50 flex flex-col px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 text-slate-800 tracking-tight text-center">
        AI Todo Manager 🧠
      </h1>

      {/* Input card */}
      {showInput ? (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your tasks..."
              className="flex-1 p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white focus:outline-none transition resize-none text-sm sm:text-base"
              rows={3}
            />

            <div className="flex flex-col gap-2 w-full sm:w-1/3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white focus:outline-none cursor-pointer transition text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className={`flex-1 py-3 px-5 rounded-xl text-white font-semibold transition-all duration-200 text-sm sm:text-base ${
                loading
                  ? "bg-violet-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
              }`}
            >
              {loading ? "Thinking..." : "Generate Todos ✨"}
            </button>
            {todos.length > 0 && (
              <button
                onClick={() => setShowInput(false)}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all duration-200 text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full py-3.5 px-5 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/50 transition-all duration-200 text-sm sm:text-base font-medium cursor-pointer"
        >
          + Add more todos
        </button>
      )}

      {/* Todo groups */}
      <div className="mt-6 lg:mt-10 w-full space-y-4 sm:space-y-6">
        {
        sortedDates.map((date) => (
          <div key={date} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80">

            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 inline-block shrink-0"></span>
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              {groupedTodos[date][0]?.sourcePrompt && (
                <button
                  onClick={() => handleRegenerate(
                    groupedTodos[date].map(t => t._id),
                    date,
                    groupedTodos[date][0].sourcePrompt
                  )}
                  disabled={loading}
                  title="Regenerate this section"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    loading
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-400 hover:text-violet-600 hover:bg-violet-50 cursor-pointer active:scale-90"
                  }`}
                >
                  <TbRefresh size={18} className={loading ? "animate-spin" : ""} />
                </button>
              )}
            </div>

            <ul className="space-y-3">
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
