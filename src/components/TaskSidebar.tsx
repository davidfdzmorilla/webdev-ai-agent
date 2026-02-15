"use client";

import { useState, useEffect } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "completed";
  dueDate: string | null;
  createdAt: string;
}

export function TaskSidebar() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?status=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Refresh tasks every 5 seconds
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
        <p className="text-sm text-gray-600 mt-1">
          {pendingCount} pending • {completedCount} completed
        </p>
      </div>

      {/* Filter */}
      <div className="p-4 border-b border-gray-300">
        <div className="flex gap-2">
          {(["all", "pending", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="text-center text-gray-500 mt-8">
            <p>Loading tasks...</p>
          </div>
        )}

        {!isLoading && tasks.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">
              {filter === "all"
                ? "No tasks yet. Ask me to create one!"
                : `No ${filter} tasks.`}
            </p>
          </div>
        )}

        {!isLoading && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border ${
                  task.status === "completed"
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-medium text-sm ${
                        task.status === "completed"
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${
                      task.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
