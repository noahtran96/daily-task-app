import React, { useState } from "react";
import type { Task } from "./types";

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Learn React", isCompleted: true },
    { id: 2, title: "Sleep", isCompleted: false },
  ]);

  const [inputTitle, setInputTitle] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: inputTitle,
      isCompleted: false,
    };

    setTasks([...tasks, newTask]);
    setInputTitle("");
  };

  const handleToggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
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
                onChange={() => handleToggleTask(task.id)}
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
