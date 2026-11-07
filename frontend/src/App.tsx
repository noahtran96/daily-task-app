import React, { useEffect, useState } from "react";
import type { Task } from "./types";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputTitle, setInputTitle] = useState("");

  // Initialize dark mode state from localStorage or default to false (light mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("flow_theme");
    return savedTheme ? savedTheme === "dark" : false;
  });

  // Synchronize dark mode state with localStorage and HTML class
  useEffect(() => {
    localStorage.setItem("flow_theme", isDarkMode ? "dark" : "light");

    // Toggle the "dark" class on the root html element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Fetch all tasks from backend on initial load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Handle create a new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: inputTitle }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
        setInputTitle("");
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // Handle toggle task completion status
  const handleToggleTask = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });

      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, isCompleted: !currentStatus } : task,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Handle delete task by id
  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="min-h-screen py-12 transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-white">
      <div className="max-w-md mx-auto p-6 rounded-2xl shadow-xl border transition-all duration-300 bg-white border-gray-100 text-gray-800 dark:bg-slate-900 dark:border-slate-800 dark:text-white">
        {/* Header with Dark/Light mode toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            FlowTask
          </h2>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer bg-slate-800 text-white hover:bg-slate-700 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Create task form */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Input new task..."
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 p-2 rounded-lg font-medium transition-colors cursor-pointer text-sm shadow-sm"
          >
            Create
          </button>
        </form>

        {/* Task list */}
        <ul className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-sm py-4 text-gray-400 dark:text-slate-500">
              No tasks yet. Create one above!
            </p>
          ) : (
            tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl transition-all border bg-gray-50 border-gray-100 hover:bg-gray-100/80 dark:bg-slate-800/50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggleTask(task.id, task.isCompleted)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span
                    className={`text-sm font-medium transition-all ${task.isCompleted ? "line-through text-gray-400 dark:text-slate-500" : "text-gray-700 dark:text-slate-200"}`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
