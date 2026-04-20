
import { useState } from "react";
import CollectionBar from "./components/CollectionBar";
import TodoWindow from "./components/TodoWindow";
import { Toaster } from "react-hot-toast";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";


export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
      <>
            <Toaster
                position="top-center"
                reverseOrder={false}
              />

            {/* Mobile hamburger */}
            <button
              className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg text-slate-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <IoClose size={22} /> : <HiMenuAlt2 size={22} />}
            </button>

            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <div className="flex min-h-screen bg-slate-50">
                {/* Sidebar */}
                <aside className={`
                  fixed lg:sticky top-0 left-0 z-40 h-screen
                  w-72 shrink-0
                  transform transition-transform duration-300 ease-in-out
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                  lg:translate-x-0
                `}>
                  <CollectionBar onNavigate={() => setSidebarOpen(false)} />
                </aside>

                {/* Main content */}
                <main className="flex-1 min-w-0">
                  <TodoWindow />
                </main>
            </div>
      </>
  );
}

