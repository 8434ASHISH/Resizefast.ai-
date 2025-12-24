
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  userName: string;
}

const SidebarLink: React.FC<{ to: string; label: string; icon: string; active: boolean }> = ({ to, label, icon, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
        : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </Link>
);

const AdPlaceholder: React.FC<{ size: string; className?: string }> = ({ size, className = "" }) => (
  <div className={`bg-slate-100 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 text-[10px] rounded-xl uppercase font-bold tracking-widest ${className}`}>
    Ad Space {size}
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, toggleTheme, userName }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { to: '/', label: 'Dashboard', icon: '🏠' },
    { to: '/?category=Image', label: 'Image Tools', icon: '🖼️' },
    { to: '/?category=PDF', label: 'PDF Tools', icon: '📄' },
    { to: '/?category=Utility', label: 'Utilities', icon: '🛠️' },
    { to: '/?category=Text', label: 'Text Tools', icon: '📝' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">R</div>
          <div>
            <h1 className="text-lg font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
              ResizeFast.AI
            </h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">v2.0 Professional</p>
          </div>
        </div>
        
        <Link to="/profile" className="p-4 mx-4 my-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Profile Settings</p>
              <p className="text-sm font-black truncate text-slate-900 dark:text-white">{userName}</p>
            </div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
          {sidebarItems.map((item) => (
            <SidebarLink 
              key={item.to} 
              {...item} 
              active={location.pathname + location.search === item.to || (item.to === '/' && location.pathname === '/' && !location.search)} 
            />
          ))}
          <div className="mt-8">
            <AdPlaceholder size="200x200" className="h-40" />
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Theme</span>
            <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="font-black text-lg text-slate-900 dark:text-white">ResizeFast</span>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-800 dark:text-white">
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </header>

        {/* Global Banner Ad */}
        <div className="w-full flex justify-center py-3 bg-slate-50 dark:bg-slate-950">
          <AdPlaceholder size="728x90" className="w-full max-w-4xl h-20" />
        </div>

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
          {children}
          
          <footer className="mt-20 py-12 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-700 dark:text-slate-200 text-sm font-medium">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">ResizeFast.AI</h3>
                </div>
                <p className="max-w-md leading-relaxed text-slate-600 dark:text-slate-300">The ultimate browser-based toolset for creative professionals. Privacy-first, local execution, and high performance. Your data never leaves your device.</p>
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Resources</h4>
                <ul className="space-y-3 font-bold">
                  <li><Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link></li>
                  <li><Link to="/disclaimer" className="hover:text-blue-600 dark:hover:text-blue-400">Disclaimer</Link></li>
                  <li><Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <AdPlaceholder size="300x250" className="h-[250px] w-full max-w-[300px]" />
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <span>© 2025 ResizeFast.AI - All files processed locally</span>
              <span>Built with Privacy in Mind</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-72 bg-white dark:bg-slate-900 h-full p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Menu</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-2xl text-slate-800 dark:text-white">✕</button>
            </div>
            <nav className="flex-1 space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <Link 
              to="/profile" 
              onClick={() => setIsSidebarOpen(false)}
              className="mt-auto p-4 bg-blue-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between"
            >
               <div>
                <p className="text-xs font-black text-blue-600 dark:text-blue-400 mb-1">User Profile</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{userName}</p>
               </div>
               <span className="text-blue-600">⚙️</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
