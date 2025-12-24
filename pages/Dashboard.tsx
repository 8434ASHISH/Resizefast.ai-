
import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { TOOLS } from '../constants';

interface DashboardProps {
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userName }) => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const categoryFilter = searchParams.get('category');

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesCategory = !categoryFilter || tool.category === categoryFilter;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white">
              Hello, <span className="text-blue-600 dark:text-blue-400">{userName}!</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xl font-medium max-w-2xl leading-relaxed">
              Experience lightning-fast, secure file processing right in your browser. 
              <span className="hidden md:inline"> No uploads, no waiting, just productivity.</span>
            </p>
          </div>
          <div className="hidden lg:block bg-blue-50 dark:bg-blue-900/30 px-6 py-4 rounded-3xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest">Local Node Active</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Search tools (e.g., 'resize', 'pdf', 'qr')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none shadow-sm transition-all text-lg font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform">🔍</span>
          </div>
          <div className="flex gap-2 items-center overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {['All', 'Image', 'PDF', 'Utility', 'Text'].map((cat) => (
              <Link
                key={cat}
                to={cat === 'All' ? '/' : `/?category=${cat}`}
                className={`px-6 py-3 rounded-2xl whitespace-nowrap text-sm font-black tracking-tight transition-all active:scale-95 ${
                  (categoryFilter === cat || (cat === 'All' && !categoryFilter))
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-50 dark:border-slate-800'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            to={`/tool/${tool.id}`}
            className="group relative bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.15)] transition-all flex flex-col"
          >
            <div className="absolute top-8 right-8 text-slate-100 dark:text-slate-900 text-6xl font-black group-hover:text-blue-50 dark:group-hover:text-slate-700 transition-colors pointer-events-none">
              {tool.id.slice(0, 2).toUpperCase()}
            </div>
            <div className="relative">
              <div className="text-5xl mb-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl w-fit group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all duration-300 shadow-sm">
                {tool.icon}
              </div>
              <h3 className="text-2xl font-black mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight text-slate-900 dark:text-white">{tool.name}</h3>
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 flex-1 leading-relaxed">
                {tool.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {tool.features.slice(0, 2).map((feature, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[10px] uppercase font-black tracking-widest rounded-lg border border-slate-100 dark:border-slate-800">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-700">
          <div className="text-6xl mb-6 opacity-30">🔍</div>
          <h3 className="text-2xl font-black mb-2 text-slate-500 dark:text-slate-400 uppercase tracking-tighter">No tools found</h3>
          <p className="text-slate-400 dark:text-slate-500 font-bold">Try searching for something else</p>
        </div>
      )}
      
      {/* Featured Article Section on Dashboard */}
      <section className="mt-24 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 rounded-[3rem] text-white shadow-2xl shadow-blue-500/20">
        <div className="max-w-3xl">
          <span className="bg-white/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Pro Tip</span>
          <h2 className="text-4xl font-black mb-6 leading-tight">Why Client-Side Processing is the Future?</h2>
          <p className="text-indigo-100 text-lg font-medium mb-8 leading-relaxed">Most online tools upload your sensitive files to their servers. We don't. Everything you do on ResizeFast.AI happens 100% on your machine, ensuring total privacy and near-instant processing speeds.</p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95">Explore Tools</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
