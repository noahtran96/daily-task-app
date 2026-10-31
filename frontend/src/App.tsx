import React, { useEffect, useState } from "react";
import type { Task } from "./types";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputTitle, setInputTitle] = useState("");

  // GET
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

  // POST
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

  // PATCH
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

  // DELETE
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
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Daily Task Manager
      </h2>

      {/* Create task form */}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Input new task..."
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/80 rounded-xl transition-all border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleToggleTask(task.id, task.isCompleted)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={`text-sm font-medium transition-all ${task.isCompleted ? "line-through text-gray-400" : "text-gray-700"}`}
              >
                {task.title}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
