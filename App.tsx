
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ToolContainer from './pages/ToolContainer';
import Profile from './pages/Profile';
import { PrivacyPolicy, Disclaimer, ContactUs } from './pages/LegalPages';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('rf_user_name'));
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      localStorage.setItem('rf_user_name', tempName.trim());
      setUserName(tempName.trim());
    }
  };

  const updateName = (newName: string) => {
    localStorage.setItem('rf_user_name', newName);
    setUserName(newName);
  };

  if (!userName) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 mx-auto shadow-lg shadow-blue-500/30">R</div>
          <h1 className="text-3xl font-black text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Welcome!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Please enter your name to personalize your experience at ResizeFast.AI</p>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Your Name</label>
              <input 
                type="text" 
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all font-semibold"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <Layout isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} userName={userName}>
          <Routes>
            <Route path="/" element={<Dashboard userName={userName} />} />
            <Route path="/tool/:toolId" element={<ToolContainer />} />
            <Route path="/profile" element={<Profile userName={userName} updateName={updateName} />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </HashRouter>
  );
};

export default App;
