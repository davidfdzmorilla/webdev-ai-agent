import { ChatInterface } from "@/components/ChatInterface";
import { TaskSidebar } from "@/components/TaskSidebar";

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI Agent with Function Calling
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Level 5.3 — GPT-4 + LangChain + 6 Tools
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          <ChatInterface />
        </div>

        {/* Task Sidebar */}
        <div className="w-80 shrink-0 hidden lg:block">
          <TaskSidebar />
        </div>
      </div>
    </main>
  );
}
